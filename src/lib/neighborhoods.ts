// Mirrors REGIONS and SUB_NEIGHBORHOODS in the Studio schema
// (happy-here-sanity/schemas/objects/neighborhood.js). Sanity stores each
// option's code-friendly `value` (e.g. "mlk"); these maps give the display
// `title` exactly as written in Studio (e.g. "MLK"). The Studio schema lives
// outside this repo and isn't importable at build time, so keep this in sync
// when neighborhoods are added or renamed there.
import type { SanityEstablishment } from '@/types/sanity';

export const REGION_TITLES: Record<string, string> = {
  central: "Central",
  downtown: "Downtown",
  east: "East",
  north: "North",
  northeast: "Northeast",
  northwest: "Northwest",
  southCentral: "South Central",
  southeast: "Southeast",
  southwest: "Southwest",
  west: "West",
};

export const SUB_NEIGHBORHOOD_TITLES: Record<string, string> = {
  // downtown
  downtown: "Downtown",
  raineyStreet: "Rainey Street",
  warehouseDistrict: "Warehouse District",
  secondStreetDistrict: "Second Street District",
  // central
  westCampusTheDrag: "West Campus / The Drag",
  northUniversity: "North University",
  hydePark: "Hyde Park",
  hancock: "Hancock",
  rosedale: "Rosedale",
  brykerWoods: "Bryker Woods",
  oldEnfield: "Old Enfield",
  oldWestAustinClarksville: "Old West Austin / Clarksville",
  pembertonHeights: "Pemberton Heights",
  tarrytown: "Tarrytown",
  judgesHill: "Judges' Hill",
  // east
  eastCesarChavez: "East Cesar Chavez",
  cherrywoodFrenchPlace: "Cherrywood / French Place",
  centralEastAustin: "Central East Austin",
  holly: "Holly",
  govalle: "Govalle",
  mueller: "Mueller",
  windsorPark: "Windsor Park",
  coronadoHills: "Coronado Hills",
  delwood: "Delwood",
  stJohn: "St. John",
  mlk: "MLK",
  // north
  northLoop: "North Loop",
  brentwood: "Brentwood",
  crestview: "Crestview",
  allandale: "Allandale",
  northShoalCreek: "North Shoal Creek",
  wooten: "Wooten",
  northBurnetHighland: "North Burnet / Highland",
  // northwest
  andersonMill: "Anderson Mill",
  northwestHillsGreatHills: "Northwest Hills / Great Hills",
  balconesWoods: "Balcones Woods",
  canyonCreek: "Canyon Creek",
  // northeast
  georgianAcres: "Georgian Acres",
  gracyWoods: "Gracy Woods",
  harrisBranch: "Harris Branch",
  rundberg: "Rundberg",
  copperfield: "Copperfield",
  // southCentral
  bouldinCreek: "Bouldin Creek",
  travisHeightsFairview: "Travis Heights / Fairview",
  soco: "SoCo (South Congress)",
  bartonHills: "Barton Hills",
  dawson: "Dawson",
  galindo: "Galindo",
  zilker: "Zilker",
  // southeast
  eastRiverside: "East Riverside",
  montopolis: "Montopolis",
  pleasantValley: "Pleasant Valley",
  doveSprings: "Dove Springs",
  onionCreek: "Onion Creek",
  southeastAustin: "Southeast Austin",
  // southwest
  oakHill: "Oak Hill",
  circleCRanch: "Circle C Ranch",
  shadyHollow: "Shady Hollow",
  tanglewoodForest: "Tanglewood Forest",
  westgate: "Westgate",
  // west
  farWest: "Far West",
  westLakeHills: "West Lake Hills",
  bartonCreek: "Barton Creek",
  catMountain: "Cat Mountain",
  lostCreek: "Lost Creek",
};

// Fallback for a value missing from the maps above: split camelCase and
// capitalize, so a new Studio option still shows something readable.
function fallbackTitle(value: string): string {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export function getRegionLabel(region: string): string {
  return REGION_TITLES[region] ?? fallbackTitle(region);
}

// The venue's sub-neighborhood title if it has one, otherwise its region's.
export function getNeighborhoodLabel(
  neighborhood: SanityEstablishment['neighborhood'] | undefined
): string {
  if (!neighborhood) return '';
  const subKey = Object.keys(neighborhood).find((k) =>
    k.startsWith('subNeighborhood')
  );
  const sub = subKey ? neighborhood[subKey] : undefined;
  if (sub) return SUB_NEIGHBORHOOD_TITLES[sub] ?? fallbackTitle(sub);
  return neighborhood.region ? getRegionLabel(neighborhood.region) : '';
}
