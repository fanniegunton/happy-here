/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"

interface Neighborhood {
  region: string
  label: string
  slug: string
  count: number
}

interface NeighborhoodsPageProps {
  neighborhoods: Neighborhood[]
}

export default function NeighborhoodsPage({
  neighborhoods,
}: NeighborhoodsPageProps) {
  return (
    <>
      <div
        css={{
          padding: "0 20px",
          [theme.mobile]: { padding: 0, margin: "0 30px" },
        }}
      >
        <div
          css={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 32,
            marginBottom: 48,
            [theme.mobile]: { marginBottom: 32 },
          }}
        >
          <h1
            css={{
              ...theme.h2,
              fontSize: 100,
              textTransform: "uppercase",
              lineHeight: 1,
              // letterSpacing: "-0.05em",
              fontWeight: 600,
              [theme.tablet]: { fontSize: 80 },
              "@media (max-width: 980px)": { fontSize: 64 },
              "@media (max-width: 830px)": { fontSize: 40 },
              "@media (max-width: 480px)": { fontSize: 28 },
            }}
          >
            Neighborhoods
          </h1>
          {/* <span css={{ fontSize: 48, [theme.mobile]: { fontSize: 28 } }}>
            ✦
          </span> */}
        </div>

        <ul css={{ padding: 0, margin: 0 }}>
          {neighborhoods.map(({ label, slug, count }) => (
            <li key={slug} css={{ listStyle: "none" }}>
              <a
                href={`/neighborhoods/${slug}`}
                css={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  padding: "20px 0",
                  borderBottom: `1px solid ${theme.lightGrout}`,
                  fontFamily: theme.fancyFontFamily,
                  fontSize: 36,
                  fontWeight: 400,
                  color: theme.black,
                  textDecoration: "none",
                  transition: "color 0.2s",
                  "&:hover": { color: theme.oceanBlue },
                  [theme.tablet]: { fontSize: 28 },
                  [theme.mobile]: { fontSize: 22 },
                }}
              >
                <span>{label}</span>
                <span
                  css={{
                    fontSize: 16,
                    fontFamily: theme.displayFontFamily,
                    opacity: 0.45,
                    flexShrink: 0,
                    marginLeft: 16,
                  }}
                >
                  {count} {count === 1 ? "spot" : "spots"}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
