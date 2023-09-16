import React from "react"
import theme from "../styles/theme"

const Header = () => (
  <div>
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 60,
        [theme.mobile]: {
          justifyContent: "center",
          flexDirection: "column",
          paddingBottom: 20,
        },
      }}
    >
      <h1
        css={{
          ...theme.h1,

          [theme.mobile]: {
            ...theme.h1,
            paddingBottom: 10,
            textAlign: "center",
          },
        }}
      >
        Happy Here!
      </h1>
      <h3
        css={{
          ...theme.h3,

          [theme.mobile]: {
            ...theme.h3,
            paddingBottom: 10,
            textAlign: "center",
          },
        }}
      >
        Your friendly, neighborhood happy hour finder.
      </h3>
      <div
        css={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gridGap: 20,
          [theme.tablet]: {
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 20px",
          },
          [theme.mobile]: {
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "center",
          },
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
