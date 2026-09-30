import type { PortableTextBlock } from '@portabletext/types';

// Derive a plain-text excerpt from the start of a post body for card previews
export function getExcerpt(body: PortableTextBlock[] = [], maxLength = 160): string {
  const text = body
    .filter((block) => block._type === 'block' && Array.isArray((block as any).children))
    .map((block) =>
      (block as any).children.map((child: any) => child.text || '').join('')
    )
    .join(' ')
    .trim();

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}
