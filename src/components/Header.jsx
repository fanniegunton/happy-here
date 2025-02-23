import React from "react"
import theme from "../styles/theme"
import { Link } from "gatsby"
import insta from "../images/Instagram.svg"

const Header = () => (
  <div
    css={{
      display: "block",
      marginBottom: 60,
      padding: "60px",
      background:
        "linear-gradient(135deg, #b5b5ff 0%, #e4e3e4 67.92%, #B13076 98.44%)",
      borderRadius: "20px",
      border: "16px double #4F67B1",
      ...theme.extraFloatBox,
      [theme.mobile]: {
        padding: 10,
      },
    }}
  >
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        alignItems: "center",
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
        }}
      >
        Happy Here
      </h1>
      <div
        css={{
          ...theme.nav,
          maxWidth: 600,
          textWrap: "balance",
          display: "flex",
          gap: ".75em",
          [theme.mobile]: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            fontSize: 14,
            textAlign: "right",
          },
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
                alignContent: "center",
                margin: "0 auto",
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
