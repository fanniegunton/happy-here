import type { DealTile, SanityEstablishment } from '@/types/sanity';

// Flattens each establishment's otherDeals array into one tile per deal
// entry, carrying the parent venue's identity/amenity fields along so each
// tile can render through EstablishmentTile the same way a happy-hour
// establishment does. Venues with an empty/absent otherDeals array
// contribute nothing.
export function flattenOtherDeals(establishments: SanityEstablishment[]): DealTile[] {
  const tiles: DealTile[] = [];

  for (const est of establishments) {
    for (const deal of est.otherDeals ?? []) {
      const { otherDeals, ...venueFields } = est;
      tiles.push({
        ...venueFields,
        _id: `${est._id}-${deal._key}`,
        happyHourTimes: deal.times || [],
        happyHourDetails: deal.details,
        happyHourMenu: undefined,
        dealType: deal.dealType,
        dealName: deal.dealName,
      });
    }
  }

  return tiles;
}
