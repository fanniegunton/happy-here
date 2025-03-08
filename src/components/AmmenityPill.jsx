import React from "react"
import theme from "../styles/theme"

const AmmenityPill = ({
  icon: Icon,
  iconColor = theme.black,
  children,
  className,
}) => (
  <div
    css={{
      marginBottom: 8,
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "9999px",
      background: "#c3c3ff",
      padding: "2px 10px",
      fontSize: 12,
      fontWeight: 600,
      textWrap: "pretty",
      height: "fit-content",
      width: "auto",
      marginRight: 4,
    }}
    className={className}
  >
    <Icon
      css={{
        color: iconColor,
        marginRight: 8,
        flex: "0 0 16px",
      }}
    />
    <div>{children}</div>
  </div>
)

export default AmmenityPill
