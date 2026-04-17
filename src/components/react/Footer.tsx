/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"
import logo from "../../assets/HH-logo.jpg"
import instagramIcon from "../../images/Instagram.svg"

export default function Footer() {
  return (
    <footer
      css={{
        marginTop: 60,
        [theme.mobile]: {
          marginTop: 40,
          background: theme.lavender,
        },
      }}
    >
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          background: theme.lavender,
          color: "#FFFFFF",
          padding: "40px 80px 80px",
          [theme.mobile]: {
            display: "block",
            padding: 20,
            background: "transparent",
            color: "inherit",
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
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: 40,
              [theme.mobile]: {
                marginTop: 20,
                justifyContent: "space-between",
              },
              "@media (max-width: 580px)": {
                flexDirection: "row",
                flexWrap: "wrap",
                textWrap: "balance",
                alignItems: "start",
                justifyContent: "center",
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
                  width: "auto",
                  filter: "brightness(0) invert(1)",
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
              [theme.mobile]: {
                fontSize: 16,
                maxWidth: "100%",
                marginTop: 40,
              },
            }}
          >
            Happy Here tracks Austin's happiest hours—built by locals, for
            locals. No chains, no filler, just great food, drinks, and the
            people behind them.
          </div>
        </div>
        <a
          href="/"
          css={{
            maxWidth: "45%",
            [theme.mobile]: {
              alignContent: "end",
              margin: "40px auto",
            },
          }}
        >
          <img
            src={(logo as any).src}
            alt="Happy Here logo with a happy hour drink"
            css={{
              display: "block",
              width: 80,
              objectFit: "cover",
              borderRadius: 90,
              [theme.mobile]: {
                margin: "40px auto",
              },
            }}
          />
        </a>
      </div>
    </footer>
  )
}
