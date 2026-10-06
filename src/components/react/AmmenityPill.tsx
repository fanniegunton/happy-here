/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"
import type { LucideIcon } from "lucide-react"

interface AmmenityPillProps {
  icon: LucideIcon
  iconColor?: string
  background?: string
  children: React.ReactNode
  className?: string
  // Render as a round icon dot with a larger icon. The label stays
  // available as the dot's accessible name and hover tooltip.
  iconOnly?: boolean
}

export default function AmmenityPill({
  icon: Icon,
  iconColor = theme.black,
  background = "#E8DDEF",
  children,
  className,
  iconOnly = false,
}: AmmenityPillProps) {
  const label = typeof children === "string" ? children : undefined

  return (
    <div
      role={iconOnly ? "img" : undefined}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      css={{
        marginBottom: 8,
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "9999px",
        background,
        color: "#000000",
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 600,
        textWrap: "pretty",
        height: "fit-content",
        width: "auto",
        marginRight: 8,
        ...(iconOnly && {
          width: 32,
          height: 32,
          padding: 0,
          borderRadius: "50%",
          justifyContent: "center",
        }),
      }}
      className={className}
    >
      <Icon
        aria-hidden={iconOnly || undefined}
        size={iconOnly ? 20 : undefined}
        css={{
          color: iconColor,
          marginRight: iconOnly ? 0 : 8,
          // Icon-only: 125% of the regular 16px glyph.
          flex: iconOnly ? "0 0 20px" : "0 0 16px",
        }}
      />
      {!iconOnly && <div>{children}</div>}
    </div>
  )
}
