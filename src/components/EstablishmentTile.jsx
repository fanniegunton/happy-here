import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import theme from "../styles/theme"
import IconButton from "../components/IconButton"
import IconRow from "../components/IconRow"
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
          padding: isHappyHour ? "40px 80px 40px 100px" : "40px 80px 40px 60px",
          // backgroundColor: isHappyHour ? theme.babyPink : "#F9D261",
          background: isHappyHour
            ? "linear-gradient(135deg, #FECBC3 0%, #FFF393 67.92%, #FECBC3 98.44%)"
            : // : theme.babyPink,
              "#FFF0EE",
          borderRadius: isHappyHour ? "31% 17% 37% 13%" : "3% 37% 7% 31%",
          border: isHappyHour ? "16px double #B13076" : "16px double #FECBC3",
          maxWidth: 625,
          minHeight: 400,
          ...theme.extraFloatBox,
          [theme.mobile]: {
            maxWidth: 350,
            padding: isHappyHour ? "120px 60px 60px" : "30px 60px 30px 50px",
            borderRadius: isHappyHour ? "50%" : "20px",
          },
          [theme.smallMobile]: {
            padding: 20,
          },
        }}
      >
        <div
          css={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h3
            css={{
              ...theme.h3,
              fontSize: 28,
              textAlign: "center",
              paddingBottom: "30px",
              minWidth: 240,
              [theme.tablet]: { marginBottom: 16 },
              [theme.smallMobile]: {
                fontSize: 24,
                paddingBottom: 10,
                minWidth: 200,
              },
            }}
          >
            {name}
          </h3>
          {happyHourTimes && (
            <div
              css={{
                marginBottom: 30,
                fontSize: 18,
              }}
            >
              <IconRow
                icon={Icons.Clock}
                css={{
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                {happyHourTimes.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </IconRow>
            </div>
          )}
          {happyHourDetails?.includes("\n") ? (
            <ul
              css={{
                listStyleType: "none",
                paddingInlineStart: 0,
                marginBottom: 30,
                maxWidth: 240,
              }}
            >
              {happyHourDetails
                .split("\n")
                .filter(Boolean)
                .map((line, index) => (
                  <li
                    key={index}
                    css={{ ...theme.bolded, fontSize: 14, textAlign: "left" }}
                  >
                    {line}
                  </li>
                ))}
            </ul>
          ) : (
            <p css={{ ...theme.bolded, fontSize: 14, marginBottom: 24 }}>
              {happyHourDetails}
            </p>
          )}
          {happyHourMenu && (
            <IconButton
              icon={Icons.Menu}
              href={happyHourMenu}
              target="_blank"
              rel="noopener noreferrer"
              css={{ width: "auto", marginBottom: 24 }}
            />
          )}
          <div
            css={{
              textTransform: "capitalize",
              fontSize: 12,
              marginBottom: 24,
              maxWidth: 240,
            }}
          >
            <div css={{ marginBottom: 16 }}>
              {address} <br />{" "}
              <span css={{ fontStyle: "italic" }}>{neighborhood}</span>
            </div>
            <p css={{ fontSize: 12 }}>
              <span css={{ ...theme.bolded }}>Hours of operation: </span>
              {hours.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </p>
          </div>
          <div
            css={{
              [theme.tablet]: {
                display: "flex",
                justifyContent: "center",
              },
            }}
          >
            {website && (
              <IconButton
                icon={Icons.Website}
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                css={{ width: "auto", marginRight: 40 }}
              />
            )}
            {instagram && (
              <IconButton
                icon={Icons.Instagram}
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                css={{ width: "auto" }}
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
  }
`
