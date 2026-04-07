/** @jsxImportSource @emotion/react */
import React from 'react';
import theme from '@styles/theme';
import logo from '../../assets/HH-logo.jpg';
import instagramIcon from '../../images/Instagram.svg';

export default function Footer() {
  return (
    <footer
      css={{
        margin: '120px -40px -40px',
        [theme.mobile]: {
          margin: '40px auto 0',
          padding: '0 20px 40px',
          background: '#b5b5ff',
        },
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          background: '#006eff',
          color: '#FFFFFF',
          padding: '20px 40px 40px',
          borderRadius: '0 0 37px 37px',
          [theme.mobile]: {
            padding: 0,
            background: 'transparent',
            borderRadius: 0,
            color: 'inherit',
          },
        }}
      >
        <div css={{ flex: 1 }}>
          <div
            css={{
              fontFamily: theme.displayFontFamily,
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.0,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              gap: 40,
              [theme.mobile]: {
                marginTop: 20,
                justifyContent: 'space-between',
              },
              '@media (max-width: 580px)': {
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'start',
                justifyContent: 'start',
                gap: 20,
              },
            }}
          >
            <a href="/lists">Lists</a>
            <a href="/about">About</a>
            <a href="/journal">Journal</a>
            <a href="mailto:happyhappyhere@gmail.com">Contact</a>
            <a
              href="https://www.instagram.com/takeouttracker/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={(instagramIcon as any).src}
                alt="Instagram"
                css={{
                  width: 'auto',
                  filter: 'brightness(0) invert(1)',
                  [theme.mobile]: {
                    alignContent: 'end',
                    marginLeft: 8,
                    filter: 'none',
                  },
                }}
              />
            </a>
          </div>
          <div
            css={{
              marginTop: 40,
              fontFamily: theme.fancyFontFamily,
              fontSize: 18,
              lineHeight: 1.8,
              maxWidth: '60%',
              [theme.mobile]: {
                fontSize: 16,
                maxWidth: '100%',
                marginTop: 40,
              },
            }}
          >
            Happy Here tracks Austin's happiest hours—built by locals, for locals. No chains, no
            filler, just great food, drinks, and the people behind them.
          </div>
        </div>
        <a
          href="/"
          css={{
            maxWidth: '45%',
            [theme.mobile]: {
              alignContent: 'end',
            },
          }}
        >
          <img
            src={(logo as any).src}
            alt="Happy Here logo with a happy hour drink"
            css={{
              display: 'block',
              width: 80,
              objectFit: 'cover',
              borderRadius: 90,
              [theme.mobile]: {
                width: 120,
              },
            }}
          />
        </a>
      </div>
    </footer>
  );
}
