import React from "react"
import { graphql } from "gatsby"
import { Global } from "@emotion/react"
import theme, { globalStyles } from "../styles/theme"
import Layout from "../components/Layout"
import Header from "../components/Header"
import EstablishmentTile from "../components/EstablishmentTile"
import { sortEstablishments } from "../lib/sortEstablishments"

const Home = ({ data }) => {
  const sortedEstablishments = sortEstablishments(data.establishment.nodes)

  return (
    <div>
      <Layout>
        <Global styles={globalStyles} />
        <Header css={{ margin: "0 auto" }} />
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            margin: "0 auto",
            justifyContent: "center",
            justifyItems: "center",
            gap: "20px 20px",
            [theme.smallDesktop]: {
              gridTemplateColumns: "1fr 1fr",
            },
            [theme.tablet]: {
              gridTemplateColumns: "1fr",
              gap: 0,
            },
            [theme.mobile]: { margin: 0 },
          }}
        >
          {sortedEstablishments.map((tile) => (
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
