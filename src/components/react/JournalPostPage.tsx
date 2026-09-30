/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"
import SanityImage from "./SanityImage"
import PortableTextBody from "./PortableTextBody"
import type { SanityPost } from "@/types/sanity"

interface JournalPostPageProps {
  post: SanityPost
  bodyHtml: string
}

function formatPublishedDate(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function JournalPostPage({ post, bodyHtml }: JournalPostPageProps) {
  const { title, mainImage, author, categories = [], publishedAt } = post

  return (
    <article
      css={{
        padding: "0 20px",
        maxWidth: 800,
        margin: "0 auto",
        minHeight: "100vh",
        [theme.mobile]: {
          margin: 0,
          padding: 0,
        },
      }}
    >
      <a
        href="/journal"
        css={{
          display: "inline-block",
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 24,
          marginTop: 20,
          opacity: 0.7,
          "&:hover": { opacity: 1 },
        }}
      >
        ← Back to Journal
      </a>

      {mainImage && (
        <SanityImage
          image={mainImage}
          width={800}
          height={450}
          alt={`Cover image for ${title}`}
          style={{
            display: "block",
            width: "100%",
            aspectRatio: "16 / 9",
            objectFit: "cover",
            borderRadius: 20,
            marginBottom: 32,
          }}
        />
      )}

      {categories.length > 0 && (
        <div css={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
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

      <h1
        css={{
          ...theme.h1,
          fontSize: 56,
          marginBottom: 24,
          [theme.tablet]: { fontSize: 44 },
          [theme.mobile]: { fontSize: 32 },
        }}
      >
        {title}
      </h1>

      <div
        css={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 48,
          paddingBottom: 24,
          borderBottom: "1px solid #e4e3e4",
        }}
      >
        {author?.avatar ? (
          <SanityImage
            image={author.avatar}
            width={44}
            height={44}
            alt={author.name}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          author?.name && (
            <div
              css={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: theme.tobacco,
                flexShrink: 0,
              }}
            />
          )
        )}
        <div css={{ display: "flex", flexDirection: "column", lineHeight: 1.4 }}>
          {author?.name &&
            (author.url ? (
              <a
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
                css={{ fontSize: 15, fontWeight: 700, "&:hover": { textDecoration: "underline" } }}
              >
                {author.name}
              </a>
            ) : (
              <span css={{ fontSize: 15, fontWeight: 700 }}>{author.name}</span>
            ))}
          <span css={{ fontSize: 13, opacity: 0.6 }}>{formatPublishedDate(publishedAt)}</span>
        </div>
      </div>

      <div css={{ paddingBottom: 80 }}>
        <PortableTextBody html={bodyHtml} />
      </div>
    </article>
  )
}
