/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"

interface PortableTextBodyProps {
  html: string
  className?: string
}

// Shared prose renderer for Portable Text content already converted to an HTML
// string via @lib/postBodyToHtml (see Journal post body, neighborhood mainCopy).
export default function PortableTextBody({ html, className }: PortableTextBodyProps) {
  return (
    <div
      className={className}
      css={{
        ...theme.postDetails,
        "& p": {
          marginBottom: 24,
        },
        "& h2": {
          ...theme.h3,
          marginTop: 40,
          marginBottom: 16,
        },
        "& h3": {
          ...theme.h3Alt,
          fontSize: 24,
          marginTop: 32,
          marginBottom: 12,
        },
        "& a": {
          textDecoration: "underline",
          textUnderlineOffset: 3,
        },
        "& blockquote": {
          borderLeft: `4px solid ${theme.lavender}`,
          margin: "24px 0",
          padding: "4px 0 4px 20px",
          fontStyle: "italic",
        },
        "& ul": {
          marginBottom: 24,
          paddingInlineStart: 24,
          listStyleType: "disc",
        },
        "& ol": {
          marginBottom: 24,
          paddingInlineStart: 24,
          listStyleType: "decimal",
        },
        "& li": {
          marginBottom: 8,
        },
        "& img": {
          width: "100%",
          borderRadius: 20,
          margin: "32px 0",
        },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
