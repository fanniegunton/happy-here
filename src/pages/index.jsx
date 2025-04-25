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

  const [hasWine, setHasWine] = React.useState(false)
  const [hasBeer, setHasBeer] = React.useState(false)
  const [hasCocktails, setHasCocktails] = React.useState(false)
  const [hasFood, setHasFood] = React.useState(false)
  const [hasCoffee, setHasCoffee] = React.useState(false)
  const [hasPatio, setHasPatio] = React.useState(false)
  const [hasBarSeating, setHasBarSeating] = React.useState(false)
  const [hasDogFriendly, setHasDogFriendly] = React.useState(false)
  const [hasBigGroups, setHasBigGroups] = React.useState(false)

  const sortedEstablishments = sortEstablishments(establishments)

  const filteredEstablishments = sortedEstablishments.filter((est) => {
    if (hasWine && !est.whatWeHaveHere.includes("wine")) return false
    if (hasBeer && !est.whatWeHaveHere.includes("beer")) return false
    if (hasCocktails && !est.whatWeHaveHere.includes("cocktails")) return false
    if (hasFood && !est.whatWeHaveHere.includes("food")) return false
    if (hasCoffee && !est.whatWeHaveHere.includes("coffee")) return false
    if (hasPatio && !est.theSpaceIsLike.includes("patio")) return false
    if (hasBarSeating && !est.theSpaceIsLike.includes("barSeating"))
      return false
    if (hasDogFriendly && !est.theSpaceIsLike.includes("dogFriendly"))
      return false
    if (hasBigGroups && !est.theSpaceIsLike.includes("bigGroups")) return false

    return true // only return true if it passed all active filters
  })

  return (
    <div>
      <Layout>
        <Global styles={globalStyles} />
        <Header css={{ margin: "0 auto" }} />
        <div
          css={{
            margin: "0 auto 10px",
            padding: "0 20px",
            ...theme.postTitle,
            fontWeight: 700,
            [theme.mobile]: {
              margin: "0 30px 10px",
              padding: 0,
            },
          }}
        >
          Only show me places with:
        </div>
        <div
          css={{
            margin: "0 auto",
            padding: "0 20px",
            ...theme.subtitle,
            [theme.mobile]: {
              margin: "0 30px",
              padding: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            },
          }}
        >
          <label css={{ marginRight: 20 }}>
            <input
              css={{ marginRight: 10 }}
              type="checkbox"
              onChange={() => setHasWine(!hasWine)}
            />
            Wine
          </label>
          <label css={{ marginRight: 20 }}>
            <input
              css={{ marginRight: 10 }}
              type="checkbox"
              onChange={() => setHasBeer(!hasBeer)}
            />
            Beer
          </label>
          <label css={{ marginRight: 20 }}>
            <input
              css={{ marginRight: 10 }}
              type="checkbox"
              onChange={() => setHasCocktails(!hasCocktails)}
            />
            Cocktails
          </label>
          <label css={{ marginRight: 20 }}>
            <input
              css={{ marginRight: 10 }}
              type="checkbox"
              onChange={() => setHasFood(!hasFood)}
            />
            Food
          </label>
          <label css={{ marginRight: 20 }}>
            <input
              css={{ marginRight: 10 }}
              type="checkbox"
              onChange={() => setHasCoffee(!hasCoffee)}
            />
            Coffee
          </label>
          <label css={{ marginRight: 20 }}>
            <input
              css={{ marginRight: 10 }}
              type="checkbox"
              onChange={() => setHasPatio(!hasPatio)}
            />
            Patio
          </label>
          <label css={{ marginRight: 20 }}>
            <input
              css={{ marginRight: 10 }}
              type="checkbox"
              onChange={() => setHasBarSeating(!hasBarSeating)}
            />
            Bar Seating
          </label>
          <label css={{ marginRight: 20 }}>
            <input
              css={{ marginRight: 10 }}
              type="checkbox"
              onChange={() => setHasBigGroups(!hasBigGroups)}
            />
            Room for 4 or more
          </label>
          <label css={{ marginRight: 20 }}>
            <input
              css={{ marginRight: 10 }}
              type="checkbox"
              onChange={() => setHasDogFriendly(!hasDogFriendly)}
            />
            🐶🐾 Friendly //{" "}
          </label>{" "}
          */}
        </div>
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
