import React from 'react';
import { SanityImage as SanityImageBase, type WrapperProps } from 'sanity-image';
import type { SanityImageAsset } from '@/types/sanity';

type SanityImageProps = Omit<WrapperProps<'img'>, 'id' | 'hotspot' | 'crop' | 'alt'> & {
  image: SanityImageAsset;
  alt: string;
};

export default function SanityImage({ image, mode = 'cover', ...rest }: SanityImageProps) {
  if (!image || !image.asset) return null;

  return (
    <SanityImageBase
      id={image.asset._ref}
      projectId={import.meta.env.PUBLIC_SANITY_PROJECT_ID}
      dataset={import.meta.env.PUBLIC_SANITY_DATASET}
      mode={mode}
      hotspot={image.hotspot}
      crop={image.crop}
      {...rest}
    />
  );
}
