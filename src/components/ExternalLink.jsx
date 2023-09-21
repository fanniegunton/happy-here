import React from "react"
import PropTypes from "prop-types"
import { OutboundLink } from "gatsby-plugin-gtag"

const ExternalLink = (props) => (
  <OutboundLink target="_blank" rel="noopener noreferrer" {...props} />
)

export default ExternalLink

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}
