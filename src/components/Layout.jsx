import React from "react"
import theme from "../styles/theme"

const Layout = ({ children }) => {
  return (
    <>
      <div
        css={{
          margin: `90px auto`,
          maxWidth: 1450,
          padding: `2rem`,
          backgroundColor: `#f5f5f5`,
        }}
      >
        <div>
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout
