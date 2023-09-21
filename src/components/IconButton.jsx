import React from "react"
import theme from "../styles/theme"
import ExternalLink from "./ExternalLink"

const IconButton = ({
  icon: Icon,
  href,
  children,
  className,
  childStyles = {},
}) => (
  <ExternalLink
    href={href}
    target={
      href.startsWith("http") || href.startsWith("mailto") ? "_blank" : "_self"
    }
    rel="noopener noreferrer"
    css={{
      display: "inline-flex",
      marginBottom: 8,
      textDecoration: "none",
      whiteSpace: "nowrap",
      alignItems: "center",
    }}
    className={className}
  >
    <Icon css={{ color: theme.n50, marginRight: 8, flex: "0 0 16px" }} />
    <div css={{ fontWeight: 500, color: theme.n80, ...childStyles }}>
      {children}
    </div>
  </ExternalLink>
)

export default IconButton
