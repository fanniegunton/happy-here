/** @jsxImportSource @emotion/react */
import React, { useMemo, useState, useEffect } from "react"
import theme from "@styles/theme"
import FilterBar from "./FilterBar"
import EstablishmentTile from "./EstablishmentTile"
import SanityImage from "./SanityImage"
import PortableTextBody from "./PortableTextBody"
import { sortEstablishments } from "@lib/sortEstablishments"
import { hoursCover } from "@lib/parseHours"
import { neighborhoodColorSchemes } from "@styles/neighborhoodColorSchemes"
import type { SanityEstablishment, SanityNeighborhood } from "@/types/sanity"

interface NeighborhoodPageProps {
  establishments: SanityEstablishment[]
  neighborhoodLabel: string
  neighborhoodContent?: SanityNeighborhood | null
  mainCopyHtml?: string
}

export default function NeighborhoodPage({
  establishments,
  neighborhoodLabel,
  neighborhoodContent,
  mainCopyHtml,
}: NeighborhoodPageProps) {
  const scheme = neighborhoodContent?.colorScheme
    ? neighborhoodColorSchemes[neighborhoodContent.colorScheme]
    : null
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
    <div
      css={{
        // PLACEHOLDER color-scheme accent, set only when a neighborhood document
        // specifies one — see @styles/neighborhoodColorSchemes for the mechanism.
        ...(scheme && {
          ["--neighborhood-accent" as any]: scheme.accent,
          ["--neighborhood-background" as any]: scheme.background,
        }),
      }}
    >
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
          marginTop: 36,
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

      {neighborhoodContent?.photos && neighborhoodContent.photos.length > 0 && (
        <div
          css={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            marginBottom: 32,
            [theme.mobile]: { padding: "0 30px" },
          }}
        >
          {neighborhoodContent.photos.map((photo, index) => (
            <SanityImage
              key={index}
              image={photo}
              width={500}
              height={333}
              alt={`Photo of ${neighborhoodLabel}`}
              style={{
                display: "block",
                width: 500,
                flexShrink: 0,
                aspectRatio: "3 / 2",
                objectFit: "cover",
                borderRadius: 20,
              }}
            />
          ))}
        </div>
      )}

      <div
        css={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 36,
          [theme.mobile]: { padding: "0 30px", marginBottom: 32 },
        }}
      >
        <h2
          css={{
            fontFamily: theme.displayFontFamily,
            fontSize: 80,
            textTransform: "uppercase",
            lineHeight: 1,
            letterSpacing: "-0.05em",
            fontWeight: 900,
            [theme.tablet]: { fontSize: 80 },
            [theme.mobile]: { fontSize: 44 },
          }}
        >
          {neighborhoodLabel}
        </h2>
      </div>

      {neighborhoodContent?.quickDescription && (
        <p
          css={{
            ...theme.subtitle,
            maxWidth: 700,
            marginBottom: 48,
            [theme.mobile]: { padding: "0 30px", marginBottom: 32 },
          }}
        >
          {neighborhoodContent.quickDescription}
        </p>
      )}

      {mainCopyHtml && (
        <div
          css={{
            maxWidth: 700,
            marginBottom: 48,
            padding: 24,
            borderRadius: 20,
            background: scheme ? "var(--neighborhood-background)" : undefined,
            [theme.mobile]: { margin: "0 30px 32px", padding: 16 },
          }}
        >
          <PortableTextBody html={mainCopyHtml} />
        </div>
      )}

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
                fontWeight: 400,
                [theme.tablet]: { fontSize: 80 },
                [theme.mobile]: { fontSize: 44 },
              }}
            >
              Happy Hour Now
            </h2>
            <span css={{ fontSize: 48, [theme.mobile]: { fontSize: 28 } }}>
              ✦
            </span>
          </div>
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              margin: "0 auto",
              justifyContent: "center",
              justifyItems: "center",
              alignItems: "start",
              gap: "40px 40px",
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
              [theme.mobile]: {
                padding: "0 30px",
                marginTop: 36,
                borderTop: `1px solid ${theme.duskyPurple}`,
              },
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
                [theme.tablet]: { fontSize: 80, marginTop: 64 },
                [theme.mobile]: { fontSize: 44 },
              }}
            >
              Future Happy Hours
            </h2>
            <span css={{ fontSize: 48, [theme.mobile]: { fontSize: 28 } }}>
              ✦
            </span>
          </div>
          <div
            css={{
              display: "grid",
              // Compact tiles: three across on desktop, two on small desktop.
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              margin: "0 auto",
              justifyContent: "center",
              justifyItems: "center",
              alignItems: "start",
              gap: "32px 24px",
              [theme.smallDesktop]: { gridTemplateColumns: "1fr 1fr" },
              [theme.tablet]: { gridTemplateColumns: "1fr", gap: 30 },
              [theme.mobile]: { margin: 0, gap: 24 },
            }}
          >
            {happyHourLater.map((est) => (
              <EstablishmentTile key={est._id} {...est} compact />
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
    </div>
  )
}
