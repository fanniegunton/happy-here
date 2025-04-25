import React from "react"
import { Link } from "gatsby"
import theme from "../styles/theme"
import insta from "../images/Instagram.svg"

const Header = () => (
  <div
    css={{
      marginBottom: 60,
      padding: "0 20px",
      background: theme.white,
      [theme.mobile]: {
        margin: "0 30px",
        padding: 0,
      },
    }}
  >
    <div
      css={{
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
        marginBottom: 20,
        [theme.tablet]: {
          paddingBottom: 10,
        },
        [theme.mobile]: {
          display: "block",
          paddingBottom: 0,
        },
      }}
    >
      <h1
        css={{
          ...theme.h1,
          justifySelf: "start",
          maxWidth: "65%",
          [theme.mobile]: {
            maxWidth: "100%",
            fontSize: 40,
          },
        }}
      >
        Happy Here: Happy Hours in Austin
      </h1>
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
          gap: ".75em",
          [theme.mobile]: {
            marginTop: 20,
            justifyContent: "start",
            background: theme.lilac,
            marginRight: "-30px",
            marginLeft: "-30px",
            padding: "10px 0 10px 30px",
          },
        }}
      >
        {/* <Link to="/lists">Lists</Link> */}
        {/* <Link to="/about">About</Link> */}
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
    <div>
      <div
        css={{
          ...theme.subtitle,
          fontWeight: 400,
          maxWidth: 720,
          textWrap: "balance",
          [theme.tablet]: {
            padding: "0 20px 30px 0",
          },
          [theme.mobile]: {
            padding: "0 0 30px 0",
            fontSize: 16,
            lineHeight: 1.5,
          },
        }}
      >
        Delicious discounts in ATX! <br /> Happy hours, late night deals,
        specialty days, plus all the deets 🤌🏼
      </div>
    </div>
  </div>
)

export default Header
