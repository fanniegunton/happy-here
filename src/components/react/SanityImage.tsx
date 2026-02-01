import React from 'react';
import { urlFor } from '@lib/sanity';
import type { SanityImageAsset } from '@/types/sanity';

interface SanityImageProps {
  image: SanityImageAsset;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SanityImage({
  image,
  width = 800,
  height,
  alt,
  className,
  style,
}: SanityImageProps) {
  if (!image || !image.asset) return null;

  const imageUrl = urlFor(image)
    .width(width)
    .height(height || Math.round((width * 2) / 3))
    .auto('format')
    .quality(80)
    .url();

  return (
    <img
      src={imageUrl}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}
