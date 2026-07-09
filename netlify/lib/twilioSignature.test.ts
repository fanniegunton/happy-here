import { describe, it, expect } from 'vitest';
import { computeTwilioSignature, isValidTwilioSignature } from './twilioSignature';

// Known-answer test using the example request from Twilio's request-validation
// docs. The expected signature was generated with the official twilio package:
// twilio.getExpectedTwilioSignature(authToken, url, params), and
// twilio.validateRequest confirms it validates.
const DOC_AUTH_TOKEN = '12345';
const DOC_URL = 'https://mycompany.com/myapp.php?foo=1&bar=2';
const DOC_PARAMS = {
  CallSid: 'CA1234567890ABCDE',
  Caller: '+14158675310',
  Digits: '1234',
  From: '+14158675310',
  To: '+18005551212',
};
const DOC_SIGNATURE = 'GvWf1cFY/Q7PnoempGyD5oXAezc=';

describe('computeTwilioSignature', () => {
  it('matches the documented Twilio example signature', () => {
    expect(computeTwilioSignature(DOC_AUTH_TOKEN, DOC_URL, DOC_PARAMS)).toBe(DOC_SIGNATURE);
  });

  it('sorts parameters alphabetically regardless of input order', () => {
    const shuffled = { To: '+18005551212', CallSid: 'CA1234567890ABCDE', Digits: '1234', Caller: '+14158675310', From: '+14158675310' };
    expect(computeTwilioSignature(DOC_AUTH_TOKEN, DOC_URL, shuffled)).toBe(DOC_SIGNATURE);
  });
});

describe('isValidTwilioSignature', () => {
  it('accepts the documented valid signature', () => {
    expect(isValidTwilioSignature(DOC_AUTH_TOKEN, DOC_SIGNATURE, DOC_URL, DOC_PARAMS)).toBe(true);
  });

  it('rejects a missing signature', () => {
    expect(isValidTwilioSignature(DOC_AUTH_TOKEN, undefined, DOC_URL, DOC_PARAMS)).toBe(false);
  });

  it('rejects a tampered parameter', () => {
    const tampered = { ...DOC_PARAMS, Digits: '9999' };
    expect(isValidTwilioSignature(DOC_AUTH_TOKEN, DOC_SIGNATURE, DOC_URL, tampered)).toBe(false);
  });

  it('rejects the wrong auth token', () => {
    expect(isValidTwilioSignature('wrong-token', DOC_SIGNATURE, DOC_URL, DOC_PARAMS)).toBe(false);
  });

  it('rejects a different URL', () => {
    expect(
      isValidTwilioSignature(DOC_AUTH_TOKEN, DOC_SIGNATURE, 'https://evil.example.com/', DOC_PARAMS)
    ).toBe(false);
  });
});
