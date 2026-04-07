/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"
import { Search, X, Map, List } from "lucide-react"
import type { Filters } from "@/types/establishment"

interface FilterBarProps {
  filters: Filters
  searchQuery: string
  setSearchQuery: (query: string) => void
  resultCount?: number
  isMapPage?: boolean
}

export default function FilterBar({
  filters,
  searchQuery,
  setSearchQuery,
  resultCount,
  isMapPage = false,
}: FilterBarProps) {
  const {
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
  } = filters

  const hasActiveFilters =
    hasWine ||
    hasBeer ||
    hasCocktails ||
    hasFood ||
    hasCoffee ||
    hasPatio ||
    hasBarSeating ||
    hasDogFriendly ||
    hasNaDrinks

  const clearAllFilters = () => {
    setHasWine(false)
    setHasBeer(false)
    setHasCocktails(false)
    setHasFood(false)
    setHasCoffee(false)
    setHasPatio(false)
    setHasBarSeating(false)
    setHasDogFriendly(false)
    setHasNaDrinks(false)
    setSearchQuery("")
  }

  return (
    <>
      {/* Search Bar */}
      <div
        css={{
          margin: "0 -40px",
          padding: "16px 40px",
          borderBottom: `1px solid ${theme.lightGrout}`,
          [theme.mobile]: { margin: 0, padding: "12px 30px" },
        }}
      >
        <div css={{ position: "relative", maxWidth: 600 }}>
          <Search
            size={16}
            css={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.4,
            }}
          />
          <input
            type="text"
            placeholder="Search by name or neighborhood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            css={{
              width: "100%",
              padding: "10px 16px 10px 36px",
              fontSize: 12,
              letterSpacing: "0.03em",
              border: `1px solid ${theme.lightGrout}`,
              borderRadius: "20px",
              outline: "none",
              background: "transparent",
              transition: "border-color 0.2s",
              "&:focus": { borderColor: "black" },
            }}
          />
        </div>
      </div>

      {/* Filter bar */}
      <div
        css={{
          margin: "0 -40px",
          padding: "16px 40px",
          borderBottom: "1px solid black",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          [theme.mobile]: { margin: 0, padding: "12px 30px" },
        }}
      >
        <span
          css={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 500,
          }}
        >
          Show Me
        </span>

        <div css={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Wine", active: hasWine, toggle: () => setHasWine(!hasWine) },
          { label: "Beer", active: hasBeer, toggle: () => setHasBeer(!hasBeer) },
          { label: "Cocktails", active: hasCocktails, toggle: () => setHasCocktails(!hasCocktails) },
          { label: "Food", active: hasFood, toggle: () => setHasFood(!hasFood) },
          { label: "Coffee", active: hasCoffee, toggle: () => setHasCoffee(!hasCoffee) },
          { label: "Patio", active: hasPatio, toggle: () => setHasPatio(!hasPatio) },
          { label: "Bar Seating", active: hasBarSeating, toggle: () => setHasBarSeating(!hasBarSeating) },
          { label: "NA Drinks", active: hasNaDrinks, toggle: () => setHasNaDrinks(!hasNaDrinks) },
          { label: "🐶🐾 Friendly", active: hasDogFriendly, toggle: () => setHasDogFriendly(!hasDogFriendly) },
        ].map(({ label, active, toggle }) => (
          <button
            key={label}
            onClick={toggle}
            css={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontFamily: "inherit",
              transition: "background-color 0.2s, color 0.2s",
              ...(active
                ? { backgroundColor: "#A78BB5", color: "white", border: "1px solid #A78BB5" }
                : { backgroundColor: "transparent", color: "black", border: "1px solid black", "&:hover": { backgroundColor: "black", color: "white" } }),
            }}
          >
            {label}
          </button>
        ))}
        </div>

        {/* Controls */}
        <div css={{ display: "flex", gap: 8, alignItems: "center" }}>
          {resultCount !== undefined && (
            <span css={{ fontSize: 12, letterSpacing: "0.03em", opacity: 0.6 }}>
              {resultCount} {resultCount === 1 ? "spot" : "spots"}
            </span>
          )}
          <a
            href={isMapPage ? "/" : "/map"}
            css={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "0.5rem 1rem",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 500,
              color: "black",
              background: "transparent",
              border: "1px solid black",
              borderRadius: "20px",
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": { background: "black", color: "white" },
            }}
          >
            {isMapPage ? <List size={12} /> : <Map size={12} />}
            {isMapPage ? "List" : "Map"}
          </a>
          {(hasActiveFilters || searchQuery) && (
            <button
              onClick={clearAllFilters}
              css={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "0.5rem 1rem",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500,
                color: "black",
                background: "transparent",
                border: "1px solid black",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { background: "black", color: "white" },
              }}
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
      </div>
    </>
  )
}
