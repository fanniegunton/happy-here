export interface SanityImageAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

export interface SanityLocation {
  _type: 'geopoint';
  lat: number;
  lng: number;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type WhatWeHaveHere = 'wine' | 'beer' | 'cocktails' | 'food' | 'coffee' | 'naDrinks';
export type TheSpaceIsLike = 'indoor' | 'patio' | 'barSeating' | 'dogFriendly' | 'smallGroups' | 'bigGroups' | 'reservationsRec' | 'staffPick';

export interface SanityEstablishment {
  _id: string;
  _type: 'establishment';
  name: string;
  address: string;
  neighborhood: string;
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
}
