import { requireEnv } from './config';
import type { DownloadedMedia, MediaRef } from './types';

// Image types accepted by both Claude vision and Sanity's image pipeline.
const SUPPORTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

async function downloadTwilioMedia(url: string, contentType: string): Promise<DownloadedMedia> {
  const accountSid = requireEnv('TWILIO_ACCOUNT_SID');
  const authToken = requireEnv('TWILIO_AUTH_TOKEN');
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  if (!response.ok) {
    throw new Error(`Twilio media download failed (${response.status}): ${url}`);
  }
  const data = Buffer.from(await response.arrayBuffer());
  const resolvedType = response.headers.get('content-type') ?? contentType;
  return {
    data,
    contentType: resolvedType,
    filename: `mms-${Date.now()}.${EXTENSION_BY_TYPE[resolvedType] ?? 'jpg'}`,
  };
}

// Downloads every image in the batch; non-image attachments (e.g. video MMS)
// are skipped. A single failed download is logged and skipped rather than
// sinking the whole submission. New channels add their download path to the
// per-kind branching below.
export async function downloadBatchMedia(refs: MediaRef[]): Promise<DownloadedMedia[]> {
  const downloads: DownloadedMedia[] = [];
  for (const ref of refs) {
    try {
      if (ref.kind === 'twilio') {
        if (!SUPPORTED_IMAGE_TYPES.has(ref.contentType)) continue;
        downloads.push(await downloadTwilioMedia(ref.url, ref.contentType));
      }
    } catch (error) {
      console.error('Media download failed, skipping attachment:', error);
    }
  }
  return downloads.filter((media) => SUPPORTED_IMAGE_TYPES.has(media.contentType));
}
