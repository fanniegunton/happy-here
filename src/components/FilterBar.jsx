// src/components/FilterBar.js
import React from "react"
import { Link } from "gatsby"
import theme from "../styles/theme"
import { Search, X, Map, List } from "lucide-react"

const FilterBar = ({ filters, searchQuery, setSearchQuery, resultCount, isMapPage }) => {
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
          margin: "0 auto 20px",
          padding: "0 20px",
          [theme.mobile]: {
            margin: "0 30px 20px",
            padding: 0,
          },
        }}
      >
        <div
          css={{
            position: "relative",
            maxWidth: 600,
          }}
        >
          <Search
            size={20}
            css={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: theme.darkGray,
              opacity: 0.5,
            }}
          />
          <input
            type="text"
            placeholder="Search by name or neighborhood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            css={{
              width: "100%",
              padding: "12px 16px 12px 44px",
              fontSize: 14,
              border: `2px solid ${theme.lightGrout}`,
              borderRadius: 12,
              outline: "none",
              transition: "border-color 0.2s",
              "&:focus": {
                borderColor: theme.oceanBlue,
              },
            }}
          />
        </div>
      </div>

      {/* Filter Header with Clear Button and Map Link */}
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 auto 10px",
          padding: "0 20px 20px",
          [theme.mobile]: {
            margin: "0 30px 10px",
            padding: 0,
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 12,
          },
        }}
      >
        <div
          css={{
            ...theme.postTitle,
            fontWeight: 700,
          }}
        >
          Only show me places with:
        </div>
        <div
          css={{
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Link
            to={isMapPage ? "/" : "/map"}
            css={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              color: theme.oceanBlue,
              background: "transparent",
              border: `2px solid ${theme.oceanBlue}`,
              borderRadius: 8,
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": {
                background: theme.oceanBlue,
                color: theme.white,
              },
            }}
          >
            {isMapPage ? <List size={16} /> : <Map size={16} />}
            {isMapPage ? "List View" : "Map View"}
          </Link>
          {(hasActiveFilters || searchQuery) && (
            <button
              onClick={clearAllFilters}
              css={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 600,
                color: theme.oceanBlue,
                background: "transparent",
                border: `2px solid ${theme.oceanBlue}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  background: theme.oceanBlue,
                  color: theme.white,
                },
              }}
            >
              <X size={16} />
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Result Count */}
      {resultCount !== undefined && (
        <div
          css={{
            margin: "0 auto 10px",
            padding: "0 20px 10px",
            fontSize: 14,
            color: theme.darkGray,
            [theme.mobile]: {
              margin: "0 30px 10px",
              padding: 0,
            },
          }}
        >
          Showing {resultCount}{" "}
          {resultCount === 1 ? "establishment" : "establishments"}
        </div>
      )}

      <div
        css={{
          margin: "0 auto",
          padding: "0 20px 20px",
          ...theme.subtitle,
          fontSize: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, auto))",
          gap: "8px 40px",
          [theme.mobile]: {
            margin: "0 30px 20px",
            padding: 0,
            gridTemplateColumns: "1fr 1fr",
          },
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={hasWine}
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasWine(!hasWine)}
          />
          Wine
        </label>
        <label>
          <input
            type="checkbox"
            checked={hasBeer}
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasBeer(!hasBeer)}
          />
          Beer
        </label>
        <label>
          <input
            type="checkbox"
            checked={hasCocktails}
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasCocktails(!hasCocktails)}
          />
          Cocktails
        </label>
        <label>
          <input
            type="checkbox"
            checked={hasFood}
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasFood(!hasFood)}
          />
          Food
        </label>
        <label>
          <input
            type="checkbox"
            checked={hasCoffee}
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasCoffee(!hasCoffee)}
          />
          Coffee
        </label>
        <label>
          <input
            type="checkbox"
            checked={hasPatio}
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasPatio(!hasPatio)}
          />
          Patio
        </label>
        <label>
          <input
            type="checkbox"
            checked={hasBarSeating}
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasBarSeating(!hasBarSeating)}
          />
          Bar Seating
        </label>
        <label>
          <input
            type="checkbox"
            checked={hasNaDrinks}
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasNaDrinks(!hasNaDrinks)}
          />
          NA Drinks
        </label>
        <label>
          <input
            type="checkbox"
            checked={hasDogFriendly}
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasDogFriendly(!hasDogFriendly)}
          />
          🐶🐾 Friendly
        </label>
      </div>
    </>
  )
}

export default FilterBar
