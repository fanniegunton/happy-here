import React from "react"
import { Link } from "gatsby"
import theme from "../styles/theme"
import insta from "../images/Instagram.svg"
import photo from "../assets/HH-logo.jpg"

const Footer = () => {
  return (
    <div
      css={{
        margin: "120px auto 0",
        padding: "0 20px 20px",
        [theme.mobile]: {
          margin: "60px auto 0",
          paddingBottom: 40,
          background: theme.lilac,
        },
      }}
    >
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          [theme.mobile]: {
            padding: 0,
          },
        }}
      >
        <div>
          <div
            css={{
              ...theme.nav,
              fontSize: 16,
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
                  color: theme.black,
                  [theme.mobile]: {
                    alignContent: "end",
                    marginLeft: 8,
                  },
                }}
              />
            </a>
          </div>
          <div
            css={{
              marginTop: 20,
              fontFamily: theme.fancyFontFamily,
              fontSize: 18,
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
