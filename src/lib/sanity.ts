import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { getExcerpt } from './portableText';
import type {
  SanityEstablishment,
  SanityImageAsset,
  SanityPost,
  SanityJournalSettings,
  SanityNeighborhood,
} from '@/types/sanity';

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
  doesNotHaveHappyHour,
  whatWeHaveHere,
  theSpaceIsLike,
  ownershipIdentifiedAs,
  location,
  otherDeals[]{ _key, dealType, dealName, times, details }
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
    otherDeals: est.otherDeals || [],
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

// GROQ query projection for post data
export const POST_PROJECTION = `
  _id,
  _type,
  title,
  "slug": slug.current,
  mainImage,
  "author": author->{ _id, name, url, avatar },
  "categories": categories[]->{ _id, title, description },
  publishedAt,
  body
`;

// Fetch the journalSettings singleton
export async function getJournalSettings(): Promise<SanityJournalSettings | null> {
  if (!sanityClient) {
    throw new Error('getJournalSettings can only be called on the server');
  }
  const query = `*[_type == "journalSettings"][0] {
    _id,
    description,
    mainImage
  }`;
  const result = await sanityClient.fetch(query);
  return result || null;
}

// Fetch all posts, most recently published first, with a derived excerpt for card previews
export async function getAllPosts(): Promise<SanityPost[]> {
  if (!sanityClient) {
    throw new Error('getAllPosts can only be called on the server');
  }
  const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${POST_PROJECTION}
  }`;
  const posts: SanityPost[] = await sanityClient.fetch(query);
  return posts.map((post) => ({ ...post, excerpt: getExcerpt(post.body) }));
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  if (!sanityClient) {
    throw new Error('getPostBySlug can only be called on the server');
  }
  const query = `*[_type == "post" && slug.current == $slug][0] {
    ${POST_PROJECTION}
  }`;
  const result = await sanityClient.fetch(query, { slug });
  return result || null;
}

// GROQ query projection for neighborhood content
export const NEIGHBORHOOD_PROJECTION = `
  _id,
  _type,
  region,
  subNeighborhood,
  quickDescription,
  photos,
  mainCopy,
  colorScheme
`;

// Fetch the neighborhood document for a region. The neighborhood route is
// region-level (one page aggregates every subNeighborhood under a region), so
// prefer a region-wide document (no subNeighborhood set) and fall back to any
// subNeighborhood-specific document if that's all that's been created so far.
// Returns null when no matching document exists yet — expected during rollout.
export async function getNeighborhoodContent(region: string): Promise<SanityNeighborhood | null> {
  if (!sanityClient) {
    throw new Error('getNeighborhoodContent can only be called on the server');
  }
  const query = `*[_type == "neighborhood" && region == $region] | order(defined(subNeighborhood) asc) [0] {
    ${NEIGHBORHOOD_PROJECTION}
  }`;
  const result = await sanityClient.fetch(query, { region });
  return result || null;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
