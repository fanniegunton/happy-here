import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityEstablishment, SanityImageAsset } from '@/types/sanity';

// Server-side client for fetching data (uses private token)
// Only initialize on server to avoid client-side errors
export const sanityClient = typeof window === 'undefined'
  ? createClient({
      projectId: import.meta.env.SANITY_PROJECT_ID,
      dataset: import.meta.env.SANITY_DATASET,
      apiVersion: '2024-01-01',
      useCdn: import.meta.env.PROD,
      token: import.meta.env.SANITY_TOKEN,
      perspective: import.meta.env.DEV ? 'previewDrafts' : 'published',
    })
  : null;

// Client-safe image URL builder using PUBLIC_ env vars
const imageClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(imageClient);

export function urlFor(source: SanityImageAsset) {
  return builder.image(source);
}

// GROQ query projection for establishment data
export const ESTABLISHMENT_PROJECTION = `
  _id,
  name,
  address,
  neighborhood,
  photo,
  website,
  instagram,
  hours,
  happyHourTimes,
  happyHourDetails,
  happyHourMenu,
  whatWeHaveHere,
  theSpaceIsLike,
  ownershipIdentifiedAs,
  location
`;

// Normalize establishment data to ensure arrays are never null
function normalizeEstablishment(est: any): SanityEstablishment {
  return {
    ...est,
    hours: est.hours || [],
    happyHourTimes: est.happyHourTimes || [],
    whatWeHaveHere: est.whatWeHaveHere || [],
    theSpaceIsLike: est.theSpaceIsLike || [],
    ownershipIdentifiedAs: est.ownershipIdentifiedAs || [],
  };
}

// Fetch all establishments
export async function getAllEstablishments(): Promise<SanityEstablishment[]> {
  if (!sanityClient) {
    throw new Error('getAllEstablishments can only be called on the server');
  }
  const query = `*[_type == "establishment"] | order(name asc) {
    ${ESTABLISHMENT_PROJECTION}
  }`;
  const results = await sanityClient.fetch(query);
  return results.map(normalizeEstablishment);
}

// Fetch single establishment by slug
export async function getEstablishmentBySlug(slug: string): Promise<SanityEstablishment | null> {
  if (!sanityClient) {
    throw new Error('getEstablishmentBySlug can only be called on the server');
  }
  const query = `*[_type == "establishment"][0] {
    ${ESTABLISHMENT_PROJECTION}
  } | [lower(name) match "${slug.replace(/-/g, ' ')}*"]`;

  const results: any[] = await sanityClient.fetch(query);
  return results.length > 0 ? normalizeEstablishment(results[0]) : null;
}

// Fetch single establishment by ID
export async function getEstablishmentById(id: string): Promise<SanityEstablishment | null> {
  if (!sanityClient) {
    throw new Error('getEstablishmentById can only be called on the server');
  }
  const query = `*[_type == "establishment" && _id == $id][0] {
    ${ESTABLISHMENT_PROJECTION}
  }`;
  const result = await sanityClient.fetch(query, { id });
  return result ? normalizeEstablishment(result) : null;
}

// Generate slug from establishment name (matches Gatsby's logic)
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
