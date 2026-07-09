import { DUPLICATE_SIMILARITY_THRESHOLD } from './config';

// Token-set (Jaccard) similarity between two blobs of text, used to decide
// whether a new submission clearly overlaps a recent pending one for the same
// venue. Deliberately simple and deterministic — the dashboard reviewer makes
// the final call; this just sets the duplicateOf flag.
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s$:-]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 1)
  );
}

export function textSimilarity(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection += 1;
  }
  const union = tokensA.size + tokensB.size - intersection;
  return intersection / union;
}

export function isOverlappingContent(a: string, b: string): boolean {
  return textSimilarity(a, b) >= DUPLICATE_SIMILARITY_THRESHOLD;
}
