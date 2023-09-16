import React from "react"
import { graphql } from "gatsby"
import { Global } from "@emotion/react"
import theme, { globalStyles } from "../styles/theme"
import Layout from "../components/Layout"
import Header from "../components/Header"
import EstablishmentTile from "../components/EstablishmentTile"
import EstablishmentsViewer from "../components/EstablishmentsViewer"

const Home = ({ data }) => (
  <div>
    <Layout>
      <Global styles={globalStyles} />
      <Header />
      <div
        css={{
          ...theme.h2,
          margin: "60px 0 30px",
          padding: 30,
          border: "4px solid black",
          borderRadius: 45,
          textAlign: "center",
        }}
      >
        <h2>PLACEHOLDER FOR CRITERIA SELECTOR</h2>
        {/* <EstablishmentsViewer
          title={data.establishment.nodes.name}
          defaultFilters={["hideClosed"]}
          showingAll={false}
          preserveOrder
        /> */}
      </div>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          // gridGap: "60px 60px",
          margin: "0 auto",
          justifyItems: "center",
          // padding: 60,
          // [theme.tablet]: {
          gridGap: "30px 30px",
          // padding: 10,
          // },
          "@media (max-width: 700px)": {
            gridTemplateColumns: "1fr",
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

export default Home

export const query = graphql`
  query HomepageQuery {
    establishment: allSanityEstablishment {
      nodes {
        ...EstablishmentTile
        name
        address
        neighborhood
        website
        _id
        hours
        happyHourTimes
        happyHourDetails
      }
    }
  }
`
