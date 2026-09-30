/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import theme from '@styles/theme';

const REASON_OPTIONS = [
  'Add my venue',
  "Update my venue's info",
  'Report inaccurate info',
  'Partnership / press',
  'General question',
];

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const inputStyles = {
  width: '100%',
  padding: '10px 16px',
  fontSize: 16,
  fontFamily: theme.displayFontFamily,
  border: `1px solid ${theme.lightGrout}`,
  borderRadius: 8,
  outline: 'none',
  background: 'transparent',
  color: theme.black,
  transition: 'border-color 0.2s',
  '&:focus': { borderColor: theme.black },
} as const;

const labelStyles = {
  fontSize: 12,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  fontWeight: 500,
  display: 'block',
  marginBottom: 8,
};

const fieldWrapperStyles = { marginBottom: 24 };

export default function ContactPage() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoName(null);
      setPhotoError(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.');
      e.target.value = '';
      setPhotoName(null);
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('That photo is larger than 5MB. Please choose a smaller file.');
      e.target.value = '';
      setPhotoName(null);
      return;
    }
    setPhotoError(null);
    setPhotoName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState('submitting');
    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
      setSubmitState('success');
    } catch (err) {
      setSubmitState('error');
    }
  };

  if (submitState === 'success') {
    return (
      <div
        css={{
          padding: '0 20px',
          maxWidth: 700,
          [theme.mobile]: { margin: '0 30px', padding: 0 },
        }}
      >
        <h1
          css={{
            ...theme.h1,
            marginBottom: 24,
            [theme.tablet]: { fontSize: 64 },
            [theme.mobile]: { fontSize: 40, paddingTop: 20 },
          }}
        >
          Thanks!
        </h1>
        <p
          css={{
            fontFamily: theme.displayFontFamily,
            fontSize: 20,
            color: theme.black,
            lineHeight: 1.375,
            [theme.mobile]: { fontSize: 16 },
          }}
        >
          We got your message and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div
      css={{
        padding: '0 20px',
        maxWidth: 700,
        [theme.mobile]: { margin: '0 30px', padding: 0 },
      }}
    >
      <h1
        css={{
          ...theme.h1,
          marginBottom: 16,
          [theme.tablet]: { fontSize: 64 },
          [theme.mobile]: { fontSize: 40, paddingTop: 20 },
        }}
      >
        Contact
      </h1>
      <p
        css={{
          fontFamily: theme.displayFontFamily,
          fontSize: 20,
          color: theme.black,
          lineHeight: 1.375,
          marginBottom: 40,
          [theme.mobile]: { fontSize: 16 },
        }}
      >
        Own a venue we should know about, spot something out of date, or just want to say hi?
        Fill out the form below.
      </p>

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        css={{ display: 'block' }}
      >
        <input type="hidden" name="form-name" value="contact" />
        <p css={{ display: 'none' }}>
          <label>
            Don't fill this out if you're human: <input name="bot-field" />
          </label>
        </p>

        <div css={fieldWrapperStyles}>
          <label htmlFor="venueName" css={labelStyles}>
            Venue Name
          </label>
          <input id="venueName" name="venueName" type="text" required css={inputStyles} />
        </div>

        <div css={fieldWrapperStyles}>
          <label htmlFor="reason" css={labelStyles}>
            Reason
          </label>
          <select id="reason" name="reason" required defaultValue="" css={inputStyles}>
            <option value="" disabled>
              Select a reason
            </option>
            {REASON_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div css={fieldWrapperStyles}>
          <label htmlFor="details" css={labelStyles}>
            Details
          </label>
          <textarea
            id="details"
            name="details"
            required
            rows={6}
            css={{ ...inputStyles, resize: 'vertical', fontFamily: theme.displayFontFamily }}
          />
        </div>

        <div css={fieldWrapperStyles}>
          <label htmlFor="photo" css={labelStyles}>
            Photo (optional)
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            css={{ fontFamily: theme.displayFontFamily, fontSize: 14 }}
          />
          {photoName && (
            <div css={{ fontSize: 14, marginTop: 8, color: theme.black }}>
              Selected: {photoName}
            </div>
          )}
          {photoError && (
            <div css={{ fontSize: 14, marginTop: 8, color: theme.fireRed }}>{photoError}</div>
          )}
          <div css={{ fontSize: 12, marginTop: 8, opacity: 0.6 }}>
            Images only, up to 5MB.
          </div>
        </div>

        <div css={fieldWrapperStyles}>
          <label htmlFor="contactName" css={labelStyles}>
            Contact Name
          </label>
          <input id="contactName" name="contactName" type="text" required css={inputStyles} />
        </div>

        <div css={fieldWrapperStyles}>
          <label htmlFor="contactInfo" css={labelStyles}>
            Email or Phone (either works)
          </label>
          <input id="contactInfo" name="contactInfo" type="text" required css={inputStyles} />
        </div>

        {submitState === 'error' && (
          <div
            css={{
              fontSize: 14,
              color: theme.fireRed,
              marginBottom: 24,
            }}
          >
            Something went wrong sending your message. Please try again, or email us directly at{' '}
            <a
              href="mailto:happyhappyhere@gmail.com"
              css={{ textDecoration: 'underline' }}
            >
              happyhappyhere@gmail.com
            </a>
            .
          </div>
        )}

        <button
          type="submit"
          disabled={submitState === 'submitting'}
          css={{
            padding: '12px 32px',
            borderRadius: '20px',
            cursor: submitState === 'submitting' ? 'default' : 'pointer',
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'inherit',
            fontWeight: 500,
            backgroundColor: theme.black,
            color: theme.white,
            border: `2px solid ${theme.black}`,
            opacity: submitState === 'submitting' ? 0.6 : 1,
            transition: 'background-color 0.2s, color 0.2s',
            '&:hover': submitState === 'submitting'
              ? {}
              : {
                  backgroundColor: theme.lavender,
                  border: `2px solid ${theme.lavender}`,
                },
          }}
        >
          {submitState === 'submitting' ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
