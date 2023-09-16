import React from "react"
import theme, { globalStyles } from "../styles/theme"

const Header = () => (
  <div>
    <div css={{ display: "flex", justifyContent: "space-between" }}>
      <h1
        css={{
          ...theme.h1,
          paddingBottom: 60,
          [theme.mobile]: {
            ...theme.h1,
            paddingBottom: 30,
          },
        }}
      >
        Happy Hour Finder
      </h1>
      <div
        css={{
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
          gridGap: 20,
        }}
      >
        <div
          css={{
            ...theme.subtitle,
            padding: "10px",
            border: "2px solid black",
            textAlign: "center",
          }}
        >
          insta
        </div>
        <div
          css={{
            ...theme.subtitle,
            padding: "10px",
            border: "2px solid black",
            textAlign: "center",
          }}
        >
          email
        </div>
      </div>
    </div>
    <div css={{ display: "flex", justifyContent: "space-between" }}></div>
  </div>
)

export default Header
