import type { OtherDealType } from '@/types/sanity';

// Mirrors the `dealType` dropdown list on the establishment.otherDeals schema
// in Sanity Studio. Studio owns the source of truth for the option list; this
// map is duplicated here because the Studio schema lives outside this repo
// and isn't importable at build time. If a shared package/schema repo is set
// up later, this is the spot to replace with an import from it.
export const DEAL_TYPE_LABELS: Record<OtherDealType, string> = {
  'daily-special': 'Daily Special',
  'industry-night': 'Industry Night',
  'late-night': 'Late Night',
  brunch: 'Brunch',
  'reverse-hh': 'Reverse Happy Hour',
};
