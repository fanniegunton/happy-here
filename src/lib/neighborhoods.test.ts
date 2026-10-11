import { describe, it, expect } from 'vitest';
import { getNeighborhoodLabel, getRegionLabel } from './neighborhoods';

describe('getNeighborhoodLabel', () => {
  it('uses the Studio title for a sub-neighborhood', () => {
    expect(
      getNeighborhoodLabel({ region: 'east', subNeighborhoodEast: 'mlk' })
    ).toBe('MLK');
    expect(
      getNeighborhoodLabel({ region: 'southCentral', subNeighborhoodSouthCentral: 'soco' })
    ).toBe('SoCo (South Congress)');
    expect(
      getNeighborhoodLabel({ region: 'central', subNeighborhoodCentral: 'westCampusTheDrag' })
    ).toBe('West Campus / The Drag');
  });

  it('falls back to the region title when there is no sub-neighborhood', () => {
    expect(getNeighborhoodLabel({ region: 'southCentral' })).toBe('South Central');
  });

  it('formats values missing from the Studio list readably', () => {
    expect(
      getNeighborhoodLabel({ region: 'east', subNeighborhoodEast: 'someNewPlace' })
    ).toBe('Some New Place');
  });

  it('returns an empty string with no neighborhood', () => {
    expect(getNeighborhoodLabel(undefined)).toBe('');
  });
});

describe('getRegionLabel', () => {
  it('uses the Studio title', () => {
    expect(getRegionLabel('northeast')).toBe('Northeast');
  });
});
