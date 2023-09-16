import React from "react"

const Layout = ({ children }) => {
  return (
    <>
      <div
        css={{
          margin: `90px`,
          maxWidth: 1450,
          padding: "60px",
          backgroundColor: `#f5f5f5`,
          borderRadius: 45,
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
