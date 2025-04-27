import React from "react"
import { Link } from "gatsby"
import theme from "../styles/theme"
import insta from "../images/Instagram.svg"
import photo from "../assets/HH-logo.jpg"

const Nav = () => {
  return (
    <div
      css={{
        margin: "0 auto 60px",
        padding: "0 20px",
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
        [theme.mobile]: {
          display: "block",
          margin: "0 auto 40px",
        },
      }}
    >
      <Link to="/" css={{ maxWidth: "65%" }}>
        {photo && (
          <img
            src={photo}
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
        )}
      </Link>
      <div
        css={{
          ...theme.nav,
          paddingTop: 40,
          flex: "1 0 auto",
          maxWidth: 600,
          textWrap: "balance",
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          transform: "0 16px",
          gap: 40,
          [theme.mobile]: {
            marginTop: 16,
            justifyContent: "center",
            padding: "10px 0",
          },
        }}
      >
        {/* <Link to="/lists">Lists</Link> */}
        <Link to="/about">About</Link>
        {/* <Link to="/journal">Journal</Link> */}
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
    </div>
  )
}
export default Nav
