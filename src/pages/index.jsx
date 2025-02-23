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
        {/* <p css={{ margin: "20px 0" }}>
          We are always seeking and reviewing new HH spots! If you have a
          suggestion, drop us a line:
        </p>
        <div
          css={{
            display: "flex",
            gridGap: 20,
            ...theme.subtitle,
            fontFamily: theme.fancyFontFamily,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <a
            href="mailto:happyhappyhere@gmail.com"
            css={{
              padding: 10,
              color: theme.white,
              background: theme.hotPink,
              borderRadius: 50,
            }}
          >
            email
          </a>
        </div> */}
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
              gap: "10px 0",
            },
          }}
        >
          {/* {data.establishment.nodes &&
            data.establishment.nodes.map((tile) => ( */}
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
