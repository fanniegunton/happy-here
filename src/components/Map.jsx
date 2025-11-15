import React, { useEffect, useRef } from "react"

const Map = ({ establishments, happyHourStatus, theme }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    // Only load Leaflet on client side
    if (typeof window === "undefined") return

    // Don't initialize if already initialized
    if (mapInstanceRef.current) return

    let leaflet

    const loadMap = async () => {
      // Dynamically import Leaflet
      leaflet = await import("leaflet")
      await import("leaflet/dist/leaflet.css")

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

      // Add tile layer
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(mapInstance)

      // Add markers
      validEstablishments.forEach((establishment) => {
        const isHappyHour = happyHourStatus[establishment._id]
        const slug = establishment.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")

        // Create custom icon
        const markerHtml = `
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z"
                  fill="${isHappyHour ? theme.oceanBlue : theme.lemonYellow}"
                  stroke="${isHappyHour ? theme.white : theme.darkGray}"
                  stroke-width="2"/>
            <circle cx="16" cy="16" r="6"
                    fill="${isHappyHour ? theme.white : theme.darkGray}"/>
          </svg>
        `

        const icon = leaflet.divIcon({
          html: markerHtml,
          className: "custom-marker",
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        })

        // Format happy hour times
        const happyHourTimesHTML = establishment.happyHourTimes
          ? establishment.happyHourTimes
              .map(
                (time) =>
                  `<div style="font-size: 13px; color: ${theme.darkGray}; line-height: 1.4;">${time}</div>`
              )
              .join("")
          : ""

        // Create popup content (entire popup is clickable)
        const popupContent = `
          <a href="/establishment/${slug}" style="text-decoration: none; color: inherit; display: block; cursor: pointer;">
            <div style="padding: 12px;">
              <h3 style="font-size: 16px; font-family: 'Playfair Display', serif; margin: 0 0 6px 0; color: ${theme.oceanBlue};">
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

        // Add marker
        leaflet
          .marker([establishment.location.lat, establishment.location.lng], {
            icon,
          })
          .bindPopup(popupContent)
          .addTo(mapInstance)
      })
    }

    loadMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // Empty dependency array - only run once

  return (
    <div
      id="map-container"
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        border: `2px solid ${theme.lightGrout}`,
      }}
    />
  )
}

export default Map
