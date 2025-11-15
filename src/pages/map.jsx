import React, { useState, useEffect } from "react"
import { graphql, Link } from "gatsby"
import theme from "../styles/theme"
import Layout from "../components/Layout"
import Header from "../components/Header"
import Map from "../components/Map"
import { hoursCover } from "../lib/parseHours"
import { ArrowLeft } from "lucide-react"

const MapPage = ({ data }) => {
  // Filter out test establishment if not in development environment
  let establishments = data.establishment.nodes
  if (process.env.NODE_ENV !== "development") {
    establishments = establishments.filter(
      (est) => est._id !== "b95f53fc-ae57-4605-b4b6-6ceb785a1756"
    )
  }

  // Filter out establishments without location data
  const establishmentsWithLocation = establishments.filter(
    (est) => est.location?.lat && est.location?.lng
  )

  const [happyHourStatus, setHappyHourStatus] = useState({})

  // Check happy hour status for all establishments
  useEffect(() => {
    const checkAllHours = () => {
      const status = {}
      establishmentsWithLocation.forEach((est) => {
        status[est._id] = hoursCover(est.happyHourTimes, new Date())
      })
      setHappyHourStatus(status)
    }

    checkAllHours()
    const timer = setInterval(checkAllHours, 30_000)
    return () => clearInterval(timer)
  }, [establishmentsWithLocation])


  return (
    <div>
      <Layout>
        <Header css={{ margin: "0 auto 40px" }} />

        {/* Back button */}
        <Link
          to="/"
          css={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: theme.oceanBlue,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 24,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          <ArrowLeft size={16} />
          Back to list view
        </Link>

        <div
          css={{
            marginBottom: 16,
          }}
        >
          <h1
            css={{
              ...theme.h1,
              fontSize: 36,
              marginBottom: 8,
            }}
          >
            Map View
          </h1>
          <p css={{ fontSize: 16, color: theme.darkGray }}>
            Blue markers are currently in happy hour, yellow markers are not
          </p>
        </div>

        {/* Map Container */}
        <Map
          establishments={establishmentsWithLocation}
          happyHourStatus={happyHourStatus}
          theme={theme}
        />

        {/* Stats */}
        <div
          css={{
            marginTop: 24,
            display: "flex",
            gap: 24,
            fontSize: 14,
            color: theme.darkGray,
            [theme.mobile]: {
              flexDirection: "column",
              gap: 12,
            },
          }}
        >
          <div>
            <strong>{establishmentsWithLocation.length}</strong> establishments
            on map
          </div>
          <div>
            <strong>
              {Object.values(happyHourStatus).filter(Boolean).length}
            </strong>{" "}
            currently in happy hour
          </div>
        </div>

        {/* Instructions */}
        {establishmentsWithLocation.length === 0 && (
          <div
            css={{
              marginTop: 24,
              padding: 20,
              backgroundColor: theme.lightGrout,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <p css={{ fontSize: 16, marginBottom: 8 }}>
              No establishments with location data yet.
            </p>
            <p css={{ fontSize: 14, color: theme.darkGray }}>
              Add a <code>location</code> field with <code>lat</code> and{" "}
              <code>lng</code> to your Sanity establishments to see them on the
              map!
            </p>
          </div>
        )}
      </Layout>
    </div>
  )
}

export default MapPage

export const query = graphql`
  query MapPageQuery {
    establishment: allSanityEstablishment {
      nodes {
        _id
        name
        neighborhood
        happyHourTimes
        location {
          lat
          lng
        }
      }
    }
  }
`
