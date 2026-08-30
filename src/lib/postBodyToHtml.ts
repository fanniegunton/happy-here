import { toHTML } from '@portabletext/to-html';
import type { PortableTextBlock } from '@portabletext/types';
import { urlFor } from './sanity';

export function postBodyToHtml(body: PortableTextBlock[] = []): string {
  return toHTML(body, {
    components: {
      types: {
        image: ({ value }) =>
          `<img src="${urlFor(value).width(1000).auto('format').url()}" alt="${value.alt || ''}" loading="lazy" />`,
      },
    },
  });
}
