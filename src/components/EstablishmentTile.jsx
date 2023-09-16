import React from "react"
import { graphql } from "gatsby"
import theme from "../styles/theme"
import HHStatusIndicator from "../components/HHStatusIndicator"

const EstablishmentTile = ({
  name,
  address,
  neighborhood,
  website,
  _id,
  hours,
  happyHourTimes,
  happyHourDetails,
}) => {
  return (
    <div
      key={_id}
      css={{
        maxWidth: 1000,
        display: "flex",
        flexDirection: "column",
        padding: 30,
        [theme.mobile]: {
          width: 450,
        },
        [theme.smallMobile]: {
          maxWidth: 500,
          padding: 10,
        },
      }}
    >
      <div
        css={{
          backgroundColor: theme.candyBlue,
          padding: 30,
          borderRadius: 45,
          border: "4px dotted #000",
        }}
      >
        <div
          css={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 css={{ ...theme.h3 }}>{name}</h3>
          <div
            css={{
              display: "grid",
              gridTemplateColumns: "1fr",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HHStatusIndicator
              hours={happyHourTimes}
              css={{
                margin: 10,
                width: 40,
                height: 40,
                borderRadius: 50,
              }}
            />
          </div>
        </div>
        <p css={{ ...theme.bolded }}>{address}</p>
        <p css={{ fontStyle: "italic" }}>{neighborhood} neighborhood</p>
        <a href={website} target="_blank" rel="noopener noreferrer">
          {website}
        </a>
        <p>
          <span css={{ ...theme.bolded }}>Open Hours: </span>
          {hours.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </p>
        <p>
          <span css={{ ...theme.bolded }}>Happy Hour Times: </span>{" "}
          {happyHourTimes}
        </p>
        <p>
          <span css={{ ...theme.bolded }}>Happy Hour Details: </span>
          {happyHourDetails}
        </p>
      </div>
    </div>
  )
}

export default EstablishmentTile

export const query = graphql`
  fragment EstablishmentTile on SanityEstablishment {
    name
    address
    neighborhood
    website
    _id
    hours
    happyHourTimes
    happyHourDetails
  }
`
