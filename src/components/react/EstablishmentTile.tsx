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
  CalendarClock,
  type LucideIcon,
} from "lucide-react"
import Icons from "@lib/icons"
import AmmenityPill from "./AmmenityPill"
import { getTodayEndTime } from "@lib/getTodayTime"
import { getNextStartTime } from "@lib/getNextStartTime"
import { formatMilitaryTime } from "@lib/formatMilitaryTime"
import { generateSlug } from "@lib/slug"
import { DEAL_TYPE_LABELS } from "@lib/dealTypes"
import {
  getConcurrentHappenings,
  type ConcurrentHappening,
} from "@lib/getConcurrentHappenings"
import type { SanityEstablishment, OtherDealType } from "@/types/sanity"

const MAX_VISIBLE_DEALS = 4

// Priority order for the above-the-fold amenity pills. Edit this array to
// change the order amenities appear in on the card.
const HIGHLIGHT_PILL_PRIORITY: Array<{
  category: "whatWeHaveHere" | "theSpaceIsLike"
  value: string
  icon: LucideIcon
  label: string
}> = [
  { category: "theSpaceIsLike", value: "patio", icon: TreePalm, label: "Patio" },
  { category: "theSpaceIsLike", value: "dogFriendly", icon: PawPrint, label: "Dog Friendly" },
  { category: "whatWeHaveHere", value: "food", icon: UtensilsCrossed, label: "Food" },
  { category: "whatWeHaveHere", value: "cocktails", icon: Martini, label: "Cocktails" },
  { category: "whatWeHaveHere", value: "wine", icon: Wine, label: "Wine" },
  { category: "whatWeHaveHere", value: "beer", icon: Beer, label: "Beer" },
  { category: "whatWeHaveHere", value: "coffee", icon: Coffee, label: "Coffee" },
  { category: "whatWeHaveHere", value: "naDrinks", icon: CupSoda, label: "NA Drinks" },
  { category: "theSpaceIsLike", value: "barSeating", icon: ConciergeBell, label: "Bar Seats" },
  { category: "theSpaceIsLike", value: "reservationsRec", icon: CalendarCheck, label: "Reso Reco'd" },
  { category: "theSpaceIsLike", value: "indoor", icon: Store, label: "Indoors" },
  { category: "theSpaceIsLike", value: "smallGroups", icon: UserRound, label: "Up to 4 People" },
  { category: "theSpaceIsLike", value: "bigGroups", icon: UsersRound, label: "4+ People OK" },
]

function toTitleCase(s: string): string {
  return s
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function getNeighborhoodLabel(
  neighborhood: SanityEstablishment["neighborhood"] | undefined
): string {
  if (!neighborhood) return ""
  const subKey = Object.keys(neighborhood).find((k) =>
    k.startsWith("subNeighborhood")
  )
  if (subKey && neighborhood[subKey]) return toTitleCase(neighborhood[subKey])
  return neighborhood.region ? toTitleCase(neighborhood.region) : ""
}

const sameHappenings = (a: ConcurrentHappening[], b: ConcurrentHappening[]) =>
  a.length === b.length &&
  a.every(
    (h, i) => h.deal._key === b[i].deal._key && h.endTime === b[i].endTime
  )

// A live "happening" (one of the venue's otherDeals) running alongside the
// happy hour. Uses the same controlled <details>/<summary> disclosure as the
// "Full Address, Hours, & Contact Info" row below, with the summary styled
// as a dashed lavender pill so it reads as time-sensitive rather than a
// static amenity tag.
function HappeningChip({ deal, endTime }: ConcurrentHappening) {
  const [open, setOpen] = useState(false)

  const typeLabel = DEAL_TYPE_LABELS[deal.dealType]
  const shortLabel = deal.dealName || typeLabel
  const fullName = deal.dealName ? `${typeLabel}: ${deal.dealName}` : typeLabel
  const detailLines = (deal.details || "").split("\n").filter(Boolean)

  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false)
          e.currentTarget.querySelector("summary")?.focus()
        }
      }}
      css={{ position: "relative" }}
    >
      <summary
        aria-expanded={open}
        css={{
          listStyle: "none",
          "&::-webkit-details-marker": {
            display: "none",
          },
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: "9999px",
          border: `1px dashed ${theme.lavender}`,
          background: theme.white,
          color: theme.black,
          padding: "2px 10px",
          fontSize: 12,
          fontWeight: 600,
          textTransform: "lowercase",
          cursor: "pointer",
          "&:focus-visible": {
            outline: `2px solid ${theme.lavender}`,
            outlineOffset: 2,
          },
        }}
      >
        <CalendarClock size={14} css={{ color: theme.lavender, flexShrink: 0 }} />
        <span>
          {shortLabel}
          {endTime !== null && (
            <>
              {" "}
              <span css={{ opacity: 0.6 }}>·</span> til{" "}
              {formatMilitaryTime(endTime)}
            </>
          )}
        </span>
      </summary>
      {/* Floats over the tag rows so opening it doesn't change the tile body's
          height (which would stretch the photo). On mobile the photo sits on
          top instead of beside the text, so the drawer stays inline there. */}
      <div
        css={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 2,
          width: "max-content",
          maxWidth: 280,
          maxHeight: 200,
          overflowY: "auto",
          background: theme.white,
          boxShadow: "var(--shadow-elevation-medium)",
          textAlign: "left",
          fontSize: 12,
          padding: "8px 12px",
          borderLeft: `2px dashed ${theme.lavender}`,
          [theme.mobile]: {
            position: "static",
            width: "auto",
            maxWidth: "none",
            maxHeight: "none",
            boxShadow: "none",
            marginTop: 8,
          },
        }}
      >
        <div css={{ marginBottom: 4, fontWeight: 600 }}>{fullName}</div>
        {deal.times.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        {detailLines.length > 0 && (
          <div css={{ marginTop: 6 }}>
            {detailLines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </details>
  )
}

interface EstablishmentTileProps extends SanityEstablishment {
  dealType?: OtherDealType
  dealName?: string
  // Opt-in: show live "happening" chips. Only the Home page enables this.
  showHappenings?: boolean
}

export default function EstablishmentTile({
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
  otherDeals,
  dealType,
  dealName,
  showHappenings = false,
}: EstablishmentTileProps) {
  const [isHappyHour, setHappyHour] = useState(false)
  const [happenings, setHappenings] = useState<ConcurrentHappening[]>([])
  const [dealsExpanded, setDealsExpanded] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const dealLines = happyHourDetails?.includes("\n")
    ? happyHourDetails.split("\n").filter(Boolean)
    : []
  const visibleDealLines = dealsExpanded
    ? dealLines
    : dealLines.slice(0, MAX_VISIBLE_DEALS)
  const hiddenDealCount = dealLines.length - MAX_VISIBLE_DEALS

  const isStaffPick = theSpaceIsLike.includes("staffPick")

  const visibleHighlights = HIGHLIGHT_PILL_PRIORITY.filter(({ category, value }) =>
    category === "whatWeHaveHere"
      ? whatWeHaveHere.includes(value as never)
      : theSpaceIsLike.includes(value as never)
  )

  // Create URL-friendly slug from establishment name
  const slug = generateSlug(name)

  useEffect(() => {
    const checkHours = () => {
      const now = new Date()
      setHappyHour(hoursCover(happyHourTimes, now))
      if (showHappenings) {
        const next = getConcurrentHappenings(otherDeals, happyHourTimes, now)
        setHappenings((prev) => (sameHappenings(prev, next) ? prev : next))
      }
    }

    // Check hours right away
    checkHours()

    // Check hours every 30 seconds
    const timer = window.setInterval(checkHours, 30_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [happyHourTimes, otherDeals, showHappenings])

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
        borderRadius: 16,
        overflow: "hidden",
        // border: isHappyHour ? "4px solid #A78BB5" : "4px solid #8B5E2A",
        maxWidth: 580,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        [theme.tablet]: {
          maxWidth: 500,
        },
        [theme.mobile]: {
          maxWidth: 380,
          margin: "0 auto",
        },
      }}
    >
      {/* Status strip */}
      <div
        css={{
          width: "100%",
          backgroundColor: isHappyHour
            ? theme.happyHourStrip
            : theme.comingUpStrip,
          color: theme.white,
          padding: "10px 20px",
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: 8,
          [theme.mobile]: {
            padding: "10px 20px",
          },
        }}
      >
        {isHappyHour ? (
          <>
            It's Happy Hour Until <span css={{ opacity: 0.6 }}>→</span>{" "}
            {formattedEndTime}
          </>
        ) : (
          <>
            Coming Up <span css={{ opacity: 0.6 }}>·</span>{" "}
            {nextHappyHourDay} at {nextHappyHourTime}
          </>
        )}
      </div>

      {/* Body: photo (left) + content (right) */}
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "176px 1fr",
          alignItems: "stretch",
          flex: 1,
          // The body holds the tile's minimum height (instead of the card) so
          // opening the address/hours disclosure below grows the card rather
          // than shrinking the photo. Equals the previous 420px card minimum
          // minus the status strip (36.5px) and closed footer (53.5px desktop,
          // 65.5px tablet).
          minHeight: 330,
          [theme.tablet]: {
            gridTemplateColumns: "150px 1fr",
            minHeight: 318,
          },
          [theme.mobile]: {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        {/* Photo well */}
        <div
          css={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: 230,
            overflow: "hidden",
            [theme.mobile]: {
              aspectRatio: "4 / 3",
              height: "auto",
              minHeight: 0,
              width: "100%",
            },
          }}
        >
          {isStaffPick && (
            <div
              css={{
                position: "absolute",
                top: 12,
                left: 12,
                zIndex: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                borderRadius: "9999px",
                background: theme.lemonYellow,
                color: theme.black,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <Sparkles size={14} />
              Staff Pick
            </div>
          )}
          <a
            href={`/establishment/${slug}`}
            css={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              cursor: "pointer",
              width: "100%",
              height: "100%",
            }}
          >
            {photo ? (
              <SanityImage
                image={photo}
                width={300}
                height={200}
                alt={`Photo of ${name}`}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
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
                  height: "100%",
                  objectFit: "cover",
                  // filter: "grayscale(60%)",
                  transition: "opacity 0.2s",
                }}
              />
            )}
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
        </div>

        {/* Content column */}
        <div
          css={{
            padding: "16px 20px 18px",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            textAlign: "left",
          }}
        >
          <div
            css={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <a
              href={`/establishment/${slug}`}
              css={{ textDecoration: "none", color: "inherit", flex: 1, minWidth: 0 }}
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
                    textShadow: `${theme.lavender} 1px 0 10px`,
                  },
                  [theme.mobile]: {
                    fontSize: 23,
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

          {neighborhood && (
            <div
              css={{
                fontSize: "1rem",
                lineHeight: "1.25rem",
                fontWeight: 700,
                marginTop: 4,
                marginBottom: 10,
              }}
            >
              {getNeighborhoodLabel(neighborhood)}
            </div>
          )}

          {happenings.length > 0 && (
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 10,
              }}
            >
              {happenings.map((happening) => (
                <HappeningChip key={happening.deal._key} {...happening} />
              ))}
            </div>
          )}

          <div css={{ marginBottom: "1rem" }}>
            <div>
              {dealType && (
                <div
                  css={{
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    opacity: 0.7,
                    marginTop: 4,
                  }}
                >
                  {dealName
                    ? `${DEAL_TYPE_LABELS[dealType]}: ${dealName}`
                    : DEAL_TYPE_LABELS[dealType]}
                </div>
              )}
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
                {happyHourDetails?.includes("\n") ? (
                  <>
                    <ul
                      css={{
                        paddingInlineStart: 20,
                        maxWidth: "max-content",
                      }}
                    >
                      {visibleDealLines.map((line, index) => (
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
                    {!dealsExpanded && hiddenDealCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setDealsExpanded(true)}
                        css={{
                          display: "block",
                          background: "none",
                          border: "none",
                          padding: 0,
                          marginTop: -8,
                          marginBottom: 16,
                          fontSize: 13,
                          fontFamily: "inherit",
                          color: "inherit",
                          opacity: 0.7,
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        +{hiddenDealCount} more
                      </button>
                    )}
                  </>
                ) : (
                  <div css={{ fontSize: 14, marginBottom: 16 }}>
                    {happyHourDetails}
                  </div>
                )}
              </div>
            </div>
          </div>

          {visibleHighlights.length > 0 && (
            <div
              css={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {visibleHighlights.map(({ value, icon, label }) => (
                <AmmenityPill key={value} icon={icon}>
                  {label}
                </AmmenityPill>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details: full-width, spans both columns */}
      <div
        css={{
          color: theme.black,
          paddingBottom: 8,
          [theme.tablet]: {
            padding: "12px 0 8px",
          },
          [theme.mobile]: {
            padding: "8px 0",
          },
        }}
      >
        <details
            open={detailsOpen}
            onToggle={(e) => setDetailsOpen(e.currentTarget.open)}
          >
            <summary
              css={{
                cursor: "pointer",
                fontSize: 12,
                textAlign: "left",
                margin: "0 30px 12px",
                paddingTop: "16px",
                borderTop: `1px solid ${theme.lightGrout}`,
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
                textAlign: "left",
                textTransform: "capitalize",
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
            </div>
          </details>
      </div>
    </div>
  )
}
