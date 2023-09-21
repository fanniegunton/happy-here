import React from "react"
import { graphql } from "gatsby"
import { Global } from "@emotion/react"
import theme, { globalStyles } from "../styles/theme"
import Layout from "../components/Layout"
import Header from "../components/Header"
import EstablishmentTile from "../components/EstablishmentTile"

const Home = ({ data }) => {
  return (
  <div>
    <Layout>
      <Global styles={globalStyles} />
        <Header css={{ margin: "0 auto" }} />
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          margin: "0 auto",
          justifyContent: "center",
          justifyItems: "center",
            gap: "30px 0",
          [theme.tablet]: {
            gridTemplateColumns: "1fr",
              gap: "10px 0",
          },
        }}
      >
        {data.establishment.nodes &&
          data.establishment.nodes.map((tile) => (
            <EstablishmentTile key={tile._id} {...tile} />
          ))}
      </div>
    </Layout>
  </div>
)
}

export default Home

export const query = graphql`
  query HomepageQuery {
    establishment: allSanityEstablishment {
      nodes {
        ...EstablishmentTile
      }
    }
  }
`
