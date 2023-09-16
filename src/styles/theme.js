import normalize from "emotion-normalize"

const breakpoints = {
  smallMobile: "@media (max-width: 400px)",
  mobile: "@media (max-width: 700px)",
  tablet: "@media (max-width: 900px)",
}

const colors = {
  white: "#FFFFFF",
  black: "#000000",
  pink: "#CC6F97",
  hotPink: "#B13076",
  candyBlue: "#9FC9C2",
  sodaYellow: "#D8B85B",
}

const displayFontFamily = "Lato, Helvetica, sans-serif"
const fancyFontFamily = "Abril Fatface, Georgia, serif"

export default {
  ...colors,
  ...breakpoints,
  displayFontFamily,
  fancyFontFamily,

  h1: {
    fontFamily: fancyFontFamily,
    fontWeight: 300,
    fontSize: 72,
    lineHeight: 1.35,
    [breakpoints.tablet]: {
      fontSize: 64,
    },
    [breakpoints.mobile]: {
      fontSize: 48,
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

  nav: {
    fontFamily: displayFontFamily,
    fontSize: 24,
    fontWeight: 400,
    lineHeight: 1.1,
    textTransform: "uppercase",
    [breakpoints.tablet]: {
      fontSize: 22,
    },
    [breakpoints.mobile]: {
      fontSize: 20,
    },
  },
  postTitle: {
    fontFamily: fancyFontFamily,
    fontSize: 28,
    fontWeight: 400,
    lineHeight: 1.3,
    textTransform: "capitalize",
    letterSpacing: "0.02em",
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
    color: colors.loden,
    [breakpoints.tablet]: {
      fontSize: 16,
    },
  },
  subtitle: {
    fontFamily: displayFontFamily,
    fontSize: 20,
    fontWeight: 400,
    lineHeight: 1.1,
    [breakpoints.tablet]: {
      fontSize: 18,
    },
  },

  tags: {
    fontFamily: displayFontFamily,
    fontSize: 16,
    color: colors.black,
    lineHeight: 1.375,
    textTransform: "lowercase",
    [breakpoints.tablet]: {
      fontSize: 14,
    },
  },
  bolded: {
    fontFamily: displayFontFamily,
    fontSize: 16,
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
    boxShadow: "var(--shadow-elevation-medium)",
  },
  floatBox: {
    boxShadow: "var(--shadow-elevation-high)",
  },
}

export const globalStyles = [
  normalize,
  {
    ":root": {
      "--shadow-color": "20deg 41% 44%",
      "--shadow-elevation-low":
        "-0.2px 0.8px 0.9px hsl(var(--shadow-color) / 0.34), -0.4px 1.3px 1.5px -1.2px hsl(var(--shadow-color) / 0.34), -1px 3.1px 3.7px -2.5px hsl(var(--shadow-color) / 0.34)",
      "--shadow-elevation-medium":
        "-0.2px 0.8px 0.9px hsl(var(--shadow-color) / 0.36), -0.8px 2.5px 3px -0.8px hsl(var(--shadow-color) / 0.36), -2px 6.3px 7.4px -1.7px hsl(var(--shadow-color) / 0.36), -4.8px 15.3px 18px -2.5px hsl(var(--shadow-color) / 0.36)",
      "--shadow-elevation-high":
        " -0.2px 0.8px 0.9px hsl(var(--shadow-color) / 0.34), -1.4px 4.5px 5.3px -0.4px hsl(var(--shadow-color) / 0.34), -2.6px 8.4px 9.9px -0.7px hsl(var(--shadow-color) / 0.34), -4.3px 13.7px 16.2px -1.1px hsl(var(--shadow-color) / 0.34), -6.9px 21.9px 25.8px -1.4px hsl(var(--shadow-color) / 0.34), -10.7px 34.3px 40.4px -1.8px hsl(var(--shadow-color) / 0.34), -16.3px 52.1px 61.4px -2.1px hsl(var(--shadow-color) / 0.34), -24px 76.7px 90.4px -2.5px hsl(var(--shadow-color) / 0.34)",
      "--headerBottomMargin": "0px",
      [breakpoints.tablet]: {
        "--headerBottomMargin": "0px",
      },
    },
    "*, *:before, *:after": {
      boxSizing: "inherit",
    },
    html: {
      fontFamily: displayFontFamily,
      fontSize: 16,
      color: colors.black,
      lineHeight: 1.375,
      margin: 0,
      padding: 0,
      boxSizing: "border-box",

      // Improve browser font rendering
      textRendering: "optimizeLegibility",
      fontFeatureSettings: "'liga', 'kern' 1",
      fontKerning: "normal",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },

    "h1, h2, h3, h4, h5, h6": {
      margin: 0,
      fontSize: "inherit",
      lineHeight: "inherit",
    },
    body: {
      // color: colors.loden,
      // backgroundColor: colors.shell,
      // background: "linear-gradient(90deg, #CDA564 0%, #E4AA8E 70%)",
      background:
        "linear-gradient(90deg, #D28E79 0%, #CDA564 47.92%, #D28E79 98.44%)",
    },
    a: {
      color: "inherit",
      textDecoration: "none",
      boxSizing: "border-box",
    },
    ".subtle-box": {
      boxShadow: "var(--shadow-elevation-low)",
    },
    ".in-your-face-box": {
      boxShadow: "var(--shadow-elevation-high)",
    },
  },
]
