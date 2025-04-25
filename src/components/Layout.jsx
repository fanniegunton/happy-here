import React from "react"
import theme from "../styles/theme"
import { Helmet } from "react-helmet"

const Layout = ({ children }) => {
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div
        css={{
          margin: "10px auto",
          padding: 40,
          maxWidth: 1450,
          border: "8px solid #006eff",
          borderRadius: 45,
          [theme.mobile]: {
            margin: "0 auto",
            padding: "40px 0",
            border: "4px solid #006eff",
            borderRadius: 0,
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
