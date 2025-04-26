import React from "react"
import theme from "../styles/theme"

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
        marginBottom: 20,
        [theme.tablet]: {
          paddingBottom: 10,
        },
        [theme.mobile]: {
          display: "block",
          paddingBottom: 0,
          marginBottom: 16,
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
  </div>
)

export default Header
