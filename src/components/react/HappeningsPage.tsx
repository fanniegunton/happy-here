/** @jsxImportSource @emotion/react */
import React, { useMemo, useEffect, useState } from "react"
import theme from "@styles/theme"
import HappeningsTile from "./HappeningsTile"
import FilterBar from "./FilterBar"
import { sortEstablishments } from "@lib/sortEstablishments"
import { hoursCover } from "@lib/parseHours"
import { flattenOtherDeals } from "@lib/flattenOtherDeals"
import type { SanityEstablishment } from "@/types/sanity"
import { uppercase } from "zod"

interface HappeningsPageProps {
  establishments: SanityEstablishment[]
}

export default function HappeningsPage({
  establishments = [],
}: HappeningsPageProps) {
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

  // Flatten every establishment's otherDeals into one tile per deal entry
  const dealTiles = useMemo(
    () => flattenOtherDeals(establishments),
    [establishments]
  )

  // Sort deal tiles the same way Home sorts establishments: currently
  // happening deals first (soonest ending first), then upcoming deals
  // (soonest starting first)
  const sortedDealTiles = useMemo(
    () => sortEstablishments(dealTiles),
    [dealTiles]
  )

  // Apply filters
  const filteredDealTiles = useMemo(() => {
    let result = sortedDealTiles

    // Apply search
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/)
      result = result.filter((deal) => {
        const searchableContent = [
          deal.name,
          deal.neighborhood,
          deal.address,
          ...(deal.whatWeHaveHere || []),
          ...(deal.theSpaceIsLike || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        return searchTerms.every((term) => searchableContent.includes(term))
      })
    }

    // Apply amenity filters
    if (hasWine)
      result = result.filter((deal) => deal.whatWeHaveHere?.includes("wine"))
    if (hasBeer)
      result = result.filter((deal) => deal.whatWeHaveHere?.includes("beer"))
    if (hasCocktails)
      result = result.filter((deal) =>
        deal.whatWeHaveHere?.includes("cocktails")
      )
    if (hasFood)
      result = result.filter((deal) => deal.whatWeHaveHere?.includes("food"))
    if (hasCoffee)
      result = result.filter((deal) => deal.whatWeHaveHere?.includes("coffee"))
    if (hasNaDrinks)
      result = result.filter((deal) =>
        deal.whatWeHaveHere?.includes("naDrinks")
      )
    if (hasPatio)
      result = result.filter((deal) => deal.theSpaceIsLike?.includes("patio"))
    if (hasBarSeating)
      result = result.filter((deal) =>
        deal.theSpaceIsLike?.includes("barSeating")
      )
    if (hasDogFriendly)
      result = result.filter((deal) =>
        deal.theSpaceIsLike?.includes("dogFriendly")
      )

    return result
  }, [
    sortedDealTiles,
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

  // Separate by whether the deal's times currently cover now
  const happeningNow = useMemo(
    () =>
      filteredDealTiles.filter(
        (deal) =>
          deal.happyHourTimes && hoursCover(deal.happyHourTimes, new Date())
      ),
    [filteredDealTiles]
  )

  const happeningLater = useMemo(
    () =>
      filteredDealTiles.filter(
        (deal) =>
          !deal.happyHourTimes || !hoursCover(deal.happyHourTimes, new Date())
      ),
    [filteredDealTiles]
  )

  return (
    <>
      <div
        css={{
          marginTop: 32,
          marginBottom: 32,
          [theme.mobile]: { padding: "0 30px" },
        }}
      >
        <h1
          css={{
            ...theme.h2,
            fontWeight: 600,
            fontSize: 100,
            textTransform: "uppercase",
            [theme.tablet]: { fontSize: 80 },
            [theme.mobile]: {
              fontSize: 44,
            },
          }}
        >
          Happenings
        </h1>
        <h3
          css={{
            fontSize: 24,
            fontFamily: theme.newFontFamily,
            fontWeight: 500,
            lineHeight: 1.35,
            letterSpacing: "0.03em",
            [theme.mobile]: {
              fontSize: 22,
            },
            maxWidth: "85%",
            textWrap: "pretty",
          }}
        >
          Collecting all of the OTHER deals like: Daily Specials, Reverse Happy
          Hour, Industry Night, etc.
        </h3>
      </div>

      <FilterBar
        filters={filters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultCount={filteredDealTiles.length}
      />

      {/* Happening Now Section */}
      {happeningNow.length > 0 && (
        <>
          <div
            css={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 48,
              marginBottom: 32,
              [theme.mobile]: { padding: "0 30px" },
            }}
          >
            <h2
              css={{
                fontFamily: theme.newFontFamily,
                fontFamily: theme.newFontFamily,
                fontSize: 80,
                textTransform: "uppercase",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                fontWeight: 400,
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
            {happeningNow.map((deal) => (
              <HappeningsTile key={deal._id} {...deal} />
            ))}
          </div>
        </>
      )}

      {/* Coming Up Section */}
      {happeningLater.length > 0 && (
        <>
          <div
            css={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 96,
              marginBottom: 32,
              [theme.mobile]: { padding: "0 30px", marginTop: 72 },
            }}
          >
            <h2
              css={{
                fontFamily: theme.newFontFamily,
                fontSize: 80,
                textTransform: "uppercase",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                fontWeight: 400,
                [theme.tablet]: { fontSize: 80 },
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
            {happeningLater.map((deal) => (
              <HappeningsTile key={deal._id} {...deal} />
            ))}
          </div>
        </>
      )}

      {/* No Results */}
      {filteredDealTiles.length === 0 && (
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
            {dealTiles.length === 0
              ? "No happenings yet, check back soon"
              : "No happenings found"}
          </h3>
          {dealTiles.length > 0 && (
            <p
              css={{
                ...theme.body,
                color: theme.black,
                opacity: 0.7,
              }}
            >
              Try adjusting your filters or search query
            </p>
          )}
        </div>
      )}
    </>
  )
}
