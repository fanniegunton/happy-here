import React, { useMemo, useEffect } from "react"
import { graphql } from "gatsby"
import Fuse from "fuse.js"
import theme from "../styles/theme"
import Layout from "../components/Layout"
import Header from "../components/Header"
import EstablishmentTile from "../components/EstablishmentTile"
import { sortEstablishments } from "../lib/sortEstablishments"
import FilterBar from "../components/FilterBar"
import { hoursCover } from "../lib/parseHours"

const Home = ({ data, location }) => {
  // Filter out test establishment if not in development environment
  let establishments = data.establishment.nodes
  if (process.env.NODE_ENV !== "development") {
    establishments = establishments.filter(
      (est) => est._id !== "b95f53fc-ae57-4605-b4b6-6ceb785a1756"
    )
  }

  // Helper to get initial state from URL params
  const getInitialState = (param) => {
    if (typeof window === "undefined") return false
    const params = new URLSearchParams(location.search)
    return params.get(param) === "true"
  }

  const getInitialSearch = () => {
    if (typeof window === "undefined") return ""
    const params = new URLSearchParams(location.search)
    return params.get("search") || ""
  }

  const [searchQuery, setSearchQuery] = React.useState(getInitialSearch)
  const [hasWine, setHasWine] = React.useState(() => getInitialState("wine"))
  const [hasBeer, setHasBeer] = React.useState(() => getInitialState("beer"))
  const [hasCocktails, setHasCocktails] = React.useState(() =>
    getInitialState("cocktails")
  )
  const [hasFood, setHasFood] = React.useState(() => getInitialState("food"))
  const [hasCoffee, setHasCoffee] = React.useState(() =>
    getInitialState("coffee")
  )
  const [hasPatio, setHasPatio] = React.useState(() => getInitialState("patio"))
  const [hasBarSeating, setHasBarSeating] = React.useState(() =>
    getInitialState("barSeating")
  )
  const [hasDogFriendly, setHasDogFriendly] = React.useState(() =>
    getInitialState("dogFriendly")
  )
  const [hasNaDrinks, setHasNaDrinks] = React.useState(() =>
    getInitialState("naDrinks")
  )

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

  // Update URL when filters change
  useEffect(() => {
    if (typeof window === "undefined") return

    const params = new URLSearchParams()

    // Add search query if present
    if (searchQuery) {
      params.set("search", searchQuery)
    }

    // Add filter params if active
    if (hasWine) params.set("wine", "true")
    if (hasBeer) params.set("beer", "true")
    if (hasCocktails) params.set("cocktails", "true")
    if (hasFood) params.set("food", "true")
    if (hasCoffee) params.set("coffee", "true")
    if (hasPatio) params.set("patio", "true")
    if (hasBarSeating) params.set("barSeating", "true")
    if (hasDogFriendly) params.set("dogFriendly", "true")
    if (hasNaDrinks) params.set("naDrinks", "true")

    // Update URL without page reload
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    window.history.replaceState({}, "", newUrl)
  }, [
    searchQuery,
    hasWine,
    hasBeer,
    hasCocktails,
    hasFood,
    hasCoffee,
    hasPatio,
    hasBarSeating,
    hasDogFriendly,
    hasNaDrinks,
  ])

  const sortedEstablishments = sortEstablishments(establishments)

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(sortedEstablishments, {
        keys: [
          "name",
          "neighborhood",
          "address",
          "whatWeHaveHere",
          "theSpaceIsLike",
        ],
        threshold: 0.3, // Lower = more strict matching
        ignoreLocation: true,
      }),
    [sortedEstablishments]
  )

  // Apply search filter first (AND search for multiple terms)
  const searchFilteredEstablishments = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedEstablishments
    }

    // Split search query into individual terms
    const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/)

    // Filter establishments that match ALL search terms
    return sortedEstablishments.filter((est) => {
      // Convert establishment data to searchable strings
      const searchableContent = [
        est.name,
        est.neighborhood,
        est.address,
        ...(est.whatWeHaveHere || []),
        ...(est.theSpaceIsLike || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      // Check if ALL search terms are found
      return searchTerms.every((term) => searchableContent.includes(term))
    })
  }, [searchQuery, sortedEstablishments])

  // Then apply amenity filters
  const filteredEstablishments = searchFilteredEstablishments.filter((est) => {
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

  // Separate establishments into happy hour now vs later
  const happyHourNow = filteredEstablishments.filter((est) =>
    hoursCover(est.happyHourTimes, new Date())
  )
  const happyHourLater = filteredEstablishments.filter(
    (est) => !hoursCover(est.happyHourTimes, new Date())
  )

  return (
    <div>
      <Layout>
        <Header css={{ margin: "0 auto" }} />
        <FilterBar
          filters={filters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultCount={filteredEstablishments.length}
        />

        {/* Divider before happy hour now section */}
        {happyHourNow.length > 0 && (
          <div
            css={{
              margin: "40px -40px 0",
              borderTop: "4px dotted #006eff",
              [theme.mobile]: {
                margin: "30px -20px 0",
                borderTop: "2px dotted #006eff",
              },
            }}
          />
        )}

        {/* Happy Hour Now Section */}
        {happyHourNow.length > 0 && (
          <>
            <h2
              css={{
                ...theme.h2,
                fontFamily: theme.fancyFontFamily,
                fontSize: 36,
                marginBottom: 24,
                marginTop: 60,
                textAlign: "left",
                [theme.tablet]: {
                  margin: "36px auto 24px",
                  textWrapStyle: "auto",
                  maxWidth: 375,
                  textAlign: "center",
                },
                [theme.mobile]: {
                  fontSize: 28,
                  padding: "0 16px",
                },
              }}
            >
              It's Happy Hour!
            </h2>
            <div
              css={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                margin: "0 auto",
                justifyContent: "center",
                justifyItems: "center",
                gap: "40px 40px",
                [theme.smallDesktop]: {
                  gridTemplateColumns: "1fr 1fr",
                },
                [theme.tablet]: {
                  gridTemplateColumns: "1fr",
                  gap: "30px",
                },
                [theme.mobile]: {
                  margin: 0,
                  gap: "24px",
                },
              }}
            >
              {happyHourNow.map((tile) => (
                <EstablishmentTile key={tile._id} {...tile} />
              ))}
            </div>
          </>
        )}

        {/* Divider between sections */}
        {happyHourNow.length > 0 && happyHourLater.length > 0 && (
          <div
            css={{
              margin: "60px -40px",
              borderTop: "4px dotted #006eff",
              [theme.mobile]: {
                margin: "40px -20px",
                borderTop: "2px dotted #006eff",
              },
            }}
          />
        )}

        {/* Not Right Now Section */}
        {happyHourLater.length > 0 && (
          <>
            <h2
              css={{
                ...theme.h2,
                fontFamily: theme.fancyFontFamily,
                fontSize: 36,
                marginBottom: 24,
                marginTop: 20,
                textAlign: "left",
                [theme.tablet]: {
                  margin: "36px auto 24px",
                  textWrapStyle: "auto",
                  maxWidth: 375,
                  textAlign: "center",
                },
                [theme.mobile]: {
                  fontSize: 28,
                  padding: "0 16px",
                },
              }}
            >
              Let the Countdown Begin! ⏰
            </h2>
            <div
              css={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                margin: "0 auto",
                justifyContent: "center",
                justifyItems: "center",
                gap: "40px 40px",
                [theme.smallDesktop]: {
                  gridTemplateColumns: "1fr 1fr",
                },
                [theme.tablet]: {
                  gridTemplateColumns: "1fr",
                  gap: "30px",
                },
                [theme.mobile]: {
                  margin: 0,
                  gap: "24px",
                },
              }}
            >
              {happyHourLater.map((tile) => (
                <EstablishmentTile key={tile._id} {...tile} />
              ))}
            </div>
          </>
        )}
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
