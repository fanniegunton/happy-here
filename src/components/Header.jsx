import React from "react"
import theme from "../styles/theme"

const Header = () => (
  <div>
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 60,
      }}
    >
      <h1
        css={{
          ...theme.h1,

          [theme.mobile]: {
            ...theme.h1,
          },
        }}
      >
        Happy Hour Finder
      </h1>
      <div
        css={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gridGap: 20,
        }}
      >
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          css={{
            ...theme.subtitle,
            padding: "10px",
            border: "2px solid black",
            borderRadius: 50,
            textAlign: "center",
          }}
        >
          insta
        </a>
        <a
          href="mailto:happyhappyhere@gmail.com"
          css={{
            ...theme.subtitle,
            padding: "10px",
            border: "2px solid black",
            borderRadius: 50,
            textAlign: "center",
          }}
        >
          email
        </a>
      </div>
    </div>
    <div css={{ display: "flex", justifyContent: "space-between" }}></div>
  </div>
)

export default Header
