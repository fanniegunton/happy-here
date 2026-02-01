/** @jsxImportSource @emotion/react */
import React from 'react';
import ExternalLink from './ExternalLink';

// Type for Astro image imports
interface AstroImageMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
}

interface IconButtonProps {
  icon: AstroImageMetadata;
  href: string;
  children?: React.ReactNode;
  className?: string;
  childStyles?: React.CSSProperties;
  target?: string;
  rel?: string;
}

export default function IconButton({
  icon,
  href,
  children,
  className,
  childStyles = {},
  target,
  rel,
}: IconButtonProps) {
  const linkProps = {
    href,
    target: target || (href.startsWith('http') || href.startsWith('mailto') ? '_blank' : '_self'),
    rel: rel || 'noopener noreferrer',
  };

  return (
    <ExternalLink
      {...linkProps}
      css={{
        display: 'inline-flex',
        marginBottom: 8,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        alignItems: 'center',
      }}
      className={className}
    >
      <img
        src={icon.src}
        alt=""
        css={{
          width: 16,
          height: 16,
          marginRight: 8,
          flex: '0 0 16px',
        }}
      />
      {children && (
        <div
          css={{
            fontWeight: 500,
          }}
          style={childStyles}
        >
          {children}
        </div>
      )}
    </ExternalLink>
  );
}
