import React, { useState, useEffect, useMemo } from "react"
import { graphql } from "gatsby"
import theme from "../styles/theme"
import Layout from "../components/Layout"
import Header from "../components/Header"
import Map from "../components/Map"
import FilterBar from "../components/FilterBar"
import { hoursCover } from "../lib/parseHours"

const MapPage = ({ data, location }) => {
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

  // Filter state
  const [searchQuery, setSearchQuery] = useState(getInitialSearch)
  const [hasWine, setHasWine] = useState(() => getInitialState("wine"))
  const [hasBeer, setHasBeer] = useState(() => getInitialState("beer"))
  const [hasCocktails, setHasCocktails] = useState(() =>
    getInitialState("cocktails")
  )
  const [hasFood, setHasFood] = useState(() => getInitialState("food"))
  const [hasCoffee, setHasCoffee] = useState(() => getInitialState("coffee"))
  const [hasPatio, setHasPatio] = useState(() => getInitialState("patio"))
  const [hasBarSeating, setHasBarSeating] = useState(() =>
    getInitialState("barSeating")
  )
  const [hasDogFriendly, setHasDogFriendly] = useState(() =>
    getInitialState("dogFriendly")
  )
  const [hasNaDrinks, setHasNaDrinks] = useState(() =>
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

  // Apply search and filters
  const searchFilteredEstablishments = useMemo(() => {
    if (!searchQuery.trim()) return establishments

    const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/)
    return establishments.filter((est) => {
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

      return searchTerms.every((term) => searchableContent.includes(term))
    })
  }, [searchQuery, establishments])

  const filteredEstablishments = useMemo(() => {
    return searchFilteredEstablishments.filter((est) => {
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
      if (hasNaDrinks && !est.whatWeHaveHere.includes("naDrinks")) return false
      return true
    })
  }, [searchFilteredEstablishments, hasWine, hasBeer, hasCocktails, hasFood, hasCoffee, hasPatio, hasBarSeating, hasDogFriendly, hasNaDrinks])

  // Filter out establishments without location data
  const establishmentsWithLocation = useMemo(
    () =>
      filteredEstablishments.filter(
        (est) => est.location?.lat && est.location?.lng
      ),
    [filteredEstablishments]
  )

  const [happyHourStatus, setHappyHourStatus] = useState({})

  // Check happy hour status for all establishments
  useEffect(() => {
    const checkAllHours = () => {
      const status = {}
      establishmentsWithLocation.forEach((est) => {
        status[est._id] = hoursCover(est.happyHourTimes, new Date())
      })
      setHappyHourStatus(status)
    }

    checkAllHours()
    const timer = setInterval(checkAllHours, 30_000)
    return () => clearInterval(timer)
  }, [establishmentsWithLocation])

  return (
    <div>
      <Layout>
        <Header css={{ margin: "0 auto" }} />
        <FilterBar
          filters={filters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultCount={establishmentsWithLocation.length}
          isMapPage={true}
        />

        {/* Divider before happy hour now section */}
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

        <div
          css={{
            marginTop: 60,
            marginBottom: 24,
            padding: "0 20px",
            [theme.mobile]: {
              margin: "16px 30px",
              padding: 0,
            },
          }}
        >
          <h2
            css={{
              ...theme.h2,
              fontFamily: theme.fancyFontFamily,
              fontSize: 36,
              // marginBottom: 24,
              // marginTop: 60,
              textAlign: "left",
              [theme.mobile]: {
                fontSize: 28,
              },
            }}
          >
            Look for the <span css={{ color: theme.oceanBlue }}>BLUE</span> to
            find Happy Hour NOW!
          </h2>
        </div>

        {/* Map Container */}
        <Map
          establishments={establishmentsWithLocation}
          happyHourStatus={happyHourStatus}
          theme={theme}
        />

        {/* Stats */}
        <div
          css={{
            marginTop: 24,
            display: "flex",
            gap: 24,
            fontSize: 14,
            color: theme.darkGray,
            [theme.mobile]: {
              flexDirection: "column",
              gap: 12,
            },
          }}
        >
          <div>
            <strong>{establishmentsWithLocation.length}</strong> establishments
            on map
          </div>
          <div>
            <strong>
              {Object.values(happyHourStatus).filter(Boolean).length}
            </strong>{" "}
            currently in happy hour
          </div>
        </div>

        {/* Instructions */}
        {establishmentsWithLocation.length === 0 && (
          <div
            css={{
              marginTop: 24,
              padding: 20,
              backgroundColor: theme.lightGrout,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <p css={{ fontSize: 16, marginBottom: 8 }}>
              No establishments with location data yet.
            </p>
            <p css={{ fontSize: 14, color: theme.darkGray }}>
              Add a <code>location</code> field with <code>lat</code> and{" "}
              <code>lng</code> to your Sanity establishments to see them on the
              map!
            </p>
          </div>
        )}
      </Layout>
    </div>
  )
}

export default MapPage

export const query = graphql`
  query MapPageQuery {
    establishment: allSanityEstablishment {
      nodes {
        _id
        name
        neighborhood
        address
        happyHourTimes
        whatWeHaveHere
        theSpaceIsLike
        location {
          lat
          lng
        }
      }
    }
  }
`
