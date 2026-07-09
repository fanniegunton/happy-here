import { describe, it, expect } from 'vitest';
import { isOverlappingContent, textSimilarity } from './duplicate';

describe('textSimilarity', () => {
  it('returns 1 for identical text', () => {
    expect(textSimilarity('$5 margaritas until 6pm', '$5 margaritas until 6pm')).toBe(1);
  });

  it('returns 0 when either side is empty', () => {
    expect(textSimilarity('', '$5 margaritas')).toBe(0);
    expect(textSimilarity('$5 margaritas', '')).toBe(0);
  });

  it('is case- and punctuation-insensitive', () => {
    expect(textSimilarity('Half-price QUESO, Mon-Fri!', 'half-price queso mon-fri')).toBe(1);
  });

  it('scores unrelated messages low', () => {
    const a = 'New patio open at Lazarus, dog friendly';
    const b = '$2 off all drafts and $6 frozen ranch water until 7';
    expect(textSimilarity(a, b)).toBeLessThan(0.2);
  });
});

describe('isOverlappingContent', () => {
  it('flags near-identical submissions as duplicates', () => {
    const a = 'Happy hour at Nickel City: $5 well drinks, half price wings, 4-7pm weekdays';
    const b = 'happy hour Nickel City $5 well drinks half price wings 4-7pm weekdays!';
    expect(isOverlappingContent(a, b)).toBe(true);
  });

  it('does not flag different specials for the same venue', () => {
    const a = 'Nickel City brunch special: $8 bloody marys on Sundays';
    const b = 'Trivia night Thursdays with $3 lone star tallboys';
    expect(isOverlappingContent(a, b)).toBe(false);
  });
});
