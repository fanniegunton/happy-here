/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react"
import theme from "@styles/theme"
import IconButton from "./IconButton"
import { hoursCover } from "@lib/parseHours"
import SanityImage from "./SanityImage"
import {
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
import Icons from "@lib/icons"
import AmmenityPill from "./AmmenityPill"
import { getTodayEndTime } from "@lib/getTodayTime"
import { getNextStartTime } from "@lib/getNextStartTime"
import { formatMilitaryTime } from "@lib/formatMilitaryTime"
import { generateSlug } from "@lib/slug"
import { DEAL_TYPE_LABELS } from "@lib/dealTypes"
import type { SanityEstablishment, OtherDealType } from "@/types/sanity"
import { getNeighborhoodLabel } from "@lib/neighborhoods"

interface HappeningsTileProps extends SanityEstablishment {
  dealType?: OtherDealType
  dealName?: string
}

export default function HappeningsTile({
  _id,
  name,
  address,
  neighborhood,
  photo,
  website,
  instagram,
  hours = [],
  happyHourTimes = [],
  happyHourDetails,
  happyHourMenu,
  whatWeHaveHere = [],
  theSpaceIsLike = [],
  dealType,
  dealName,
}: HappeningsTileProps) {
  const [isHappyHour, setHappyHour] = useState(false)

  const detailLines = (happyHourDetails || "").split("\n").filter(Boolean)

  // Create URL-friendly slug from establishment name
  const slug = generateSlug(name)

  useEffect(() => {
    const checkHours = () => {
      setHappyHour(hoursCover(happyHourTimes, new Date()))
    }

    // Check hours right away
    checkHours()

    // Check hours every 30 seconds
    const timer = window.setInterval(checkHours, 30_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [happyHourTimes])

  const dealTypeLabel = dealType ? DEAL_TYPE_LABELS[dealType] : "Happy Hour"

  const todayEndTime = getTodayEndTime(happyHourTimes)
  const formattedEndTime =
    todayEndTime !== null ? formatMilitaryTime(todayEndTime) : "Closed"

  // Declare variables for next happy hour
  let nextHappyHourDay = ""
  let nextHappyHourTime = ""

  const nextStartDate = getNextStartTime(happyHourTimes)
  if (nextStartDate) {
    // Format the time portion
    const militaryTime =
      nextStartDate.getHours() * 100 + nextStartDate.getMinutes()
    const formattedTime = formatMilitaryTime(militaryTime)

    // If the next start date is today, use "Today", otherwise use the weekday name
    const now = new Date()
    const dayLabel =
      nextStartDate.toDateString() === now.toDateString()
        ? "Today"
        : nextStartDate.toLocaleDateString("en-US", { weekday: "long" })

    nextHappyHourDay = dayLabel
    nextHappyHourTime = formattedTime
  }

  return (
    <div
      key={_id}
      css={{
        background: theme.white,
        borderRadius: 20,
        // border: isHappyHour ? "4px solid #A78BB5" : "4px solid #8B5E2A",
        maxWidth: 525,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        [theme.tablet]: {
          maxWidth: 450,
        },
        [theme.mobile]: {
          maxWidth: 380,
          margin: "0 auto",
        },
      }}
    >
      <div
        css={{
          margin: "0 auto",
          alignItems: "start",
          flexDirection: "column",
          justifyContent: "flex-start",
          textAlign: "center",
          width: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          flex: 1,
          display: "flex",
        }}
      >
        {/* Image container with badge positioned relative to it */}
        <div
          css={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <a
            href={`/establishment/${slug}`}
            css={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              cursor: "pointer",
            }}
          >
            {/* {photo ? (
              <SanityImage
                image={photo}
                width={300}
                height={200}
                alt={`Photo of ${name}`}
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "3 / 2",
                  objectFit: "cover",
                  // filter: "grayscale(60%)",
                  transition: "opacity 0.2s",
                }}
              />
            ) : (
              <img
                src="/default-establishment.jpg"
                alt={`Photo of ${name}`}
                width={300}
                height={200}
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "3 / 2",
                  objectFit: "cover",
                  // filter: "grayscale(60%)",
                  transition: "opacity 0.2s",
                }}
              />
            )} */}
          </a>

          {/* Duotone color overlay */}
          {/* <div
            css={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: isHappyHour ? "#A78BB5" : "#FFA87A",
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          />
        </div> */}

          {/* Status strip */}
          <div
            css={{
              width: "100%",
              backgroundColor: isHappyHour ? "#A78BB5" : "#b97c5c",
              color: theme.white,
              padding: "10px 20px",
              fontSize: 12,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              justifyItems: "start",
              textAlign: "left",
              gap: 8,
              [theme.mobile]: {
                padding: "10px 20px",
              },
            }}
          >
            {/* The strip is a flex row, so each text run is its own flex
                item. The times never shrink or wrap, so a long deal type
                wraps the label instead of splitting "10PM" into "10P / M". */}
            {isHappyHour ? (
              <>
                {dealTypeLabel} • Happening Now Until{" "}
                <span css={{ opacity: 0.6 }}>→</span>{" "}
                <span css={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                  {formattedEndTime}
                </span>
              </>
            ) : (
              <>
                {nextHappyHourDay} <span css={{ opacity: 0.6 }}>·</span>{" "}
                {dealTypeLabel}{" "}
                <span css={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                  at {nextHappyHourTime}
                </span>
              </>
            )}
          </div>

          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "16px 30px",
              [theme.tablet]: { padding: "14px 24px" },
              [theme.mobile]: { padding: "12px 20px 8px" },
            }}
          >
            <a
              href={`/establishment/${slug}`}
              css={{ textDecoration: "none", color: "inherit", flex: 1 }}
            >
              <h3
                css={{
                  ...theme.h3Alt,
                  fontFamily: theme.fancyFontFamily,
                  fontSize: 26,
                  textWrap: "balance",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    textShadow: "#A78BB5 1px 0 10px",
                  },
                }}
              >
                {name}
              </h3>
            </a>
            <div
              css={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 4,
                flexShrink: 0,
                "& > a:last-child img": {
                  marginRight: 0,
                },
                // "&:hover": {
                //   textShadow: "#A78BB5 1px 0 10px",
                // },
              }}
            >
              {happyHourMenu && (
                <IconButton
                  icon={Icons.Menu}
                  href={happyHourMenu}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              )}
              {website && (
                <IconButton
                  icon={Icons.Website}
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              )}
              {instagram && (
                <IconButton
                  icon={Icons.Instagram}
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              )}
            </div>
          </div>
          <div
            css={{
              textAlign: "left",
              margin: "0px 30px 10px",
              [theme.tablet]: {
                margin: "24px 24px 10px",
              },
              [theme.mobile]: {
                margin: "0 20px",
              },
            }}
          >
            {/* <div
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
              {neighborhood && (
                <div
                  css={{
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "1rem",
                    lineHeight: "1.25rem",
                    fontWeight: 700,
                  }}
                >
                  {getNeighborhoodLabel(neighborhood)}
                </div>
              )}
            </div>
          </div> */}

            <div css={{ marginBottom: "1rem" }}>
              <div>
                <div
                  css={{
                    marginTop: 4,
                    marginBottom: 16,
                    fontSize: 16,
                    lineHeight: "1.25rem",
                    [theme.mobile]: {
                      marginBottom: 8,
                    },
                  }}
                >
                  {/* Every detail line is bulleted, including a single line. */}
                  {detailLines.length > 0 ? (
                    <ul
                      css={{
                        paddingInlineStart: 20,
                        maxWidth: "max-content",
                      }}
                    >
                      {detailLines.map((line, index) => (
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
              </div>
            </div>
          </div>
        </div>
        <div
          css={{
            borderRadius: "0 0 16px 16px",
            paddingBottom: 8,
            color: theme.black,
            [theme.tablet]: {
              padding: "12px 0 8px",
            },
            [theme.mobile]: {
              padding: "8px 0",
            },
          }}
        >
          <details>
            <summary
              css={{
                cursor: "pointer",
                fontSize: 12,
                textAlign: "left",
                margin: "0 30px 12px",
                paddingTop: "16px",
                borderTop: "1px solid #e4e3e4",
                [theme.tablet]: {
                  margin: "0 24px 12px",
                },
                [theme.mobile]: {
                  margin: "0 20px 12px",
                },
              }}
            >
              Full Address, Hours, & Contact Info
            </summary>
            <div
              css={{
                textTransform: "capitalize",
                textAlign: "left",
                fontSize: 12,
                margin: "0 30px 20px",
                maxWidth: 300,
                [theme.tablet]: {
                  margin: "0 24px 20px",
                },
                [theme.mobile]: {
                  margin: "0 20px 16px",
                },
              }}
            >
              <div css={{ marginBottom: 6 }}>{address}</div>
              <div css={{ marginBottom: 4, fontWeight: 600 }}>Open Hours:</div>
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
              <div
                css={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: 16,
                  marginBottom: 4,
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
                  <AmmenityPill icon={CalendarCheck}>Reso Reco'd</AmmenityPill>
                )}
                {theSpaceIsLike.includes("staffPick") && (
                  <AmmenityPill
                    icon={Sparkles}
                    css={{ background: theme.lemonYellow }}
                  >
                    Staff Pick!
                  </AmmenityPill>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
