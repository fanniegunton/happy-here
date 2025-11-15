# Geocoding Script

This script automatically geocodes establishment addresses and updates Sanity documents with latitude/longitude coordinates.

## How It Works

1. Fetches all establishments from your Sanity dataset
2. For each establishment without location data:
   - Uses the free Nominatim API (OpenStreetMap) to geocode the address
   - Updates the Sanity document with `location: { lat, lng }`
3. Skips establishments that already have location data
4. Respects API rate limits (1 request per second)

## Prerequisites

- Make sure your `.env` file has these variables set:
  - `SANITY_PROJECT_ID`
  - `SANITY_DATASET`
  - `SANITY_TOKEN` (must have write permissions)

## Running the Script

From the project root:

```bash
node scripts/geocode-establishments.js
```

## What to Expect

The script will output progress for each establishment:

```
🗺️  Starting geocoding process...

📍 Found 15 establishments

[1/15] The Roosevelt Room
  🔍 Geocoding: 307 W 5th St, Austin, TX 78701
  ✅ Found: 30.2688, -97.7461
  💾 Updated document
  ⏳ Waiting 1100ms (rate limit)...

[2/15] Midnight Cowboy
  ⏭️  Already has location, skipping

...

==================================================
✨ Geocoding complete!
📊 Processed: 15
✅ Updated: 12
⏭️  Skipped (already had location): 2
❌ Failed: 1
```

## Rate Limits

The Nominatim API has a limit of 1 request per second. The script automatically waits between requests to respect this limit. For 20 establishments, expect the script to take about 20-25 seconds.

## API Usage

This script uses the free Nominatim API from OpenStreetMap. No API key is required, but:

- Requests are limited to 1 per second
- A User-Agent header is required (already set in the script)
- See [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) for details

## After Running

Once the script completes successfully:

1. The map page will now display establishment markers
2. You can remove the GraphQL location field exclusion from `src/pages/map.jsx`
3. The map will automatically show blue markers for establishments in happy hour

## Troubleshooting

**"No results found"**: The address might not be formatted correctly for geocoding. You can manually update the address in Sanity to be more specific (e.g., include city, state, zip code).

**"Failed to update"**: Check that your `SANITY_TOKEN` has write permissions for your dataset.
