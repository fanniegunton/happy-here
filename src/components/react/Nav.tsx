/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"
import logo from "../../assets/HH-logo.jpg"
import instagramIcon from "../../images/Instagram.svg"

export default function Nav() {
  return (
    <nav
      css={{
        margin: "0 auto 20px",
        padding: "0",
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
        [theme.mobile]: {
          display: "block",
          margin: "0 auto 40px",
        },
      }}
    >
      <a href="/" css={{ maxWidth: "65%" }}>
        <img
          src={(logo as any).src}
          alt="Happy Here logo with a happy hour drink"
          css={{
            display: "block",
            width: 150,
            objectFit: "cover",
            borderRadius: 90,
            margin: "0 auto",
            [theme.mobile]: {
              width: 100,
            },
          }}
        />
      </a>
      <div
        css={{
          fontFamily: theme.displayFontFamily,
          fontSize: 20,
          fontWeight: 400,
          lineHeight: 1.0,
          textTransform: "uppercase",
          paddingTop: 40,
          flex: "1 0 auto",
          maxWidth: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 40,
          [theme.tablet]: {
            fontSize: 18,
          },
          [theme.mobile]: {
            marginTop: 16,
            justifyContent: "center",
            padding: "10px 0",
            fontSize: 14,
          },
        }}
      >
        {/* <a href="/map">Map</a> */}
        <a href="/about">About</a>
        <a href="mailto:happyhappyhere@gmail.com">Contact</a>
        <a
          href="https://www.instagram.com/takeouttracker/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={(instagramIcon as any).src}
            css={{
              width: "auto",
              color: "#000000",
              [theme.mobile]: {
                alignContent: "end",
                marginLeft: 8,
              },
            }}
            alt="Instagram"
          />
        </a>
      </div>
    </nav>
  )
}
