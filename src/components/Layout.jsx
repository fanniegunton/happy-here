import React from "react"
import theme from "../styles/theme"

const Layout = ({ children }) => {
  return (
    <>
      <div
        css={{
          margin: `0 auto`,
          padding: "90px 90px 60px",
          maxWidth: 1450,
          borderRadius: 45,
          [theme.tablet]: {
            margin: "0 auto",
            padding: "90px 0 0",
            justifyContent: "center",
            justifyItems: "center",
            textAlign: "center",
          },
        }}
      >
        <div css={{ margin: "0 auto" }}>
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout
