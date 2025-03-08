import React from "react"
import { graphql } from "gatsby"
import { Global } from "@emotion/react"
import theme, { globalStyles } from "../styles/theme"
import Layout from "../components/Layout"
import Header from "../components/Header"
import EstablishmentTile from "../components/EstablishmentTile"
import { sortEstablishments } from "../lib/sortEstablishments"

const Home = ({ data }) => {
  // Filter out test establishment if not in development environment
  let establishments = data.establishment.nodes
  if (process.env.NODE_ENV !== "development") {
    establishments = establishments.filter(
      (est) => est._id !== "b95f53fc-ae57-4605-b4b6-6ceb785a1756"
    )
  }

  const sortedEstablishments = sortEstablishments(establishments)

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
