import React, { useState } from "react"
import { useMediaQuery } from "@material-ui/core"
import theme from "../styles/theme"
// import EstablishmentTile from "../components/EstablishmentTile"
import { MODES } from "../components/ModeSelector"
import Pagination from "../components/Pagination"
import Map from "../components/Map"
// import ActiveListingPanel from "../components/ActiveListingPanel"
import cloneElement from "../lib/cloneElement"

const PER_PAGE = 30

const MapView = ({
  state,
  dispatch,
  currentRestaurants,
  filterBar,
  noResults,
}) => {
  const mobile = useMediaQuery(theme.mobile)
  const [mapOpen, setMapOpen] = useState(true)
  const paginatedRestaurants = currentRestaurants.slice(
    (state.page - 1) * PER_PAGE,
    state.page * PER_PAGE
  )

  return (
    <div
      css={{
        height: "100vh",
        scrollSnapAlign: "start", // Note: scroll-snapping on the parent is disabled in theme.js
        gridTemplateRows: "80px 1fr",
        position: "relative",
        "--listWidth": "400px",
        [theme.tablet]: {
          "--listWidth": "300px",
        },
        [theme.mobile]: {
          scrollSnapAlign: "none",
        },
      }}
      id="restaurants-list"
    >
      {mobile ? (
        <div>
          {filterBar}
          <TabBar mapOpen={mapOpen} setMapOpen={setMapOpen} />
        </div>
      ) : (
        filterBar
      )}

      {/* <ActiveListingPanel
        dispatch={dispatch}
        listing={
          state.activeListing &&
          currentRestaurants.find(({ _key }) => _key === state.activeListing)
        }
      /> */}

      <div
        css={{
          display: "grid",
          gridTemplateColumns: "var(--listWidth) 1fr",
          gridTemplateRows: "1fr 100px",
          gridTemplateAreas: `
            "list map"
            "pagination map"
          `,
          height: "calc(100vh - 80px)",
          marginLeft: "calc(0.5 * var(--pagePadding))",
          [theme.mobile]: {
            display: "block",
            marginLeft: 0,
            maxHeight: "calc(100vh - 145px)",
          },
        }}
      >
        {(!mobile || !mapOpen) && (
          <>
            <div
              css={[
                {
                  position: "relative",
                  gridArea: "list",
                  overflowY: state.activeListing ? "hidden" : "auto",
                  WebkitOverflowScrolling: "touch",
                  padding:
                    state.mode === MODES.MAP
                      ? "0 1px 0 0"
                      : "0 var(--pagePadding) var(--pagePadding) var(--pagePadding)",
                  [theme.mobile]: {
                    height: "calc(100% - 72px)",
                  },
                },
                paginatedRestaurants.length > 0 && {
                  ":before": {
                    content: "''",
                    display: "block",
                    position: "sticky",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 50,
                    zIndex: 2,
                    pointerEvents: "none",
                    background: `linear-gradient(to top, transparent, ${theme.n10})`,
                  },
                  ":after": {
                    content: "''",
                    display: "block",
                    position: "sticky",
                    bottom:
                      state.mode === MODES.MAP
                        ? 0
                        : "calc(-1 * var(--pagePadding))",
                    left: 0,
                    right: 0,
                    height: 50,
                    zIndex: 2,
                    pointerEvents: "none",
                    background: `linear-gradient(to bottom, transparent, ${theme.n10})`,
                  },
                },
              ]}
            >
              {paginatedRestaurants.length > 0 ? (
                <div
                  css={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: state.mode !== MODES.MAP && 24,
                    marginTop: -30,
                    [theme.mobile]: {
                      gridTemplateColumns: "1fr",
                      gap: state.mode !== MODES.MAP ? 8 : 16,
                    },
                  }}
                >
                  {/* {paginatedRestaurants.map((location) => (
                    <EstablishmentTile key={tile._id} {...tile} />
                  ))} */}
                </div>
              ) : (
                cloneElement(noResults, {
                  css: { marginRight: "calc(0.5 * var(--pagePadding))" },
                })
              )}
            </div>

            <Pagination
              currentPage={state.page}
              perPage={PER_PAGE}
              totalCount={currentRestaurants.length}
              setPage={(n) => dispatch({ action: "setPage", value: n })}
              css={{
                gridArea: "pagination",
                width: "100%",
                maxWidth: 225,
                margin: "24px auto",
              }}
            />
          </>
        )}

        {(!mobile || mapOpen) && (
          <div
            css={{
              gridArea: "map",
              height: "100%",
              padding: "var(--pagePadding)",
              paddingTop: 0,
              paddingLeft: 0,

              [theme.mobile]: {
                padding: "var(--pagePadding)",
              },
            }}
          >
            <Map
              locations={paginatedRestaurants}
              onChange={({ center, bounds, zoom }) => {
                dispatch({
                  action: "setMapGeometry",
                  value: { center, bounds, zoom },
                })
              }}
              activeListing={state.activeListing}
              center={state.mapCenter}
              zoom={state.mapZoom}
              dispatch={dispatch}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MapView

const TabBar = ({ mapOpen, setMapOpen }) => {
  return (
    <div
      css={{
        display: "flex",
        marginTop: 8,
        padding: "0 12px",
        borderBottom: `1px solid ${theme.n20}`,
      }}
    >
      <Tab active={mapOpen} onClick={() => setMapOpen(true)}>
        Map
      </Tab>
      <Tab active={!mapOpen} onClick={() => setMapOpen(false)}>
        List
      </Tab>
    </div>
  )
}

const Tab = ({ active, onClick, children }) => (
  <div
    css={{
      background: active ? theme.n10 : "#13202f",
      border: `1px solid ${active ? theme.n20 : "#13202f"}`,
      borderBottomColor: active ? theme.n10 : theme.n20,
      borderRadius: "3px 3px 0 0",
      padding: "8px 16px",
      marginLeft: 4,
      marginBottom: -1,
      fontSize: 12,
    }}
    onClick={onClick}
  >
    {children}
  </div>
)
