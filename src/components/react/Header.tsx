/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"
import Nav from "./Nav"
import wordmark from "../../assets/happy-here-wordmark.svg"

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
      <Nav />
    </header>
  )
}
