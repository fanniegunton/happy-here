import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import { Tooltip } from "react-tooltip"
import theme from "../styles/theme"
import IconButton from "../components/IconButton"
import { hoursCover } from "../lib/parseHours"
import SanityImage from "gatsby-plugin-sanity-image"
import {
  Clock,
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
} from "lucide-react"
import IconRow from "./IconRow"
import Icons from "../lib/icons"

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
          background: isHappyHour ? theme.lilac : theme.white,

          borderRadius: 20,
          border: "4px solid #006eff",
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
            display: "flex",
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
            [theme.mobile]: {
              display: "grid",
              margin: "0 auto",
              justifyContent: "center",
            },
          }}
        >
          {photo && (
            <SanityImage
              {...photo}
              width={300}
              height={200}
              alt={`Photo of ${name}`}
              css={{
                width: "100%",
                objectFit: "cover",
                borderRadius: "17px 17px 0 0",
              }}
            />
          )}
          <div css={{ textAlign: "left", margin: "30px 30px 10px" }}>
            <h3
              css={{
                ...theme.h3Alt,
                fontSize: 24,
                textWrap: "balance",
                minWidth: 240,
                [theme.tablet]: { marginBottom: 16 },
                [theme.mobile]: {
                  marginBottom: 10,
                },
              }}
            >
              {name}
            </h3>
            <div
              css={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                paddingBottom: 16,
              }}
            >
              <MapPin css={{ height: "1rem", width: "1rem" }} />
              {neighborhood}
            </div>
            <div
              css={{
                display: "flex",
                gap: 20,
                marginRight: 0,
                marginBottom: 10,
                textAlign: "center",
                justifyContent: "start",
              }}
            >
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
            <div css={{ marginBottom: "1rem " }}>
              {happyHourTimes && (
                <div
                  css={{
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                  }}
                >
                  Happy Hour Times:{" "}
                  {happyHourTimes.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              )}
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
              <div
                css={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                }}
              >
                {whatWeHaveHere.includes("cocktails") && (
                  <IconRow
                    icon={Martini}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    Cocktails
                  </IconRow>
                )}
                {whatWeHaveHere.includes("wine") && (
                  <IconRow
                    icon={Wine}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    {" "}
                    Wine{" "}
                  </IconRow>
                )}
                {whatWeHaveHere.includes("beer") && (
                  <IconRow
                    icon={Beer}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    {" "}
                    Beer{" "}
                  </IconRow>
                )}
                {whatWeHaveHere.includes("food") && (
                  <IconRow
                    icon={UtensilsCrossed}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    {" "}
                    Food{" "}
                  </IconRow>
                )}
                {whatWeHaveHere.includes("naDrinks") && (
                  <IconRow
                    icon={CupSoda}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    {" "}
                    Non-Alcoholic Drinks{" "}
                  </IconRow>
                )}
                {whatWeHaveHere.includes("coffee") && (
                  <IconRow
                    icon={Coffee}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    {" "}
                    Coffee{" "}
                  </IconRow>
                )}
                {/* </div>
              <div css={{ display: "flex" }}> */}
                {theSpaceIsLike.includes("indoor") && (
                  <IconRow
                    icon={Store}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    Indoors
                  </IconRow>
                )}
                {theSpaceIsLike.includes("patio") && (
                  <IconRow
                    icon={TreePalm}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    Patio
                  </IconRow>
                )}
                {theSpaceIsLike.includes("barSeating") && (
                  <IconRow
                    icon={ConciergeBell}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    Bar Seating
                  </IconRow>
                )}
                {theSpaceIsLike.includes("dogFriendly") && (
                  <IconRow
                    icon={PawPrint}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    Dog Friendly
                  </IconRow>
                )}
                {theSpaceIsLike.includes("smallGroups") && (
                  <IconRow
                    icon={UserRound}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    Small Groups Only
                  </IconRow>
                )}
                {theSpaceIsLike.includes("bigGroups") && (
                  <IconRow
                    icon={UsersRound}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    Big Groups Welcome
                  </IconRow>
                )}
                {theSpaceIsLike.includes("reservationsRec") && (
                  <IconRow
                    icon={CalendarCheck}
                    css={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "9999px",
                      borderWidth: 1,
                      borderColor: theme.oceanBlue,
                      borderStyle: "solid",
                      paddingLeft: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 4,
                    }}
                  >
                    Reservations Recommended
                  </IconRow>
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
            [theme.tablet]: {
              maxWidth: "fit-content",
            },
          }}
        >
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
            <div css={{ marginBottom: 6 }}>Open Hours:</div>
            {hours.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
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
