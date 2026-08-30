/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react"
import theme from "@styles/theme"
import wordmark from "../../assets/happy-here-wordmark.svg"
import instagramIcon from "../../images/Instagram.svg"

const ABOUT_MENU_ITEMS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
]

function AboutMenu() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  useEffect(() => {
    if (open) {
      itemRefs.current[0]?.focus()
    }
  }, [open])

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  const handleMenuItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = (index + 1) % itemRefs.current.length
      itemRefs.current[next]?.focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prev =
        (index - 1 + itemRefs.current.length) % itemRefs.current.length
      itemRefs.current[prev]?.focus()
    }
  }

  return (
    <div
      ref={containerRef}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false)
        }
      }}
      css={{
        position: "relative",
        [theme.mobile]: {
          position: "static",
          width: "100%",
          textAlign: "center",
        },
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        css={{
          font: "inherit",
          fontFamily: "inherit",
          fontSize: "inherit",
          fontWeight: "inherit",
          textTransform: "inherit",
          letterSpacing: "inherit",
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          color: "inherit",
          cursor: "pointer",
        }}
      >
        About
      </button>
      {open && (
        <div
          role="menu"
          aria-label="About"
          css={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 12,
            background: "#FAF8F4",
            border: "1px solid black",
            borderRadius: 12,
            padding: "8px 0",
            minWidth: 160,
            display: "flex",
            flexDirection: "column",
            boxShadow: "var(--shadow-elevation-medium)",
            zIndex: 10,
            [theme.mobile]: {
              position: "static",
              margin: "12px 0 0",
              border: "none",
              boxShadow: "none",
              background: "transparent",
              alignItems: "center",
              padding: 0,
              minWidth: 0,
            },
          }}
        >
          {ABOUT_MENU_ITEMS.map(({ label, href }, index) => (
            <a
              key={href}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              role="menuitem"
              href={href}
              tabIndex={-1}
              onKeyDown={(e) => handleMenuItemKeyDown(e, index)}
              onClick={() => setOpen(false)}
              css={{
                padding: "8px 20px",
                display: "block",
                textTransform: "none",
                "&:hover": { textDecoration: "underline" },
                [theme.mobile]: { padding: "6px 0" },
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  return (
    <nav
      css={{
        margin: "0 auto 20px",
        padding: "0",
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
        [theme.mobile]: {
          display: "block",
          margin: "0 auto 40px",
        },
      }}
    >
      <a href="/" css={{ maxWidth: "65%" }}>
        <img
          src={(wordmark as any).src}
          alt="Happy Here"
          css={{
            display: "block",
            width: 220,
            height: "auto",
            [theme.mobile]: {
              width: 150,
            },
          }}
        />
      </a>
      <div
        css={{
          fontFamily: theme.displayFontFamily,
          fontSize: 18,
          fontWeight: 400,
          lineHeight: 1.0,
          textTransform: "uppercase",
          paddingTop: 40,
          flex: "1 0 auto",
          maxWidth: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 20,
          [theme.tablet]: {
            fontSize: 18,
          },
          [theme.mobile]: {
            marginTop: 16,
            justifyContent: "center",
            padding: "10px 0",
            fontSize: 14,
            flexWrap: "wrap",
            rowGap: 16,
          },
        }}
      >
        {/* <a href="/map">Map</a> */}
        <a href="/neighborhoods">Neighborhoods</a>
        <a href="/happenings">Happenings</a>
        <a href="/journal">Journal</a>
        <AboutMenu />
        <a
          href="https://www.instagram.com/takeouttracker/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={(instagramIcon as any).src}
            css={{
              width: "auto",
              color: "#000000",
              [theme.mobile]: {
                alignContent: "end",
                marginLeft: 8,
              },
            }}
            alt="Instagram"
          />
        </a>
      </div>
    </nav>
  )
}
