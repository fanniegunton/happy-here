/** @jsxImportSource @emotion/react */
import React from 'react';
import theme from '@styles/theme';

export default function JournalPage() {
  return (
    <div
      css={{
        padding: '0 20px',
        maxWidth: 1000,
        minHeight: '100vh',
        [theme.mobile]: {
          margin: '0 30px',
          padding: 0,
        },
      }}
    >
      <h1
        css={{
          ...theme.h1,
          marginBottom: 60,
          [theme.tablet]: { fontSize: 64 },
          [theme.mobile]: { fontSize: 40, paddingTop: 20 },
        }}
      >
        Journal Coming Soon!
      </h1>
    </div>
  );
}
