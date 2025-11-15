require("dotenv").config()
const { createClient } = require("@sanity/client")

// Create Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN_WRITE || process.env.SANITY_TOKEN,
  apiVersion: "2023-01-01",
  useCdn: false,
})

// Nominatim requires a User-Agent header
const USER_AGENT = "HappyHere-App/1.0"

// Rate limiting: Nominatim allows max 1 request per second
const DELAY_MS = 1100 // 1.1 seconds to be safe

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function geocodeAddress(address) {
  if (!address || !address.trim()) {
    console.log("  ⚠️  No address provided")
    return null
  }

  try {
    // Nominatim API endpoint
    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.append("q", address)
    url.searchParams.append("format", "json")
    url.searchParams.append("limit", "1")

    console.log(`  🔍 Geocoding: ${address}`)

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
      },
    })

    if (!response.ok) {
      console.log(`  ❌ API error: ${response.status}`)
      return null
    }

    const data = await response.json()

    if (data && data.length > 0) {
      const location = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
      console.log(`  ✅ Found: ${location.lat}, ${location.lng}`)
      return location
    } else {
      console.log("  ⚠️  No results found")
      return null
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
    return null
  }
}

async function updateEstablishmentLocation(establishmentId, location) {
  try {
    await client
      .patch(establishmentId)
      .set({ location })
      .commit()
    console.log(`  💾 Updated document`)
  } catch (error) {
    console.log(`  ❌ Failed to update: ${error.message}`)
  }
}

async function main() {
  console.log("🗺️  Starting geocoding process...\n")

  try {
    // Fetch all establishments
    const establishments = await client.fetch(`
      *[_type == "establishment"] {
        _id,
        name,
        address,
        location
      }
    `)

    console.log(`📍 Found ${establishments.length} establishments\n`)

    let processed = 0
    let updated = 0
    let skipped = 0

    for (const est of establishments) {
      processed++
      console.log(`[${processed}/${establishments.length}] ${est.name}`)

      // Skip if already has location
      if (est.location && est.location.lat && est.location.lng) {
        console.log(`  ⏭️  Already has location, skipping`)
        skipped++
      } else {
        // Geocode the address
        const location = await geocodeAddress(est.address)

        if (location) {
          // Update Sanity document
          await updateEstablishmentLocation(est._id, location)
          updated++
        }

        // Rate limiting: wait before next request
        if (processed < establishments.length) {
          console.log(`  ⏳ Waiting ${DELAY_MS}ms (rate limit)...`)
          await sleep(DELAY_MS)
        }
      }

      console.log() // Empty line for readability
    }

    console.log("=".repeat(50))
    console.log("✨ Geocoding complete!")
    console.log(`📊 Processed: ${processed}`)
    console.log(`✅ Updated: ${updated}`)
    console.log(`⏭️  Skipped (already had location): ${skipped}`)
    console.log(`❌ Failed: ${processed - updated - skipped}`)
  } catch (error) {
    console.error("❌ Fatal error:", error.message)
    process.exit(1)
  }
}

// Run the script
main()
