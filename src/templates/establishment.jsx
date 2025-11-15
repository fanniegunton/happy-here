import React, { useEffect, useState } from "react"
import { graphql, Link } from "gatsby"
import { Global } from "@emotion/react"
import theme, { globalStyles } from "../styles/theme"
import Layout from "../components/Layout"
import Header from "../components/Header"
import SanityImage from "gatsby-plugin-sanity-image"
import IconButton from "../components/IconButton"
import Icons from "../lib/icons"
import AmmenityPill from "../components/AmmenityPill"
import { hoursCover } from "../lib/parseHours"
import { getTodayEndTime } from "../lib/getTodayTime"
import { getNextStartTime } from "../lib/getNextStartTime"
import { formatMilitaryTime } from "../lib/formatMilitaryTime"
import {
  MapPin,
  UtensilsCrossed,
  Beer,
  Wine,
  Martini,
  Coffee,
  CupSoda,
  Store,
  TreePalm,
  PawPrint,
  UserRound,
  UsersRound,
  ConciergeBell,
  CalendarCheck,
  Sparkles,
  ArrowLeft,
} from "lucide-react"

const EstablishmentPage = ({ data }) => {
  const establishment = data.establishment
  const [isHappyHour, setHappyHour] = useState(false)

  useEffect(() => {
    const checkHours = () => {
      setHappyHour(hoursCover(establishment.happyHourTimes, new Date()))
    }
    checkHours()
    const timer = window.setInterval(checkHours, 30_000)
    return () => window.clearInterval(timer)
  }, [establishment.happyHourTimes])

  const todayEndTime = getTodayEndTime(establishment.happyHourTimes)
  const formattedEndTime =
    todayEndTime !== null ? formatMilitaryTime(todayEndTime) : "Closed"

  let nextHappyHourDay = ""
  let nextHappyHourTime = ""

  const nextStartDate = getNextStartTime(establishment.happyHourTimes)
  if (nextStartDate) {
    const militaryTime =
      nextStartDate.getHours() * 100 + nextStartDate.getMinutes()
    const formattedTime = formatMilitaryTime(militaryTime)
    const now = new Date()
    const dayLabel =
      nextStartDate.toDateString() === now.toDateString()
        ? "Today"
        : nextStartDate.toLocaleDateString("en-US", { weekday: "long" })
    nextHappyHourDay = dayLabel
    nextHappyHourTime = formattedTime
  }

  return (
    <div>
      <Layout>
        <Global styles={globalStyles} />
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
          Back to all establishments
        </Link>

        <div
          css={{
            maxWidth: 900,
          }}
        >
          {/* Title and Happy Hour Status */}
          <div
            css={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
              gap: 24,
              [theme.mobile]: {
                flexDirection: "column",
                gap: 16,
              },
            }}
          >
            <div>
              <h1
                css={{
                  ...theme.h1,
                  fontFamily: theme.fancyFontFamily,
                  fontSize: 48,
                  margin: "0 0 12px 0",
                  [theme.mobile]: {
                    fontSize: 32,
                  },
                }}
              >
                {establishment.name}
              </h1>
              <div
                css={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: theme.darkGray,
                  fontSize: 18,
                }}
              >
                <MapPin size={20} />
                {establishment.neighborhood}
              </div>
            </div>

            {/* Happy Hour Status Badge */}
            {isHappyHour ? (
              <div
                css={{
                  backgroundColor: theme.oceanBlue,
                  color: theme.white,
                  padding: "16px 24px",
                  borderRadius: 12,
                  textAlign: "center",
                  fontWeight: 600,
                  minWidth: 200,
                }}
              >
                <div
                  css={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    opacity: 0.9,
                    marginBottom: 4,
                  }}
                >
                  It's Happy Hour!
                </div>
                <div css={{ fontSize: 18 }}>Until {formattedEndTime}</div>
              </div>
            ) : (
              <div
                css={{
                  backgroundColor: theme.lightGrout,
                  color: theme.black,
                  padding: "16px 24px",
                  borderRadius: 12,
                  textAlign: "center",
                  fontWeight: 600,
                  minWidth: 200,
                }}
              >
                <div
                  css={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    opacity: 0.7,
                    marginBottom: 4,
                  }}
                >
                  Next Happy Hour
                </div>
                <div css={{ fontSize: 16 }}>
                  {nextHappyHourDay}
                  <br />
                  {nextHappyHourTime}
                </div>
              </div>
            )}
          </div>

          {/* Hero Image */}
          {establishment.photo && (
            <SanityImage
              {...establishment.photo}
              width={900}
              height={400}
              alt={`Photo of ${establishment.name}`}
              css={{
                width: "100%",
                height: 400,
                objectFit: "cover",
                borderRadius: 20,
                marginBottom: 24,
                [theme.mobile]: {
                  height: 250,
                  borderRadius: 12,
                  marginBottom: 20,
                },
              }}
            />
          )}


          {/* Contact Icons */}
          <div
            css={{
              display: "flex",
              gap: 16,
              marginBottom: 24,
              paddingBottom: 24,
              borderBottom: `2px solid ${theme.lightGrout}`,
            }}
          >
            {establishment.happyHourMenu && (
              <IconButton
                icon={Icons.Menu}
                href={establishment.happyHourMenu}
                target="_blank"
                rel="noopener noreferrer"
                css={{
                  transform: "scale(1.3)",
                }}
              />
            )}
            {establishment.website && (
              <IconButton
                icon={Icons.Website}
                href={establishment.website}
                target="_blank"
                rel="noopener noreferrer"
                css={{
                  transform: "scale(1.3)",
                }}
              />
            )}
            {establishment.instagram && (
              <IconButton
                icon={Icons.Instagram}
                href={establishment.instagram}
                target="_blank"
                rel="noopener noreferrer"
                css={{
                  transform: "scale(1.3)",
                }}
              />
            )}
          </div>

          {/* Main Content Grid */}
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 32,
              [theme.tablet]: {
                gridTemplateColumns: "1fr",
                gap: 24,
              },
            }}
          >
            {/* Left Column - Details */}
            <div>
              {/* Happy Hour Details */}
              {establishment.happyHourDetails && (
                <div css={{ marginBottom: 24 }}>
                  <h2
                    css={{
                      ...theme.h3,
                      fontFamily: theme.fancyFontFamily,
                      fontSize: 28,
                      marginBottom: 12,
                    }}
                  >
                    Happy Hour Details
                  </h2>
                  {establishment.happyHourDetails.includes("\n") ? (
                    <ul
                      css={{
                        listStyleType: "disc",
                        listStylePosition: "outside",
                        paddingLeft: 20,
                        marginLeft: 0,
                        fontSize: 16,
                        lineHeight: 1.6,
                      }}
                    >
                      {establishment.happyHourDetails
                        .split("\n")
                        .filter(Boolean)
                        .map((line, index) => (
                          <li
                            key={index}
                            css={{
                              marginBottom: 8,
                              paddingLeft: 8,
                            }}
                          >
                            {line}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p css={{ fontSize: 16, lineHeight: 1.6 }}>
                      {establishment.happyHourDetails}
                    </p>
                  )}
                </div>
              )}

              {/* Amenities */}
              <div css={{ marginBottom: 24 }}>
                <h2
                  css={{
                    ...theme.h3,
                    fontFamily: theme.fancyFontFamily,
                    fontSize: 28,
                    marginBottom: 12,
                  }}
                >
                  What We Have Here
                </h2>
                <div
                  css={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {establishment.whatWeHaveHere.includes("cocktails") && (
                    <AmmenityPill icon={Martini}>Cocktails</AmmenityPill>
                  )}
                  {establishment.whatWeHaveHere.includes("wine") && (
                    <AmmenityPill icon={Wine}>Wine</AmmenityPill>
                  )}
                  {establishment.whatWeHaveHere.includes("beer") && (
                    <AmmenityPill icon={Beer}>Beer</AmmenityPill>
                  )}
                  {establishment.whatWeHaveHere.includes("food") && (
                    <AmmenityPill icon={UtensilsCrossed}>Food</AmmenityPill>
                  )}
                  {establishment.whatWeHaveHere.includes("naDrinks") && (
                    <AmmenityPill icon={CupSoda}>NA Drinks</AmmenityPill>
                  )}
                  {establishment.whatWeHaveHere.includes("coffee") && (
                    <AmmenityPill icon={Coffee}>Coffee</AmmenityPill>
                  )}
                  {establishment.theSpaceIsLike.includes("indoor") && (
                    <AmmenityPill icon={Store}>Indoors</AmmenityPill>
                  )}
                  {establishment.theSpaceIsLike.includes("patio") && (
                    <AmmenityPill icon={TreePalm}>Patio</AmmenityPill>
                  )}
                  {establishment.theSpaceIsLike.includes("barSeating") && (
                    <AmmenityPill icon={ConciergeBell}>Bar Seats</AmmenityPill>
                  )}
                  {establishment.theSpaceIsLike.includes("dogFriendly") && (
                    <AmmenityPill icon={PawPrint}>Dog Friendly</AmmenityPill>
                  )}
                  {establishment.theSpaceIsLike.includes("smallGroups") && (
                    <AmmenityPill icon={UserRound}>Up to 4 People</AmmenityPill>
                  )}
                  {establishment.theSpaceIsLike.includes("bigGroups") && (
                    <AmmenityPill icon={UsersRound}>4+ People OK</AmmenityPill>
                  )}
                  {establishment.theSpaceIsLike.includes("reservationsRec") && (
                    <AmmenityPill icon={CalendarCheck}>
                      Reso Reco'd
                    </AmmenityPill>
                  )}
                  {establishment.theSpaceIsLike.includes("staffPick") && (
                    <AmmenityPill
                      icon={Sparkles}
                      css={{
                        background: theme.lemonYellow,
                      }}
                    >
                      Staff Pick!
                    </AmmenityPill>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Location & Hours */}
            <div>
              <div
                css={{
                  backgroundColor: theme.lightGrout,
                  padding: 24,
                  borderRadius: 12,
                }}
              >
                <h3
                  css={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  Location & Hours
                </h3>

                <div css={{ marginBottom: 16 }}>
                  <h4
                    css={{
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      opacity: 0.7,
                      marginBottom: 8,
                    }}
                  >
                    Address
                  </h4>
                  <p css={{ fontSize: 14, textTransform: "capitalize" }}>
                    {establishment.address}
                  </p>
                </div>

                <div css={{ marginBottom: 16 }}>
                  <h4
                    css={{
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      opacity: 0.7,
                      marginBottom: 8,
                    }}
                  >
                    Open Hours
                  </h4>
                  {establishment.hours.map((line, index) => (
                    <div key={index} css={{ fontSize: 14, marginBottom: 4 }}>
                      {line}
                    </div>
                  ))}
                </div>

                {establishment.happyHourTimes && (
                  <div>
                    <h4
                      css={{
                        fontSize: 14,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        opacity: 0.7,
                        marginBottom: 8,
                      }}
                    >
                      Happy Hour Hours
                    </h4>
                    {establishment.happyHourTimes.map((line, index) => (
                      <div key={index} css={{ fontSize: 14, marginBottom: 4 }}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default EstablishmentPage

export const query = graphql`
  query EstablishmentPageQuery($id: String!) {
    establishment: sanityEstablishment(_id: { eq: $id }) {
      _id
      name
      address
      photo {
        ...ImageWithPreview
      }
      neighborhood
      website
      instagram
      hours
      happyHourTimes
      happyHourDetails
      happyHourMenu
      whatWeHaveHere
      theSpaceIsLike
      ownershipIdentifiedAs
    }
  }
`
