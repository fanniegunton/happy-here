import { appendToBatch, claimBatchIfCurrent } from './batch';
import {
  BATCH_WINDOW_MS,
  DUPLICATE_LOOKBACK_MS,
  AUTO_BLOCK_BURST_COUNT,
  AUTO_BLOCK_BURST_WINDOW_MS,
} from './config';
import { isOverlappingContent } from './duplicate';
import { extractSubmission } from './extract';
import { downloadBatchMedia } from './media';
import { recordAndCheckRateLimit } from './rateLimit';
import {
  autoBlockSender,
  createSubmissionDraft,
  getRecentPendingSubmissions,
  getVenueList,
  isSenderBlocked,
  uploadImageAsset,
} from './sanity';
import type { IntakeChannel, NormalizedMessage, SubmissionChannel } from './types';

export type InboundOutcome =
  | { action: 'blocked' }
  | { action: 'rate_limited' }
  | { action: 'batched'; seq: number };

// Per-message gate: blocklist first, then rate limit, then buffer into the
// sender's batch. Runs before any Claude call or Sanity write.
export async function handleInbound(message: NormalizedMessage): Promise<InboundOutcome> {
  if (await isSenderBlocked(message.channel, message.senderId)) {
    return { action: 'blocked' };
  }

  const verdict = await recordAndCheckRateLimit(message.channel, message.senderId);
  if (verdict.shouldAutoBlock) {
    try {
      await autoBlockSender(
        message.channel,
        message.senderId,
        `Auto-blocked: ${AUTO_BLOCK_BURST_COUNT}+ messages within ${Math.round(
          AUTO_BLOCK_BURST_WINDOW_MS / 60_000
        )} minutes`
      );
    } catch (error) {
      console.error('Failed to auto-block sender:', error);
    }
    return { action: 'rate_limited' };
  }
  if (verdict.limited) {
    return { action: 'rate_limited' };
  }

  const seq = await appendToBatch(message);
  return { action: 'batched', seq };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Maps the transport channel to the venueSubmission display channel; new
// channels add their mapping here.
function toSubmissionChannel(channel: IntakeChannel, hasMedia: boolean): SubmissionChannel {
  switch (channel) {
    case 'twilio':
      return hasMedia ? 'mms' : 'sms';
  }
}

// Background half of the pipeline, run inside the process-batch background
// function after the webhook has already responded: wait out the batch
// window, then process the batch iff no newer message from this sender
// superseded us.
export async function processBatchAfterWindow(
  channel: IntakeChannel,
  senderId: string,
  seq: number
): Promise<void> {
  await sleep(BATCH_WINDOW_MS);

  const messages = await claimBatchIfCurrent(channel, senderId, seq);
  if (!messages || messages.length === 0) return;

  try {
    await processBatch(channel, senderId, messages);
  } catch (error) {
    console.error(`Batch processing failed for ${channel}:${senderId}:`, error);
  }
}

async function processBatch(
  channel: IntakeChannel,
  senderId: string,
  messages: NormalizedMessage[]
): Promise<void> {
  const combinedText = messages
    .map((message) => message.text.trim())
    .filter(Boolean)
    .join('\n');
  const mediaRefs = messages.flatMap((message) => message.media);
  const receivedAt = messages[0].receivedAt;

  const [images, venues] = await Promise.all([
    downloadBatchMedia(mediaRefs),
    getVenueList(),
  ]);

  const extraction = await extractSubmission(combinedText, images, venues);

  // Duplicate detection: recent pending submissions for the same venue with
  // clearly overlapping content.
  let duplicateOfId: string | null = null;
  if (extraction.matchedVenueId) {
    const since = new Date(Date.now() - DUPLICATE_LOOKBACK_MS).toISOString();
    const recent = await getRecentPendingSubmissions(extraction.matchedVenueId, since);
    const newContent = [combinedText, extraction.specialsGuess ?? ''].join('\n');
    const match = recent.find((submission) =>
      isOverlappingContent(
        newContent,
        [submission.rawText ?? '', submission.specialsGuess ?? ''].join('\n')
      )
    );
    duplicateOfId = match?._id ?? null;
  }

  const imageAssetIds: string[] = [];
  for (const image of images) {
    imageAssetIds.push(await uploadImageAsset(image));
  }

  const submissionId = await createSubmissionDraft({
    channel: toSubmissionChannel(channel, mediaRefs.length > 0),
    fromIdentifier: senderId,
    receivedAt,
    rawText: combinedText,
    imageAssetIds,
    extraction,
    duplicateOfId,
  });

  console.log(
    `Created venueSubmission ${submissionId} (${messages.length} message(s), ${imageAssetIds.length} image(s), confidence ${extraction.confidenceScore})`
  );
}
