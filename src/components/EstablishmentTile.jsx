import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import theme from "../styles/theme"
import IconButton from "../components/IconButton"
import { hoursCover } from "../lib/parseHours"
import SanityImage from "gatsby-plugin-sanity-image"
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
} from "lucide-react"
import Icons from "../lib/icons"
import AmmenityPill from "./AmmenityPill"
import { getTodayEndTime } from "../lib/getTodayTime"
import { getNextStartTime } from "../lib/getNextStartTime"
import { formatMilitaryTime } from "../lib/formatMilitaryTime"

const EstablishmentTile = ({
  _id,
  name,
  address,
  neighborhood,
  photo,
  website,
  instagram,
  hours,
  happyHourTimes,
  happyHourDetails,
  happyHourMenu,
  whatWeHaveHere,
  theSpaceIsLike,
  ownershipIdentifiedAs,
}) => {
  const [isHappyHour, setHappyHour] = useState(false)

  useEffect(() => {
    const checkHours = () => {
      setHappyHour(hoursCover(happyHourTimes, new Date()))
    }

    // Check hours right away
    checkHours()

    // Check hours every second
    const timer = window.setInterval(checkHours, 30_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [happyHourTimes])

  const todayEndTime = getTodayEndTime(happyHourTimes)
  const formattedEndTime =
    todayEndTime !== null ? formatMilitaryTime(todayEndTime) : "Closed"

  // Declare variables in a scope accessible to the entire component.
  let nextHappyHourDay = ""
  let nextHappyHourTime = ""

  const nextStartDate = getNextStartTime(happyHourTimes)
  if (nextStartDate) {
    // Format the time portion using your formatting helper.
    const militaryTime =
      nextStartDate.getHours() * 100 + nextStartDate.getMinutes()
    const formattedTime = formatMilitaryTime(militaryTime)

    // If the next start date is today, use "Today", otherwise use the weekday name.
    const now = new Date()
    const dayLabel =
      nextStartDate.toDateString() === now.toDateString()
        ? "Today"
        : nextStartDate.toLocaleDateString("en-US", { weekday: "long" })

    // Assign to the outer variables
    nextHappyHourDay = dayLabel
    nextHappyHourTime = formattedTime

    return (
      <div
        key={_id}
        css={{
          padding: 30,
          [theme.tablet]: {
            padding: 20,
          },
        }}
      >
        <div
          css={{
            position: "relative",
            background: theme.white,
            borderRadius: 20,
            border: isHappyHour ? "4px solid #006eff" : "4px solid #e4e3e4",
            maxWidth: 525,
            // ...theme.extraFloatBox,
            [theme.mobile]: {
              maxWidth: 350,
              minWidth: "85vw",
            },
          }}
        >
          <div
            css={{
              margin: "0 auto",
              alignItems: "start",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              minWidth: 300,
              maxWidth: 375,
              width: "100%",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {photo && (
              <SanityImage
                {...photo}
                width={300}
                height={200}
                alt={`Photo of ${name}`}
                css={{
                  display: "block",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "17px 17px 0 0",
                }}
              />
            )}
            <div>
              <div
                css={{
                  float: "right",
                  marginLeft: 16,
                  position: "relative",
                  right: 0,
                }}
              >
                {isHappyHour ? (
                  <div
                    css={{
                      maxWidth: 180,
                      alignItems: "center",
                      borderRadius: "10px 0 0 10px",
                      backgroundColor: theme.oceanBlue,
                      color: theme.white,
                      padding: "16px 10px",
                      textAlign: "center",
                      fontWeight: 600,
                      [theme.mobile]: {
                        marginTop: "-12px",
                        borderRadius: "0 0 0 10px",
                      },
                    }}
                  >
                    <div
                      css={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.01em",
                        opacity: 0.8,
                      }}
                    >
                      It’s Happy Hour
                    </div>
                    until {""}
                    {formattedEndTime}
                  </div>
                ) : (
                  <div
                    css={{
                      maxWidth: 180,
                      alignItems: "center",
                      borderRadius: "10px 0 0 10px",
                      backgroundColor: theme.lightGrout,
                      color: theme.black,
                      padding: 16,
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: 600,
                      [theme.mobile]: {
                        marginTop: "-12px",
                        borderRadius: "0 0 0 10px",
                      },
                    }}
                  >
                    <div
                      css={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.01em",
                        opacity: 0.8,
                      }}
                    >
                      Next HH starts{" "}
                    </div>
                    {nextHappyHourDay} <br /> {nextHappyHourTime}
                  </div>
                )}
              </div>

              <h3
                css={{
                  ...theme.h3Alt,
                  fontFamily: theme.fancyFontFamily,
                  fontSize: 24,
                  textWrap: "balance",
                  textAlign: "left",
                  margin: "16px 30px",
                  [theme.mobile]: {
                    margin: "12px 30px 8px",
                  },
                }}
              >
                {name}
              </h3>
            </div>
            <div
              css={{
                textAlign: "left",
                margin: "30px 30px 10px",
                [theme.mobile]: {
                  margin: "20px 30px 10px",
                },
              }}
            >
              <div
                css={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  css={{
                    display: "grid",
                    marginRight: 0,
                    marginBottom: 10,
                    justifyContent: "start",
                  }}
                >
                  <div
                    css={{
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.875rem",
                      lineHeight: "1.25rem",
                    }}
                  >
                    <MapPin
                      css={{
                        height: "1rem",
                        width: "1rem",
                        marginRight: 4,
                      }}
                    />
                    {neighborhood}
                  </div>
                </div>
              </div>

              <div css={{ marginBottom: "1rem " }}>
                <details>
                  <summary
                    css={{
                      cursor: "pointer",
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    Happy Hour Details
                  </summary>
                  <div
                    css={{
                      marginTop: 4,
                      marginBottom: 16,
                      fontSize: 16,
                      lineHeight: "1.25rem",
                    }}
                  >
                    {happyHourDetails?.includes("\n") ? (
                      <ul
                        css={{
                          paddingInlineStart: 20,
                          maxWidth: "max-content",
                        }}
                      >
                        {happyHourDetails
                          .split("\n")
                          .filter(Boolean)
                          .map((line, index) => (
                            <li
                              key={index}
                              css={{
                                fontSize: 14,
                                listStyleType: "disc",
                                textAlign: "left",
                                "&:last-child": {
                                  marginBottom: 16,
                                },
                              }}
                            >
                              {line}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <div css={{ fontSize: 14, marginBottom: 16 }}>
                        {happyHourDetails}
                      </div>
                    )}
                  </div>
                </details>
                <div
                  css={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: 16,
                  }}
                >
                  {whatWeHaveHere.includes("cocktails") && (
                    <AmmenityPill icon={Martini}>Cocktails</AmmenityPill>
                  )}
                  {whatWeHaveHere.includes("wine") && (
                    <AmmenityPill icon={Wine}>Wine</AmmenityPill>
                  )}
                  {whatWeHaveHere.includes("beer") && (
                    <AmmenityPill icon={Beer}>Beer</AmmenityPill>
                  )}
                  {whatWeHaveHere.includes("food") && (
                    <AmmenityPill icon={UtensilsCrossed}>Food</AmmenityPill>
                  )}
                  {whatWeHaveHere.includes("naDrinks") && (
                    <AmmenityPill icon={CupSoda}>NA Drinks</AmmenityPill>
                  )}
                  {whatWeHaveHere.includes("coffee") && (
                    <AmmenityPill icon={Coffee}>Coffee</AmmenityPill>
                  )}
                  {/* </div>
              <div css={{ display: "flex" }}> */}
                  {theSpaceIsLike.includes("indoor") && (
                    <AmmenityPill icon={Store}>Indoors</AmmenityPill>
                  )}
                  {theSpaceIsLike.includes("patio") && (
                    <AmmenityPill icon={TreePalm}>Patio</AmmenityPill>
                  )}
                  {theSpaceIsLike.includes("barSeating") && (
                    <AmmenityPill icon={ConciergeBell}>Bar Seats</AmmenityPill>
                  )}
                  {theSpaceIsLike.includes("dogFriendly") && (
                    <AmmenityPill icon={PawPrint}>Dog Friendly</AmmenityPill>
                  )}
                  {theSpaceIsLike.includes("smallGroups") && (
                    <AmmenityPill icon={UserRound}>Up to 4 People</AmmenityPill>
                  )}
                  {theSpaceIsLike.includes("bigGroups") && (
                    <AmmenityPill icon={UsersRound}>4+ People OK</AmmenityPill>
                  )}
                  {theSpaceIsLike.includes("reservationsRec") && (
                    <AmmenityPill icon={CalendarCheck}>
                      Reso Reco’d
                    </AmmenityPill>
                  )}
                  {theSpaceIsLike.includes("staffPick") && (
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
          </div>
          <div
            css={{
              borderRadius: "0 0 17px 17px",
              padding: "16px 0 6px",
              backgroundColor: theme.lightGrout,
            }}
          >
            <details>
              <summary
                css={{ cursor: "pointer", fontSize: 12, margin: "0 30px 12px" }}
              >
                Full Address, Hours, & Contact Info
              </summary>
              <div
                css={{
                  textTransform: "capitalize",
                  fontSize: 12,
                  margin: "0 30px 20px",
                  maxWidth: 300,
                  [theme.mobile]: {
                    marginBottom: 16,
                  },
                }}
              >
                <div css={{ marginBottom: 6 }}>{address}</div>
                <div css={{ marginBottom: 4, fontWeight: 600 }}>
                  Open Hours:
                </div>
                {hours.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
                <div css={{ marginTop: 6, marginBottom: 4, fontWeight: 600 }}>
                  Happy Hour Hours:{" "}
                </div>
                {happyHourTimes && (
                  <div>
                    {happyHourTimes.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                )}
                <div css={{ marginTop: 8 }}>
                  {happyHourMenu && (
                    <IconButton
                      icon={Icons.Menu}
                      href={happyHourMenu}
                      target="_blank"
                      rel="noopener noreferrer"
                      css={{
                        width: "auto",
                        transform: "scale(1.5)",
                        justifyContent: "center",
                      }}
                    />
                  )}
                  {website && (
                    <IconButton
                      icon={Icons.Website}
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      css={{
                        width: "auto",
                        transform: "scale(1.5)",
                        justifyContent: "center",
                      }}
                    />
                  )}
                  {instagram && (
                    <IconButton
                      icon={Icons.Instagram}
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      css={{
                        width: "auto",
                        transform: "scale(1.5)",
                        justifyContent: "center",
                      }}
                    />
                  )}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    )
  }
}

export default EstablishmentTile

export const query = graphql`
  fragment EstablishmentTile on SanityEstablishment {
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
`
