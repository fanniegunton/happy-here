/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"
import SanityImage from "./SanityImage"
import type { SanityPost } from "@/types/sanity"

interface JournalPostTileProps {
  post: SanityPost
}

function formatPublishedDate(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function JournalPostTile({ post }: JournalPostTileProps) {
  const { title, slug, mainImage, author, categories = [], publishedAt, excerpt } = post

  return (
    <div
      css={{
        background: theme.white,
        borderRadius: 20,
        maxWidth: 525,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        [theme.tablet]: {
          maxWidth: 450,
        },
        [theme.mobile]: {
          maxWidth: 380,
          margin: "0 auto",
        },
      }}
      className="subtle-box"
    >
      <a
        href={`/journal/${slug}`}
        css={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          cursor: "pointer",
        }}
      >
        <div css={{ position: "relative", width: "100%", overflow: "hidden" }}>
          {mainImage ? (
            <SanityImage
              image={mainImage}
              width={525}
              height={350}
              alt={`Cover image for ${title}`}
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "3 / 2",
                objectFit: "cover",
                transition: "transform 0.2s",
              }}
            />
          ) : (
            <div
              css={{
                width: "100%",
                aspectRatio: "3 / 2",
                background: theme.lavender,
              }}
            />
          )}
        </div>
      </a>

      <div
        css={{
          padding: "20px 30px 24px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          [theme.tablet]: { padding: "16px 24px 20px" },
          [theme.mobile]: { padding: "14px 20px 18px" },
        }}
      >
        {categories.length > 0 && (
          <div css={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
            {categories.map((category) => (
              <span
                key={category._id}
                css={{
                  ...theme.tags,
                  display: "inline-flex",
                  borderRadius: "9999px",
                  background: "#E8DDEF",
                  padding: "2px 10px",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {category.title}
              </span>
            ))}
          </div>
        )}

        <a
          href={`/journal/${slug}`}
          css={{ textDecoration: "none", color: "inherit" }}
        >
          <h3
            css={{
              ...theme.h3Alt,
              fontSize: 26,
              textWrap: "balance",
              cursor: "pointer",
              transition: "color 0.2s",
              marginBottom: 10,
              "&:hover": {
                textShadow: `${theme.lavender} 1px 0 10px`,
              },
              [theme.mobile]: { fontSize: 22 },
            }}
          >
            {title}
          </h3>
        </a>

        {excerpt && (
          <p
            css={{
              ...theme.body,
              opacity: 0.75,
              marginBottom: 16,
              flex: 1,
            }}
          >
            {excerpt}
          </p>
        )}

        <div
          css={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid #e4e3e4",
          }}
        >
          {author?.avatar ? (
            <SanityImage
              image={author.avatar}
              width={32}
              height={32}
              alt={author.name}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              css={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: theme.tobacco,
                flexShrink: 0,
              }}
            />
          )}
          <div css={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
            {author?.name && (
              <span css={{ fontSize: 13, fontWeight: 700 }}>{author.name}</span>
            )}
            <span css={{ fontSize: 12, opacity: 0.6 }}>
              {formatPublishedDate(publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
