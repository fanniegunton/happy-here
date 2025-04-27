import React from "react"
import theme from "../styles/theme"
import Layout from "../components/Layout"

const Journal = () => {
  return (
    <Layout>
      <div
        css={{
          padding: "0 20px",
          maxWidth: 1000,
          minHeight: "100vh",
          [theme.mobile]: {
            margin: "0 30px",
            padding: 0,
            borderRadius: 0,
          },
        }}
      >
        <h1
          css={{
            ...theme.h1,
            marginBottom: 60,
            [theme.mobile]: {
              paddingTop: 20,
              fontSize: 40,
            },
          }}
        >
          Journal Coming Soon!
        </h1>
      </div>
    </Layout>
  )
}
export default Journal
