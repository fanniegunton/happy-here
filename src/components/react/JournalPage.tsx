/** @jsxImportSource @emotion/react */
import React from "react"
import theme from "@styles/theme"
import JournalPostTile from "./JournalPostTile"
import SanityImage from "./SanityImage"
import type { SanityPost, SanityJournalSettings } from "@/types/sanity"

interface JournalPageProps {
  journalSettings: SanityJournalSettings | null
  posts: SanityPost[]
}

export default function JournalPage({ journalSettings, posts = [] }: JournalPageProps) {
  return (
    <div
      css={{
        padding: "0 20px",
        maxWidth: 1450,
        minHeight: "100vh",
        margin: "0 auto",
        [theme.mobile]: {
          margin: "0 30px",
          padding: 0,
        },
      }}
    >
      {journalSettings?.mainImage && (
        <SanityImage
          image={journalSettings.mainImage}
          width={1450}
          height={400}
          alt="Happy Here Journal"
          style={{
            display: "block",
            width: "100%",
            aspectRatio: "1450 / 400",
            objectFit: "cover",
            borderRadius: 20,
            marginBottom: 32,
          }}
        />
      )}

      <h1
        css={{
          ...theme.h1,
          marginBottom: 24,
          [theme.tablet]: { fontSize: 64 },
          [theme.mobile]: { fontSize: 40, paddingTop: 20 },
        }}
      >
        Journal
      </h1>

      {journalSettings?.description && (
        <p
          css={{
            ...theme.subtitle,
            maxWidth: 700,
            marginBottom: 60,
            [theme.mobile]: { marginBottom: 40 },
          }}
        >
          {journalSettings.description}
        </p>
      )}

      {posts.length === 0 ? (
        <div
          css={{
            textAlign: "center",
            padding: "60px 20px",
            [theme.mobile]: {
              padding: "40px 30px",
            },
          }}
        >
          <h3
            css={{
              ...theme.h3,
              marginBottom: 16,
            }}
          >
            Nothing here yet
          </h3>
          <p
            css={{
              ...theme.body,
              color: theme.black,
              opacity: 0.7,
            }}
          >
            Check back soon for stories, guides, and updates from the Happy Here team.
          </p>
        </div>
      ) : (
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            margin: "0 auto",
            justifyContent: "center",
            justifyItems: "center",
            gap: "40px 40px",
            paddingBottom: 80,
            [theme.smallDesktop]: {
              gridTemplateColumns: "1fr 1fr",
            },
            [theme.tablet]: {
              gridTemplateColumns: "1fr",
              gap: 30,
            },
            [theme.mobile]: {
              margin: 0,
              gap: 24,
            },
          }}
        >
          {posts.map((post) => (
            <JournalPostTile key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
