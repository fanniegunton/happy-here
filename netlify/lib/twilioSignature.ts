import { createHmac, timingSafeEqual } from 'node:crypto';

// Validates Twilio's X-Twilio-Signature header for form-encoded webhooks.
// Algorithm (https://www.twilio.com/docs/usage/security#validating-requests):
// concatenate the full request URL with each POST param's key+value, sorted
// alphabetically by key, then HMAC-SHA1 with the auth token, base64-encoded.
export function computeTwilioSignature(
  authToken: string,
  url: string,
  params: Record<string, string>
): string {
  const data =
    url +
    Object.keys(params)
      .sort()
      .map((key) => key + params[key])
      .join('');
  return createHmac('sha1', authToken).update(data, 'utf8').digest('base64');
}

export function isValidTwilioSignature(
  authToken: string,
  signature: string | undefined,
  url: string,
  params: Record<string, string>
): boolean {
  if (!signature) return false;
  const expected = Buffer.from(computeTwilioSignature(authToken, url, params));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
