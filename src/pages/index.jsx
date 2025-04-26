import React from "react"
import { graphql } from "gatsby"
import theme from "../styles/theme"
import Layout from "../components/Layout"
import Header from "../components/Header"
import EstablishmentTile from "../components/EstablishmentTile"
import { sortEstablishments } from "../lib/sortEstablishments"
import FilterBar from "../components/FilterBar"

const Home = ({ data }) => {
  // Filter out test establishment if not in development environment
  let establishments = data.establishment.nodes
  if (process.env.NODE_ENV !== "development") {
    establishments = establishments.filter(
      (est) => est._id !== "b95f53fc-ae57-4605-b4b6-6ceb785a1756"
    )
  }

  const [hasWine, setHasWine] = React.useState(false)
  const [hasBeer, setHasBeer] = React.useState(false)
  const [hasCocktails, setHasCocktails] = React.useState(false)
  const [hasFood, setHasFood] = React.useState(false)
  const [hasCoffee, setHasCoffee] = React.useState(false)
  const [hasPatio, setHasPatio] = React.useState(false)
  const [hasBarSeating, setHasBarSeating] = React.useState(false)
  const [hasDogFriendly, setHasDogFriendly] = React.useState(false)
  const [hasNaDrinks, setHasNaDrinks] = React.useState(false)

  const filters = {
    hasWine,
    setHasWine,
    hasBeer,
    setHasBeer,
    hasCocktails,
    setHasCocktails,
    hasFood,
    setHasFood,
    hasCoffee,
    setHasCoffee,
    hasPatio,
    setHasPatio,
    hasBarSeating,
    setHasBarSeating,
    hasDogFriendly,
    setHasDogFriendly,
    hasNaDrinks,
    setHasNaDrinks,
  }

  const sortedEstablishments = sortEstablishments(establishments)

  const filteredEstablishments = sortedEstablishments.filter((est) => {
    if (filters.hasWine && !est.whatWeHaveHere.includes("wine")) return false
    if (filters.hasBeer && !est.whatWeHaveHere.includes("beer")) return false
    if (filters.hasCocktails && !est.whatWeHaveHere.includes("cocktails"))
      return false
    if (filters.hasFood && !est.whatWeHaveHere.includes("food")) return false
    if (filters.hasCoffee && !est.whatWeHaveHere.includes("coffee"))
      return false
    if (filters.hasPatio && !est.theSpaceIsLike.includes("patio")) return false
    if (filters.hasBarSeating && !est.theSpaceIsLike.includes("barSeating"))
      return false
    if (filters.hasDogFriendly && !est.theSpaceIsLike.includes("dogFriendly"))
      return false
    if (filters.hasNaDrinks && !est.whatWeHaveHere.includes("naDrinks"))
      return false

    return true // only return true if it passed all active filters
  })

  return (
    <div>
      <Layout>
        <Header css={{ margin: "0 auto" }} />
        <FilterBar filters={filters} />
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
          {filteredEstablishments.map((tile) => (
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
