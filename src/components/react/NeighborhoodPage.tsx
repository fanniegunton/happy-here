/** @jsxImportSource @emotion/react */
import React, { useMemo, useState, useEffect } from "react"
import theme from "@styles/theme"
import Header from "./Header"
import FilterBar from "./FilterBar"
import EstablishmentTile from "./EstablishmentTile"
import { sortEstablishments } from "@lib/sortEstablishments"
import { hoursCover } from "@lib/parseHours"
import type { SanityEstablishment } from "@/types/sanity"

interface NeighborhoodPageProps {
  establishments: SanityEstablishment[]
  neighborhoodLabel: string
}

export default function NeighborhoodPage({
  establishments,
  neighborhoodLabel,
}: NeighborhoodPageProps) {
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

  const sortedEstablishments = useMemo(
    () => sortEstablishments(establishments),
    [establishments]
  )

  const filteredEstablishments = useMemo(() => {
    let result = sortedEstablishments

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
      <Header />

      <FilterBar
        filters={filters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultCount={filteredEstablishments.length}
      />

      <div
        css={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 48,
          marginBottom: 16,
          [theme.mobile]: { padding: "0 30px" },
        }}
      >
        <a
          href="/neighborhoods"
          css={{
            fontFamily: theme.displayFontFamily,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            opacity: 0.75,
            textDecoration: "none",
            transition: "opacity 0.2s",
            "&:hover": { opacity: 1 },
          }}
        >
          ← Neighborhoods
        </a>
      </div>

      <div
        css={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 48,
          [theme.mobile]: { padding: "0 30px", marginBottom: 32 },
        }}
      >
        <h1
          css={{
            // fontFamily: theme.newFontFamily,
            fontFamily: theme.displayFontFamily,
            // fontSize: 120,
            fontSize: 48,
            textTransform: "uppercase",
            lineHeight: 1,
            letterSpacing: "-0.05em",
            fontWeight: 900,
            [theme.tablet]: { fontSize: 80 },
            [theme.mobile]: { fontSize: 52 },
          }}
        >
          {neighborhoodLabel}
        </h1>
        <span
          css={{
            fontSize: 42,
            // textTransform: "uppercase",
            // lineHeight: 1,
            // letterSpacing: "-0.05em",
            // fontWeight: 900,
            [theme.mobile]: { fontSize: 28 },
          }}
        >
          ✦
        </span>
      </div>

      {happyHourNow.length > 0 && (
        <>
          <div
            css={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 96,
              marginBottom: 48,
              [theme.tablet]: { marginTop: 64 },
              [theme.mobile]: { padding: "0 30px" },
            }}
          >
            <h2
              css={{
                fontFamily: theme.newFontFamily,
                fontSize: 80,
                textTransform: "uppercase",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                fontWeight: 900,
                [theme.tablet]: { fontSize: 80 },
                [theme.mobile]: { fontSize: 52 },
              }}
            >
              Happening Now
            </h2>
            <span css={{ fontSize: 48, [theme.mobile]: { fontSize: 28 } }}>
              ✦
            </span>
          </div>
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              margin: "0 auto",
              justifyContent: "center",
              justifyItems: "center",
              gap: "40px 40px",
              [theme.smallDesktop]: { gridTemplateColumns: "1fr 1fr" },
              [theme.tablet]: { gridTemplateColumns: "1fr", gap: 30 },
              [theme.mobile]: { margin: 0, gap: 24 },
            }}
          >
            {happyHourNow.map((est) => (
              <EstablishmentTile key={est._id} {...est} />
            ))}
          </div>
        </>
      )}

      {happyHourLater.length > 0 && (
        <>
          <div
            css={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 96,
              marginBottom: 32,
              [theme.mobile]: { padding: "0 30px" },
            }}
          >
            <h2
              css={{
                fontFamily: theme.newFontFamily,
                fontSize: 80,
                textTransform: "uppercase",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                fontWeight: 900,
                [theme.tablet]: { fontSize: 80, marginTop: 64 },
                [theme.mobile]: { fontSize: 52 },
              }}
            >
              Coming Up
            </h2>
            <span css={{ fontSize: 48, [theme.mobile]: { fontSize: 28 } }}>
              ✦
            </span>
          </div>
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              margin: "0 auto",
              justifyContent: "center",
              justifyItems: "center",
              gap: "40px 40px",
              [theme.smallDesktop]: { gridTemplateColumns: "1fr 1fr" },
              [theme.tablet]: { gridTemplateColumns: "1fr", gap: 30 },
              [theme.mobile]: { margin: 0, gap: 24 },
            }}
          >
            {happyHourLater.map((est) => (
              <EstablishmentTile key={est._id} {...est} />
            ))}
          </div>
        </>
      )}

      {filteredEstablishments.length === 0 && (
        <div
          css={{
            textAlign: "center",
            padding: "60px 20px",
            [theme.mobile]: { padding: "40px 30px" },
          }}
        >
          <h3 css={{ ...theme.h3, marginBottom: 16 }}>
            No establishments found
          </h3>
          <p css={{ ...theme.body, color: theme.black, opacity: 0.7 }}>
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </>
  )
}
