/** @jsxImportSource @emotion/react */
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { keyframes } from "@emotion/react"
import theme from "@styles/theme"
import { hoursCover } from "@lib/parseHours"
import SanityImage from "./SanityImage"
import IconButton from "./IconButton"
import Icons from "@lib/icons"
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
  X,
  type LucideIcon,
} from "lucide-react"
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
  {
    category: "theSpaceIsLike",
    value: "patio",
    icon: TreePalm,
    label: "Patio",
  },
  {
    category: "theSpaceIsLike",
    value: "dogFriendly",
    icon: PawPrint,
    label: "Dog Friendly",
  },
  {
    category: "whatWeHaveHere",
    value: "food",
    icon: UtensilsCrossed,
    label: "Food",
  },
  {
    category: "whatWeHaveHere",
    value: "cocktails",
    icon: Martini,
    label: "Cocktails",
  },
  { category: "whatWeHaveHere", value: "wine", icon: Wine, label: "Wine" },
  { category: "whatWeHaveHere", value: "beer", icon: Beer, label: "Beer" },
  {
    category: "whatWeHaveHere",
    value: "coffee",
    icon: Coffee,
    label: "Coffee",
  },
  {
    category: "whatWeHaveHere",
    value: "naDrinks",
    icon: CupSoda,
    label: "NA Drinks",
  },
  {
    category: "theSpaceIsLike",
    value: "barSeating",
    icon: ConciergeBell,
    label: "Bar Seats",
  },
  {
    category: "theSpaceIsLike",
    value: "reservationsRec",
    icon: CalendarCheck,
    label: "Reso Reco'd",
  },
  {
    category: "theSpaceIsLike",
    value: "indoor",
    icon: Store,
    label: "Indoors",
  },
  {
    category: "theSpaceIsLike",
    value: "smallGroups",
    icon: UserRound,
    label: "Up to 4 People",
  },
  {
    category: "theSpaceIsLike",
    value: "bigGroups",
    icon: UsersRound,
    label: "4+ People OK",
  },
]

// Amenity dots are split into two columns on the card: offerings (left)
// and the space (right). Space dots use the status strip's mauve, which
// keeps a 5.15:1 contrast with the white icon.
const PILL_GROUPS = [
  { category: "whatWeHaveHere", background: undefined, iconColor: undefined },
  {
    category: "theSpaceIsLike",
    background: theme.happyHourStrip,
    iconColor: theme.white,
  },
] as const

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

// Grows the open happening panel out of the chip's top-right corner.
const panelOpen = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`

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
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // The open panel covers the chip, so move focus into it (onto the close
  // button) when it opens. The tile body has a fixed height and clips
  // overflow, so also cap the panel to the space left below the chip's top;
  // it scrolls past that.
  useLayoutEffect(() => {
    const drawer = drawerRef.current
    if (!open || !drawer) return
    closeRef.current?.focus({ preventScroll: true })
    drawer.style.maxHeight = ""
    const body = drawer.closest("[data-tile-body]")
    if (!body) return
    const available =
      body.getBoundingClientRect().bottom -
      drawer.getBoundingClientRect().top -
      8
    drawer.style.maxHeight = `${Math.max(0, available)}px`
  }, [open])

  const close = (details: HTMLDetailsElement | null) => {
    setOpen(false)
    details?.querySelector("summary")?.focus()
  }

  const typeLabel = DEAL_TYPE_LABELS[deal.dealType]
  // The closed chip shows the deal type; the name appears in the open panel.
  const shortLabel = typeLabel || deal.dealName
  const detailLines = (deal.details || "").split("\n").filter(Boolean)

  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) close(e.currentTarget)
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
          // Fills the happenings column as a tall rounded tile, with the name
          // and end time on their own lines so long names wrap cleanly.
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          boxSizing: "border-box",
          width: "100%",
          minHeight: 72,
          borderRadius: 24,
          border: `3px dashed ${theme.lavender}`,
          background: theme.white,
          color: theme.black,
          padding: "12px 10px",
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.25,
          textAlign: "center",
          overflowWrap: "break-word",
          cursor: "pointer",
          transition: "border-width 0.15s, padding 0.15s",
          // Hover: thicken the border to 4px (padding shrinks by the same
          // 2px so the tile doesn't change size) and fill the gaps between
          // the dashes with yellow. The white layer is clipped to the padding
          // box; the yellow layer sits under the border and shows through.
          "&:hover": {
            borderWidth: 6,
            padding: "10px 8px",
            background: `linear-gradient(${theme.white}, ${theme.white}) padding-box, rgba(253, 112, 180, 1) border-box`,
            "& .happening-click-hint": {
              display: "block",
            },
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.lavender}`,
            outlineOffset: 2,
          },
        }}
      >
        <span css={{ maxWidth: "100%", fontSize: 14 }}>{shortLabel}</span>
        {endTime !== null && (
          <span css={{ fontWeight: 400, opacity: 0.7 }}>
            til {formatMilitaryTime(endTime)}
          </span>
        )}
        {/* Hidden until the chip is hovered (see "&:hover" above). */}
        {/* <span
          className="happening-click-hint"
          aria-hidden="true"
          css={{ display: "none" }}
        >
          (Click!)
        </span> */}
      </summary>
      {/* The chip "opening up": anchored to the chip's top-right corner, it
          covers the chip and grows left and down in the chip's own shape
          (same radius, dashed border and fill). It floats over the card
          content, so opening it doesn't change the tile body's height. */}
      <div
        ref={drawerRef}
        css={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 2,
          width: "max-content",
          minWidth: "100%",
          minHeight: "100%",
          maxWidth: 280,
          overflowY: "auto",
          boxSizing: "border-box",
          borderRadius: 24,
          border: `3px dashed ${theme.lavender}`,
          background: theme.white,
          // boxShadow: "var(--shadow-elevation-medium)",
          boxShadow:
            "-0.2px 0.8px 0.9px rgba(253, 112, 180, 1), -0.8px 2.5px 3px -0.8px rgba(253, 112, 180, 1), -2px 6.3px 7.4px -1.7px rgba(253, 112, 180, 1), -4.8px 15.3px 18px -2.5px rgba(253, 112, 180, 1)",
          color: theme.black,
          // Centered to match the closed chip.
          textAlign: "center",
          fontSize: 12,
          lineHeight: 1.25,
          padding: "12px 14px",
          transformOrigin: "top right",
          animation: `${panelOpen} 0.15s ease-out`,
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
        }}
      >
        {/* Header: the chip's type label, which also closes the panel. */}
        <button
          ref={closeRef}
          type="button"
          aria-label={`Close ${shortLabel}`}
          onClick={(e) => close(e.currentTarget.closest("details"))}
          css={{
            // The × is pinned to the top-right corner; equal side padding
            // keeps the label centered over the text below it.
            position: "relative",
            display: "block",
            width: "100%",
            background: "none",
            border: "none",
            padding: "0 22px",
            marginBottom: 6,
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.25,
            color: "inherit",
            textAlign: "center",
            cursor: "pointer",
            "&:focus-visible": {
              outline: `2px solid ${theme.lavender}`,
              outlineOffset: 2,
              borderRadius: 4,
            },
          }}
        >
          <span>{shortLabel}</span>
          <X
            size={16}
            aria-hidden
            css={{ position: "absolute", top: 1, right: 0 }}
          />
        </button>
        {deal.dealName && typeLabel && (
          <div css={{ marginBottom: 4, fontWeight: 600 }}>{deal.dealName}</div>
        )}
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
  doesNotHaveHappyHour = false,
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

  // Every deal line is bulleted, including a single-line happyHourDetails.
  const dealLines = (happyHourDetails || "").split("\n").filter(Boolean)
  // Venues with no happy hour only list happyHourTimes so their daily
  // specials show on the Home page. For those, the live happening chip
  // takes the wide side of the deals/happenings split.
  const happeningsLead = doesNotHaveHappyHour && happenings.length > 0
  const visibleDealLines = dealsExpanded
    ? dealLines
    : dealLines.slice(0, MAX_VISIBLE_DEALS)
  const hiddenDealCount = dealLines.length - MAX_VISIBLE_DEALS

  const isStaffPick = theSpaceIsLike.includes("staffPick")
  const hasLinks = Boolean(happyHourMenu || website || instagram)

  const visibleHighlights = HIGHLIGHT_PILL_PRIORITY.filter(
    ({ category, value }) =>
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
            Coming Up <span css={{ opacity: 0.6 }}>·</span> {nextHappyHourDay}{" "}
            at {nextHappyHourTime}
          </>
        )}
      </div>

      {/* Body: photo (left) + content (right) */}
      <div
        data-tile-body
        css={{
          display: "grid",
          gridTemplateColumns: "176px 1fr",
          alignItems: "stretch",
          // Fixed height, independent of the Details section below. The card
          // is a flex column, so `flex: "none"` keeps the card's flex sizing
          // from overriding this height (a `flex: 1` basis would). The single
          // grid row is pinned to that height so taller content is clipped
          // instead of stretching the photo.
          flex: "none",
          height: 330,
          gridTemplateRows: "minmax(0, 1fr)",
          overflow: "hidden",
          [theme.tablet]: {
            gridTemplateColumns: "150px 1fr",
          },
          [theme.mobile]: {
            gridTemplateColumns: "1fr",
            // Photo stacks above the content here, so size to content.
            height: "auto",
            gridTemplateRows: "none",
            overflow: "visible",
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
              css={{
                textDecoration: "none",
                color: "inherit",
                flex: 1,
                minWidth: 0,
              }}
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
                    // textShadow: `${theme.lavender} 2px 0 16px`,
                    textShadow: `rgba(253, 112, 180, 1) 2px 0 16px`,
                  },
                  [theme.mobile]: {
                    fontSize: 23,
                  },
                }}
              >
                {name}
              </h3>
            </a>
          </div>

          {(neighborhood || hasLinks) && (
            <div
              css={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginTop: 4,
                marginBottom: 10,
              }}
            >
              <div
                css={{
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  fontWeight: 700,
                  minWidth: 0,
                }}
              >
                {neighborhood && getNeighborhoodLabel(neighborhood)}
              </div>
              {hasLinks && (
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexShrink: 0,
                    // Scale the shared 28px IconButton icons down to the
                    // neighborhood line's 20px height.
                    "& img": {
                      width: 20,
                      height: 20,
                      flex: "0 0 20px",
                      marginRight: 0,
                    },
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
              )}
            </div>
          )}

          {/* Deals (left, 70%) + live happenings (right, 30%); flipped to
              30/70 for no-happy-hour venues so the chip gets the room.
              Single column when no happening is live. */}
          <div
            css={{
              display: "grid",
              gridTemplateColumns: happeningsLead
                ? "minmax(0, 3fr) minmax(0, 7fr)"
                : happenings.length > 0
                  ? "minmax(0, 7fr) minmax(0, 3fr)"
                  : "minmax(0, 1fr)",
              columnGap: 12,
              alignItems: "start",
            }}
          >
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
                  {dealLines.length > 0 ? (
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

            {happenings.length > 0 && (
              <div
                css={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 8,
                  marginBottom: 10,
                  minWidth: 0,
                  // padding: "10px 6px",
                }}
              >
                {happenings.map((happening) => (
                  <HappeningChip key={happening.deal._key} {...happening} />
                ))}
              </div>
            )}
          </div>

          {visibleHighlights.length > 0 && (
            <div
              css={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                columnGap: 12,
                alignItems: "start",
                // Anchor the dots to the bottom of the content column.
                marginTop: "auto",
                // marginBottom: 10,
              }}
            >
              {PILL_GROUPS.map(({ category, background, iconColor }) => (
                <div
                  key={category}
                  css={{
                    minWidth: 0,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {visibleHighlights
                    .filter((pill) => pill.category === category)
                    .map(({ value, icon, label }) => (
                      <AmmenityPill
                        key={value}
                        icon={icon}
                        background={background}
                        iconColor={iconColor}
                        iconOnly
                        // css={{
                        //   margin: 8,
                        //   "& 1st-child": {
                        //     marginLeft: 0,
                        //   },
                        // }}
                      >
                        {label}
                      </AmmenityPill>
                    ))}
                </div>
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
