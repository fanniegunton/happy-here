import React from "react"
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
      }}
    >
      <h1
        css={{
          ...theme.h1,
          justifySelf: "start",
        }}
      >
        Happy Here: Happy Hours in Austin
      </h1>
      <div
        css={{
          ...theme.nav,
          flex: "1 0 auto",
          maxWidth: 600,
          textWrap: "balance",
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          transform: "0 16px",
          gap: ".75em",
        }}
      >
        {/* <Link to="/lists">Lists</Link>
        <Link to="/about">About</Link>
        <Link to="/journal">Journal</Link> */}
        <a href="mailto:happyhappyhere@gmail.com">Contact</a>
        <a
          href="https://www.instagram.com/"
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
          maxWidth: 600,
          textWrap: "balance",
          [theme.tablet]: {
            padding: "0 20px 20px 0",
            fontWeight: 400,
          },
        }}
      >
        Your roadmap to delicious discounts, from early happy hours to late
        night deals.
        <br />{" "}
      </div>
    </div>
  </div>
)

export default Header
