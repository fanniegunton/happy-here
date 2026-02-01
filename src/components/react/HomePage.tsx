/** @jsxImportSource @emotion/react */
import React, { useMemo, useEffect, useState } from "react"
import theme from "@styles/theme"
import EstablishmentTile from "./EstablishmentTile"
import FilterBar from "./FilterBar"
import { sortEstablishments } from "@lib/sortEstablishments"
import { hoursCover } from "@lib/parseHours"
import type { SanityEstablishment } from "@/types/sanity"

interface HomeClientProps {
  establishments: SanityEstablishment[]
}

export default function HomeClient({ establishments = [] }: HomeClientProps) {
  // Filter state - initialize to false on SSR, read from URL on client
  const [searchQuery, setSearchQuery] = useState("")
  const [hasWine, setHasWine] = useState(false)
  const [hasBeer, setHasBeer] = useState(false)
  const [hasCocktails, setHasCocktails] = useState(false)
  const [hasFood, setHasFood] = useState(false)
  const [hasCoffee, setHasCoffee] = useState(false)
  const [hasPatio, setHasPatio] = useState(false)
  const [hasBarSeating, setHasBarSeating] = useState(false)
  const [hasDogFriendly, setHasDogFriendly] = useState(false)
  const [hasNaDrinks, setHasNaDrinks] = useState(false)

  // Initialize filters from URL on mount (client-side only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearchQuery(params.get("search") || "")
    setHasWine(params.get("wine") === "true")
    setHasBeer(params.get("beer") === "true")
    setHasCocktails(params.get("cocktails") === "true")
    setHasFood(params.get("food") === "true")
    setHasCoffee(params.get("coffee") === "true")
    setHasPatio(params.get("patio") === "true")
    setHasBarSeating(params.get("barSeating") === "true")
    setHasDogFriendly(params.get("dogFriendly") === "true")
    setHasNaDrinks(params.get("naDrinks") === "true")
  }, [])

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
    if (searchQuery) params.set("search", searchQuery)
    if (hasWine) params.set("wine", "true")
    if (hasBeer) params.set("beer", "true")
    if (hasCocktails) params.set("cocktails", "true")
    if (hasFood) params.set("food", "true")
    if (hasCoffee) params.set("coffee", "true")
    if (hasPatio) params.set("patio", "true")
    if (hasBarSeating) params.set("barSeating", "true")
    if (hasDogFriendly) params.set("dogFriendly", "true")
    if (hasNaDrinks) params.set("naDrinks", "true")

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

  // Sort establishments by happy hour status
  const sortedEstablishments = useMemo(
    () => sortEstablishments(establishments),
    [establishments]
  )

  // Apply filters
  const filteredEstablishments = useMemo(() => {
    let result = sortedEstablishments

    // Apply search
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/)
      result = result.filter((est) => {
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
    }

    // Apply amenity filters
    if (hasWine)
      result = result.filter((est) => est.whatWeHaveHere?.includes("wine"))
    if (hasBeer)
      result = result.filter((est) => est.whatWeHaveHere?.includes("beer"))
    if (hasCocktails)
      result = result.filter((est) => est.whatWeHaveHere?.includes("cocktails"))
    if (hasFood)
      result = result.filter((est) => est.whatWeHaveHere?.includes("food"))
    if (hasCoffee)
      result = result.filter((est) => est.whatWeHaveHere?.includes("coffee"))
    if (hasNaDrinks)
      result = result.filter((est) => est.whatWeHaveHere?.includes("naDrinks"))
    if (hasPatio)
      result = result.filter((est) => est.theSpaceIsLike?.includes("patio"))
    if (hasBarSeating)
      result = result.filter((est) =>
        est.theSpaceIsLike?.includes("barSeating")
      )
    if (hasDogFriendly)
      result = result.filter((est) =>
        est.theSpaceIsLike?.includes("dogFriendly")
      )

    return result
  }, [
    sortedEstablishments,
    searchQuery,
    hasWine,
    hasBeer,
    hasCocktails,
    hasFood,
    hasCoffee,
    hasNaDrinks,
    hasPatio,
    hasBarSeating,
    hasDogFriendly,
  ])

  // Separate by happy hour status
  const happyHourNow = useMemo(
    () =>
      filteredEstablishments.filter(
        (est) =>
          est.happyHourTimes && hoursCover(est.happyHourTimes, new Date())
      ),
    [filteredEstablishments]
  )

  const happyHourLater = useMemo(
    () =>
      filteredEstablishments.filter(
        (est) =>
          !est.happyHourTimes || !hoursCover(est.happyHourTimes, new Date())
      ),
    [filteredEstablishments]
  )

  return (
    <>
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
            Where Is It Happy Hour Right Now?!
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
                gap: 30,
              },
              [theme.mobile]: {
                margin: 0,
                gap: 24,
              },
            }}
          >
            {happyHourNow.map((est) => (
              <EstablishmentTile key={est._id} {...est} />
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

      {/* Happy Hour Later Section */}
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
                gap: 30,
              },
              [theme.mobile]: {
                margin: 0,
                gap: 24,
              },
            }}
          >
            {happyHourLater.map((est) => (
              <EstablishmentTile key={est._id} {...est} />
            ))}
          </div>
        </>
      )}

      {/* No Results */}
      {filteredEstablishments.length === 0 && (
        <div
          css={{
            textAlign: "center",
            padding: "60px 20px",
            [theme.mobile]: {
              padding: "40px 30px",
            },
          }}
        >
          <h3
            css={{
              ...theme.h3,
              marginBottom: 16,
            }}
          >
            No establishments found
          </h3>
          <p
            css={{
              ...theme.body,
              color: theme.black,
              opacity: 0.7,
            }}
          >
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </>
  )
}
