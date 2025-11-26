import React, { useEffect, useRef } from "react"

const Map = ({ establishments, happyHourStatus, theme }) => {
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const leafletRef = useRef(null)

  // Initialize map once
  useEffect(() => {
    // Only load Leaflet on client side
    if (typeof window === "undefined") return

    const loadMap = async () => {
      // Dynamically import Leaflet
      const leaflet = await import("leaflet")
      await import("leaflet/dist/leaflet.css")
      leafletRef.current = leaflet

      // Calculate center
      const validEstablishments = establishments.filter(
        (est) => est.location?.lat && est.location?.lng
      )

      let center = [30.2672, -97.7431] // Austin default
      if (validEstablishments.length > 0) {
        const avgLat =
          validEstablishments.reduce((sum, est) => sum + est.location.lat, 0) /
          validEstablishments.length
        const avgLng =
          validEstablishments.reduce((sum, est) => sum + est.location.lng, 0) /
          validEstablishments.length
        center = [avgLat, avgLng]
      }

      // Create map
      const mapInstance = leaflet.map("map-container").setView(center, 13)
      mapInstanceRef.current = mapInstance

      // Disable scroll wheel zoom on mobile
      if (window.innerWidth < 700) {
        mapInstance.scrollWheelZoom.disable()
      }

      // Add tile layer
      leaflet
        .tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          }
        )
        .addTo(mapInstance)
    }

    loadMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // Only run once

  // Update markers when happyHourStatus changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return

    const leaflet = leafletRef.current

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add new markers
    const validEstablishments = establishments.filter(
      (est) => est.location?.lat && est.location?.lng
    )

    validEstablishments.forEach((establishment) => {
      const isHappyHour = happyHourStatus[establishment._id]
      const slug = establishment.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      // Format happy hour times
      const happyHourTimesHTML = establishment.happyHourTimes
        ? establishment.happyHourTimes
            .map(
              (time) =>
                `<div style="font-size: 13px; color: ${theme.black}; line-height: 1.4;">${time}</div>`
            )
            .join("")
        : ""

      // Create popup content (entire popup is clickable)
      const popupContent = `
        <a href="/establishment/${slug}" style="text-decoration: none; color: inherit; display: block; cursor: pointer;">
          <div style="padding: 12px;">
            <h3 style="font-size: 16px; font-family: 'Playfair Display', serif; margin: 0 0 6px 0; color: ${
              theme.oceanBlue
            };">
              ${establishment.name}
            </h3>
            ${
              isHappyHour
                ? `<div style="font-size: 11px; font-weight: 600; color: ${theme.white}; background-color: ${theme.oceanBlue}; padding: 3px 6px; border-radius: 4px; text-align: center; margin-bottom: 6px; display: inline-block;">
                     Happy Hour Now!
                   </div>`
                : ""
            }
            ${happyHourTimesHTML}
          </div>
        </a>
      `

      // Create circle marker with styling based on happy hour status
      const marker = leaflet
        .circleMarker(
          [establishment.location.lat, establishment.location.lng],
          {
            radius: 8,
            fillColor: theme.white,
            fillOpacity: 1,
            color: isHappyHour ? theme.oceanBlue : theme.black,
            // weight: isHappyHour ? 4 : 2,
            weight: 4,
            opacity: 1,
            interactive: true,
          }
        )
        .bindPopup(popupContent, {
          maxWidth: 300,
          className: "establishment-popup",
          autoClose: false,
        })
        .addTo(mapInstanceRef.current)

      markersRef.current.push(marker)
    })
  }, [establishments, happyHourStatus, theme])

  return (
    <div
      id="map-container"
      css={{
        height: 600,
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        border: `2px solid ${theme.lightGrout}`,
        [theme.mobile]: {
          height: 400,
        },
      }}
    />
  )
}

export default Map
