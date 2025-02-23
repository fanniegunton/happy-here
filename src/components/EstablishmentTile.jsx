import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import theme from "../styles/theme"
import IconButton from "../components/IconButton"
import Icons from "../lib/icons"
import { hoursCover } from "../lib/parseHours"

const EstablishmentTile = ({
  _id,
  name,
  address,
  neighborhood,
  website,
  instagram,
  hours,
  happyHourTimes,
  happyHourDetails,
  happyHourMenu,
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
        padding: "30px 0",
        [theme.tablet]: {
          padding: 20,
        },
      }}
    >
      <div
        css={{
          position: "relative",
          padding: 30,
          background: isHappyHour ? theme.lilac : theme.babyPink,
          borderRadius: 20,
          border: isHappyHour
            ? "16px double rgb(232, 221, 66)"
            : "16px double #CC6F97",
          maxWidth: 525,
          ...theme.extraFloatBox,
          [theme.mobile]: {
            maxWidth: 350,
            minWidth: "85vw",
            padding: "20px 20px 30px",
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
            maxWidth: 300,
            [theme.mobile]: {
              display: "grid",
              margin: "0 auto",
              justifyContent: "center",
              maxWidth: 200,
            },
          }}
        >
          <h3
            css={{
              ...theme.h3Alt,
              fontSize: 40,
              textWrap: "balance",
              marginBottom: 20,
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
              borderTop: "4px double #4F67B1",
              minWidth: 300,
            }}
          >
            <div css={{ paddingTop: 10, paddingBottom: 10 }}>
              <span
                css={{
                  fontFamily: theme.fancyFontFamily,
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                Happy Hour Deets:{" "}
              </span>
            </div>
            {happyHourTimes && (
              <div
                css={{
                  marginBottom: 20,
                  fontSize: 16,
                }}
              >
                {happyHourTimes.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            )}
            {happyHourDetails?.includes("\n") ? (
              <ul
                css={{
                  paddingInlineStart: 0,
                  maxWidth: 180,
                  margin: "0 auto",
                }}
              >
                {happyHourDetails
                  .split("\n")
                  .filter(Boolean)
                  .map((line, index) => (
                    <li
                      key={index}
                      css={{
                        ...theme.bolded,
                        listStyleType: "disc",
                        fontSize: 14,
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
              <div css={{ ...theme.bolded, fontSize: 16, marginBottom: 18 }}>
                {happyHourDetails}
              </div>
            )}
            {happyHourMenu && (
              <IconButton
                icon={Icons.Menu}
                href={happyHourMenu}
                target="_blank"
                rel="noopener noreferrer"
                css={{
                  width: "auto",
                  margin: "0 auto 12px",
                  justifyContent: "center",
                }}
              />
            )}
          </div>
        </div>
        <div
          css={{
            display: "block",
            border: "4px double #4F67B1",
            borderRadius: 20,
            padding: "12px 6px 6px",
            textAlign: "center",
            [theme.tablet]: {
              maxWidth: "fit-content",
              marginInline: "auto",
              padding: "10px 20px",
            },
          }}
        >
          <div
            css={{
              textTransform: "capitalize",
              fontSize: 12,
              margin: "0 auto 24px",
              maxWidth: 240,
              [theme.mobile]: {
                marginBottom: 16,
              },
            }}
          >
            <div css={{ paddingBottom: 10 }}>
              <span
                css={{
                  fontFamily: theme.fancyFontFamily,
                  fontWeight: 500,
                  fontSize: 20,
                }}
              >
                Location Info:{" "}
              </span>
            </div>
            <div css={{ marginBottom: 6 }}>{address}</div>
            <div
              css={{
                ...theme.fancyFontFamily,
                fontStyle: "italic",
                marginBottom: 6,
              }}
            >
              {neighborhood}
            </div>
            {hours.map((line, index) => (
              <div key={index} css={{ fontSize: 14 }}>
                {line}
              </div>
            ))}
          </div>
          <div
            css={{
              display: "flex",
              gap: 20,
              marginRight: 0,
              textAlign: "center",
              justifyContent: "space-evenly",
            }}
          >
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
                  color: isHappyHour ? theme.oceanBlue : theme.hotPink,
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
                  color: isHappyHour ? theme.oceanBlue : theme.hotPink,
                }}
              />
            )}
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
    neighborhood
    website
    instagram
    hours
    happyHourTimes
    happyHourDetails
    happyHourMenu
    whatWeHaveHere
  }
`
