import { css } from '@emotion/react';
import normalize from 'emotion-normalize';

const breakpoints = {
  smallMobile: '@media (max-width: 400px)',
  mobile: '@media (max-width: 700px)',
  tablet: '@media (max-width: 900px)',
  smallDesktop: '@media (max-width: 1100px)',
} as const;

const colors = {
  white: '#FFFFFF',
  black: '#000000',
  pink: '#CC6F97',
  hotPink: '#B13076',
  babyPink: '#FFE7E3',
  candyBlue: '#9FC9C2',
  bananaYellow: '#FFF393',
  sodaYellow: '#D8B85B',
  fireRed: '#D14C5C',
  coral: '#d28e79',
  nudeStone: '#FFD7B9',
  playBlue: '#4F67B1',
  stainedCork: '#B44B28',
  mocha: '#caa498',
  mutedLemon: '#e1c994',
  lightGrout: '#e4e3e4',
  lemonYellow: '#ffde50',
  oceanBlue: '#006eff',
  valenciaOrange: '#e09232',
  lilac: '#b5b5ff',
} as const;

const displayFontFamily = 'Lato, Helvetica, sans-serif';
const fancyFontFamily = 'Playfair Display, Georgia, serif';

const theme = {
  ...colors,
  ...breakpoints,
  displayFontFamily,
  fancyFontFamily,

  h1: {
    fontFamily: fancyFontFamily,
    fontWeight: 300,
    fontSize: 72,
    lineHeight: 1.35,
    letterSpacing: '-0.02em',
    [breakpoints.tablet]: {
      fontSize: 64,
    },
    [breakpoints.mobile]: {
      fontSize: 40,
    },
  },
  h2: {
    fontFamily: displayFontFamily,
    fontWeight: 400,
    fontSize: 48,
    lineHeight: 1.35,
    [breakpoints.tablet]: {
      fontSize: 40,
    },
    [breakpoints.mobile]: {
      fontSize: 32,
    },
  },

  h3: {
    fontFamily: displayFontFamily,
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1.35,
    margin: 0,
    [breakpoints.tablet]: {
      fontSize: 32,
    },
    [breakpoints.mobile]: {
      fontSize: 28,
    },
  },

  h3Alt: {
    fontFamily: fancyFontFamily,
    fontSize: 36,
    fontWeight: 500,
    lineHeight: 1.35,
    letterSpacing: '0.03em',
    margin: 0,
    [breakpoints.tablet]: {
      fontSize: 32,
    },
    [breakpoints.mobile]: {
      fontSize: 28,
    },
  },

  nav: {
    fontFamily: displayFontFamily,
    fontSize: 20,
    fontWeight: 400,
    lineHeight: 1.0,
    textTransform: 'uppercase' as const,
    [breakpoints.tablet]: {
      fontSize: 18,
    },
    [breakpoints.mobile]: {
      fontSize: 14,
    },
  },
  postTitle: {
    fontFamily: fancyFontFamily,
    fontSize: 28,
    fontWeight: 400,
    lineHeight: 1.3,
    textTransform: 'capitalize' as const,
    letterSpacing: '0.02em',
    [breakpoints.tablet]: {
      fontSize: 24,
    },
    [breakpoints.mobile]: {
      fontSize: 22,
    },
  },
  postDetails: {
    fontFamily: displayFontFamily,
    fontSize: 22,
    fontWeight: 400,
    lineHeight: 1.7,
    color: colors.black,
    [breakpoints.tablet]: {
      fontSize: 16,
    },
  },
  subtitle: {
    fontFamily: displayFontFamily,
    fontSize: 24,
    fontWeight: 300,
    lineHeight: 1.7,
    [breakpoints.tablet]: {
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 400,
    },
    [breakpoints.mobile]: {
      fontSize: 14,
      lineHeight: 1.3,
    },
  },

  tags: {
    fontFamily: displayFontFamily,
    fontSize: 16,
    color: colors.black,
    lineHeight: 1.375,
    textTransform: 'lowercase' as const,
    [breakpoints.tablet]: {
      fontSize: 14,
    },
  },
  bolded: {
    fontFamily: displayFontFamily,
    fontSize: 18,
    fontWeight: 700,
    color: colors.black,
    lineHeight: 1.375,
  },
  body: {
    fontFamily: displayFontFamily,
    fontSize: 16,
    color: colors.black,
    lineHeight: 1.375,
  },
  floatLine: {
    boxShadow: 'var(--shadow-elevation-medium)',
  },
  floatBox: {
    boxShadow: 'var(--shadow-elevation-high)',
  },
  extraFloatBox: {
    boxShadow: 'var(--shadow-elevation-extra)',
  },
} as const;

export const globalStyles = [
  normalize,
  css`
    :root {
      --shadow-color: 20deg 41% 44%;
      --shadow-elevation-low: -0.2px 0.8px 0.9px hsl(var(--shadow-color) / 0.34),
        -0.4px 1.3px 1.5px -1.2px hsl(var(--shadow-color) / 0.34),
        -1px 3.1px 3.7px -2.5px hsl(var(--shadow-color) / 0.34);
      --shadow-elevation-medium: -0.2px 0.8px 0.9px hsl(var(--shadow-color) / 0.36),
        -0.8px 2.5px 3px -0.8px hsl(var(--shadow-color) / 0.36),
        -2px 6.3px 7.4px -1.7px hsl(var(--shadow-color) / 0.36),
        -4.8px 15.3px 18px -2.5px hsl(var(--shadow-color) / 0.36);
      --shadow-elevation-high: -0.2px 0.8px 0.9px hsl(var(--shadow-color) / 0.34),
        -1.4px 4.5px 5.3px -0.4px hsl(var(--shadow-color) / 0.34),
        -2.6px 8.4px 9.9px -0.7px hsl(var(--shadow-color) / 0.34),
        -4.3px 13.7px 16.2px -1.1px hsl(var(--shadow-color) / 0.34),
        -6.9px 21.9px 25.8px -1.4px hsl(var(--shadow-color) / 0.34),
        -10.7px 34.3px 40.4px -1.8px hsl(var(--shadow-color) / 0.34),
        -16.3px 52.1px 61.4px -2.1px hsl(var(--shadow-color) / 0.34),
        -24px 76.7px 90.4px -2.5px hsl(var(--shadow-color) / 0.34);
      --shadow-elevation-extra: -0.2px 0.8px 0.9px hsl(var(--shadow-color) / 0.34),
        -2.2px 6.5px 7px -0.2px hsl(var(--shadow-color) / 0.34),
        -3.4px 9.4px 9.9px -0.3px hsl(var(--shadow-color) / 0.34),
        -3.9px 11.2px 14.2px -1.1px hsl(var(--shadow-color) / 0.34),
        -6.9px 21.9px 25.8px -1.4px hsl(var(--shadow-color) / 0.34),
        -10.7px 34.3px 40.4px -1.8px hsl(var(--shadow-color) / 0.34),
        -16.3px 52.1px 61.4px -2.1px hsl(var(--shadow-color) / 0.34),
        -24px 76.7px 90.4px -2.5px hsl(var(--shadow-color) / 0.34);
      --headerBottomMargin: 0px;

      ${breakpoints.tablet} {
        --headerBottomMargin: 0px;
      }
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }

    html {
      font-family: ${displayFontFamily};
      font-size: 16px;
      color: ${colors.black};
      background: ${colors.white};
      line-height: 1.375;
      height: 100%;
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
      vertical-align: baseline;
      font-style: normal;
      word-break: break-word;

      text-rendering: optimizeLegibility;
      font-feature-settings: 'liga', 'kern' 1;
      font-kerning: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    img {
      max-width: 100%;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0;
      font-size: inherit;
      line-height: inherit;
    }

    body {
      color: ${colors.black};
      background-color: ${colors.white};
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }

    a {
      color: inherit;
      text-decoration: none;
      box-sizing: border-box;
    }

    p {
      display: inherit;
      margin-block-start: 0;
      margin-block-end: 0;
      margin-inline-start: 0;
      margin-inline-end: 0;
    }

    ul {
      list-style-type: none;
      margin-block-start: 0;
      margin-block-end: 0;
      margin-inline-start: 0;
      margin-inline-end: 0;
    }

    .subtle-box {
      box-shadow: var(--shadow-elevation-low);
    }

    .notice-me-box {
      box-shadow: var(--shadow-elevation-medium);
    }

    .in-your-face-box {
      box-shadow: var(--shadow-elevation-high);
    }

    .leaflet-popup-content {
      margin: 3px 14px 3px 10px;
    }
  `,
];

export type Theme = typeof theme;

export default theme;
