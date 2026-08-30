/** @jsxImportSource @emotion/react */
import React from 'react';
import theme from '@styles/theme';
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
        marginBottom: 0,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        '&:hover img': {
          filter: 'drop-shadow(1px 0 4px #A78BB5)',
        },
        [theme.mobile]: {
          marginBottom: 8,
        },
      }}
      className={className}
    >
      <img
        src={icon.src}
        alt=""
        css={{
          width: 28,
          height: 28,
          marginRight: 8,
          flex: '0 0 28px',
          [theme.mobile]: {
            width: 16,
            height: 16,
            flex: '0 0 16px',
          },
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
