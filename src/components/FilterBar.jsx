// src/components/FilterBar.js
import React from "react"
import theme from "../styles/theme"

const FilterBar = ({ filters }) => {
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
    hasBigGroups,
    setHasBigGroups,
  } = filters

  return (
    <>
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
            type="checkbox"
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasWine(!hasWine)}
          />
          Wine
        </label>
        <label css={{ marginRight: 20 }}>
          <input
            type="checkbox"
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasBeer(!hasBeer)}
          />
          Beer
        </label>
        <label css={{ marginRight: 20 }}>
          <input
            type="checkbox"
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasCocktails(!hasCocktails)}
          />
          Cocktails
        </label>
        <label css={{ marginRight: 20 }}>
          <input
            type="checkbox"
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasFood(!hasFood)}
          />
          Food
        </label>
        <label css={{ marginRight: 20 }}>
          <input
            type="checkbox"
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasCoffee(!hasCoffee)}
          />
          Coffee
        </label>
        <label css={{ marginRight: 20 }}>
          <input
            type="checkbox"
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasPatio(!hasPatio)}
          />
          Patio
        </label>
        <label css={{ marginRight: 20 }}>
          <input
            type="checkbox"
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasBarSeating(!hasBarSeating)}
          />
          Bar Seating
        </label>
        <label css={{ marginRight: 20 }}>
          <input
            type="checkbox"
            css={{ marginRight: 10, cursor: "pointer" }}
            onChange={() => setHasBigGroups(!hasBigGroups)}
          />
          Room for 4 or more
        </label>
        <label css={{ marginRight: 20 }}>
          <input
            type="checkbox"
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
