import React, { useReducer, useMemo } from "react"
import Fuse from "fuse.js"
import { reducer, initialState } from "../reducers/restaurantsViewer"
import { MODES } from "../components/ModeSelector"
import FilterBar from "../components/FilterBar"
import { hoursCover } from "../lib/parseHours"
import MapView from "../components/MapView"
import GridView from "../components/GridView"
import NoResults from "../components/NoResults"

const EstablishmentsViewer = ({
  title,
  establishments,
  defaultSearchQuery,
  defaultFilters,
  defaultViewMode,
  showingAll,
  preserveOrder,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    mode: defaultViewMode || "map",
    searchQuery: defaultSearchQuery || "",
    filters: new Set(defaultFilters),
  })
  const fuse = useMemo(
    () => new Fuse(establishments, fuseConfig),
    [establishments]
  )

  const filteredEstablishments = useMemo(() => {
    const activeFilters = Array.from(state.filters).map(
      (filter) => filters[filter]
    )

    return applyFilters(
      state.searchQuery?.length > 0
        ? fuse.search(state.searchQuery).map((res) => res.item)
        : establishments,
      activeFilters
    )
  }, [fuse, state.searchQuery, state.filters, establishments])

  const currentEstablishments =
    state.mode === MODES.MAP && state.mapBounds
      ? filters.inView(state.mapBounds)(filteredEstablishments)
      : filteredEstablishments

  const filterBar = (
    <FilterBar
      key={`filter-bar-${state.filterBarKey}`}
      listTitle={title}
      defaultSearchQuery={state.searchQuery || defaultSearchQuery}
      mode={state.mode}
      filters={state.filters}
      dispatch={dispatch}
    />
  )

  const noResults = (
    <NoResults
      listTitle={title}
      searchQuery={state.searchQuery}
      showingAll={showingAll}
      resetSearch={() => {
        dispatch({ action: "clearSearchQuery" })
      }}
    />
  )

  const View = state.mode === MODES.MAP ? MapView : GridView

  return (
    <View
      state={state}
      dispatch={dispatch}
      currentEstablishments={currentEstablishments}
      filterBar={filterBar}
      noResults={noResults}
      preserveOrder={preserveOrder}
    />
  )
}

export default EstablishmentsViewer

const filters = {
  hideClosed: (list) => list.filter((entry) => entry.openForBusiness),
  currentlyOpen: (list) => list.filter((entry) => hoursCover(entry.hours)),
  // inView: bounds => list =>
  //   list.filter(
  //     ({ geoLocation: { lat, lng } }) =>
  //       lng > bounds.nw.lng &&
  //       lng < bounds.se.lng &&
  //       lat < bounds.nw.lat &&
  //       lat > bounds.se.lat
  //   ),
}

const fuseConfig = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: ["name", "tags", "sourceNotes", "orderNotes"],
}

const applyFilters = (list, filters) =>
  filters.filter((x) => x).reduce((results, filter) => filter(results), list)
