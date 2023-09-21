import React from "react"
import theme from "../styles/theme"

const Header = () => (
  <div
    css={{
      display: "flex",
      paddingBottom: 60,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }}
  >
    <div>
      <h1
        css={{
          ...theme.h1,
          marginBottom: 20,
          textAlign: "center",
          [theme.tablet]: {
            ...theme.h1,
            paddingBottom: 10,
          },
        }}
      >
        Happy Here!
      </h1>
      <h4
        css={{
          ...theme.subtitle,
          paddingBottom: 40,
          textAlign: "center",
          maxWidth: 600,
          [theme.tablet]: {
            padding: "0 20px 40px",
          },
        }}
      >
        Your concierge finder of happy hours and other odd times of day when
        drinks and food become less costly, and thus, more delicious. <br />{" "}
      </h4>
    </div>
    <div
      css={{
        display: "flex",
        gridGap: 20,
      }}
    >
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        css={{
          ...theme.subtitle,
          fontFamily: theme.fancyFontFamily,
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
          fontFamily: theme.fancyFontFamily,
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
)

export default Header
