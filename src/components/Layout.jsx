import React from "react"
import theme from "../styles/theme"

const Layout = ({ children }) => {
  return (
    <>
      <div
        css={{
          margin: 10,
          padding: 60,
          maxWidth: 1450,
          border: "8px solid #006eff",
          borderRadius: 45,
          [theme.tablet]: {
            margin: "0 auto",
            padding: "90px 0 0",
          },
          [theme.mobile]: {
            border: "none",
            padding: "20px 10px 0",
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
