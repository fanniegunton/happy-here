import { describe, it, expect } from 'vitest';
import { normalizeTwilioPayload } from './normalize';

describe('normalizeTwilioPayload', () => {
  it('normalizes an SMS with no media', () => {
    const message = normalizeTwilioPayload({
      From: '+15125551234',
      Body: 'New happy hour at Kitty Cohen’s: $6 frozens til 7',
      NumMedia: '0',
    });
    expect(message).toMatchObject({
      channel: 'twilio',
      senderId: '+15125551234',
      text: 'New happy hour at Kitty Cohen’s: $6 frozens til 7',
      media: [],
    });
  });

  it('collects all MMS media URLs with their content types', () => {
    const message = normalizeTwilioPayload({
      From: '+15125551234',
      Body: '',
      NumMedia: '2',
      MediaUrl0: 'https://api.twilio.com/media/0',
      MediaContentType0: 'image/jpeg',
      MediaUrl1: 'https://api.twilio.com/media/1',
      MediaContentType1: 'image/png',
    });
    expect(message?.media).toEqual([
      { kind: 'twilio', url: 'https://api.twilio.com/media/0', contentType: 'image/jpeg' },
      { kind: 'twilio', url: 'https://api.twilio.com/media/1', contentType: 'image/png' },
    ]);
  });

  it('returns null when From is missing', () => {
    expect(normalizeTwilioPayload({ Body: 'hi' })).toBeNull();
  });
});
