/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"

export default function Header() {
  return (
    <header
      css={{
        margin: "0 -40px",
        padding: "24px 40px",
        borderBottom: "1px solid black",
        display: "block",
        background: "#FAF8F4",
        [theme.mobile]: {
          margin: 0,
          padding: "20px 30px",
        },
      }}
    >
      {/* Wordmark */}
      <div>
        <h1
          css={{
            fontFamily: theme.newFontFamily,
            fontSize: 72,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            fontWeight: 900,
            [theme.tablet]: { fontSize: 56 },
            [theme.mobile]: { fontSize: 40 },
          }}
        >
          <span>HAPPY</span>
          <br />
          <span
            css={{
              WebkitTextStroke: "2px black",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            HERE
          </span>
        </h1>
        <p
          css={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            marginTop: 4,
            marginLeft: 2,
          }}
        >
          Austin Happy Hours
        </p>
      </div>

    </header>
  )
}
