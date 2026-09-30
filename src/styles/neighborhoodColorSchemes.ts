import theme from './theme';
import type { NeighborhoodColorScheme } from '@/types/sanity';

// PLACEHOLDER — these are not designed values, just wiring so a real palette
// can be dropped in per scheme later. Swap accent/background per scheme name.
export const neighborhoodColorSchemes: Record<NeighborhoodColorScheme, { accent: string; background: string }> = {
  Scheme1: { accent: theme.lavender, background: theme.babyPink },
  Scheme2: { accent: theme.tobacco, background: theme.nudeStone },
  Scheme3: { accent: theme.oceanBlue, background: theme.candyBlue },
};
