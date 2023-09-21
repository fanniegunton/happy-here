import React, { useEffect, useState } from "react"
import { hoursCover } from "../lib/parseHours"
import theme from "../styles/theme"
import { Tooltip } from "@material-ui/core"

const colors = {
  default: theme.black,
  open: theme.sodaYellow,
  closed: theme.fireRed,
}

const HHStatusIndicator = ({ hours, className }) => {
  const [open, setOpen] = useState(null)

  useEffect(() => {
    if (hours === false) {
      setOpen(false)
      return
    } else if (!hours.some((hrs) => /\d/.test(hrs))) {
      // Don't show status for unrecognizable hours strings
      return
    }

    const refreshStatus = () => setOpen(hoursCover(hours))

    // Initial state
    refreshStatus()

    const timer = window.setInterval(
      refreshStatus,
      5 * 60 * 1000 + Math.round(Math.random() * 500)
    )

    return () => {
      window.clearTimeout(timer)
    }
  }, [hours])

  if (typeof open === "undefined") return null

  const indicatorColor = open
    ? colors.open
    : open === null
    ? colors.default
    : colors.closed

  return (
    <Tooltip
      title={
        open ? "Open Now" : open === null ? "Unknown Hours" : "Currently Closed"
      }
      arrow
      placement="top"
    >
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          verticalAlign: "middle",
          margin: 0,
          width: 20,
          height: 20,
          background: indicatorColor,
          boxShadow: `0px 0px 4px ${indicatorColor}`,
          borderRadius: 10,
          transition: "background 250ms, box-shadow 250ms",
        }}
        className={className}
      />
    </Tooltip>
  )
}

export default HHStatusIndicator
