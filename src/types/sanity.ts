import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImageAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  hotspot?: { x: number; y: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
}

export interface SanityLocation {
  _type: 'geopoint';
  lat: number;
  lng: number;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type WhatWeHaveHere = 'wine' | 'beer' | 'cocktails' | 'food' | 'coffee' | 'naDrinks';
export type TheSpaceIsLike = 'indoor' | 'patio' | 'barSeating' | 'dogFriendly' | 'smallGroups' | 'bigGroups' | 'reservationsRec' | 'staffPick';

export interface SanityAuthor {
  _id: string;
  name: string;
  url?: string;
  avatar?: SanityImageAsset;
}

export interface SanityCategory {
  _id: string;
  title: string;
  description?: string;
}

export interface SanityPost {
  _id: string;
  _type: 'post';
  title: string;
  slug: string;
  mainImage?: SanityImageAsset;
  author?: SanityAuthor;
  categories?: SanityCategory[];
  publishedAt: string;
  body: PortableTextBlock[];
  excerpt?: string;
}

export interface SanityJournalSettings {
  _id: string;
  description?: string;
  mainImage?: SanityImageAsset;
}

export type NeighborhoodColorScheme = 'Scheme1' | 'Scheme2' | 'Scheme3';

export interface SanityNeighborhood {
  _id: string;
  _type: 'neighborhood';
  region: string;
  subNeighborhood?: string;
  quickDescription?: string;
  photos?: SanityImageAsset[];
  mainCopy?: PortableTextBlock[];
  colorScheme?: NeighborhoodColorScheme;
}

export type OtherDealType = 'daily-special' | 'industry-night' | 'late-night' | 'brunch' | 'reverse-hh';

export interface SanityOtherDeal {
  _key: string;
  dealType: OtherDealType;
  dealName?: string;
  times: string[];
  details: string;
}

export interface SanityEstablishment {
  _id: string;
  _type: 'establishment';
  name: string;
  address: string;
  neighborhood: { region: string; [key: string]: string };
  photo?: SanityImageAsset;
  website?: string;
  instagram?: string;
  hours?: string[];
  happyHourTimes?: string[];
  happyHourDetails?: string;
  happyHourMenu?: string;
  whatWeHaveHere?: WhatWeHaveHere[];
  theSpaceIsLike?: TheSpaceIsLike[];
  ownershipIdentifiedAs?: string[];
  location?: SanityLocation;
  otherDeals?: SanityOtherDeal[];
}

// A single flattened tile: one venue's otherDeals entry, paired with the
// parent venue's identity/amenity fields so it can render through
// EstablishmentTile exactly like a happy-hour establishment does.
export interface DealTile extends Omit<SanityEstablishment, 'otherDeals'> {
  dealType: OtherDealType;
  dealName?: string;
}
