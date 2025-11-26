import React from "react"
import { Link } from "gatsby"
import theme from "../styles/theme"
import insta from "../images/Instagram.svg"
import photo from "../assets/HH-logo.jpg"

const Footer = () => {
  return (
    <div
      css={{
        margin: "120px -40px -40px",
        [theme.mobile]: {
          margin: "40px auto 0",
          padding: "0 20px 40px",
          background: theme.lilac,
        },
      }}
    >
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          background: theme.oceanBlue, // Change this to customize footer background color
          color: theme.white,
          padding: "20px 40px 40px",
          borderRadius: "0 0 37px 37px", // Match Layout's 45px border radius minus 8px border
          [theme.mobile]: {
            padding: 0,
            background: "transparent",
            borderRadius: 0,
            color: "inherit",
          },
        }}
      >
        <div>
          <div
            css={{
              ...theme.nav,
              fontSize: 18,
              flex: "1 0 auto",
              maxWidth: 600,
              textWrap: "balance",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              transform: "0 16px",
              gap: 40,
              [theme.mobile]: {
                marginTop: 20,
                justifyContent: "space-between",
              },
              "@media (max-width: 580px)": {
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "start",
                justifyContent: "start",
                gap: 20,
              },
            }}
          >
            <Link to="/lists">Lists</Link>
            <Link to="/about">About</Link>
            <Link to="/journal">Journal</Link>
            <a href="mailto:happyhappyhere@gmail.com">Contact</a>
            <a
              href="https://www.instagram.com/takeouttracker/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={insta}
                css={{
                  width: "auto",
                  filter: "brightness(0) invert(1)", // Make Instagram icon white
                  [theme.mobile]: {
                    alignContent: "end",
                    marginLeft: 8,
                    filter: "none",
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
              maxWidth: "60%",
              textWrap: "balance",
              [theme.mobile]: {
                fontSize: 16,
                maxWidth: "100%",
                marginTop: 40,
              },
            }}
          >
            Happy Here tracks Austin’s happiest hours—built by locals, for
            locals. No chains, no filler, just great food, drinks, and the
            people behind them.
          </div>
        </div>
        <Link
          to="/"
          css={{
            maxWidth: "45%",
            [theme.mobile]: { alignContent: "end" },
          }}
        >
          {photo && (
            <img
              src={photo}
              alt="Happy Here logo with a happy hour drink"
              css={{
                display: "block",
                width: 80,
                objectFit: "cover",
                borderRadius: 90,
                [theme.mobile]: {
                  width: 120,
                },
              }}
            />
          )}
        </Link>
      </div>
    </div>
  )
}
export default Footer
