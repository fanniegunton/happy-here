/** @jsxImportSource @emotion/react */
import React from 'react';
import theme from '@styles/theme';
import type { LucideIcon } from 'lucide-react';

interface AmmenityPillProps {
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AmmenityPill({
  icon: Icon,
  iconColor = theme.black,
  children,
  className,
}: AmmenityPillProps) {
  return (
    <div
      css={{
        marginBottom: 8,
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '9999px',
        background: '#c3c3ff',
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 600,
        textWrap: 'pretty',
        height: 'fit-content',
        width: 'auto',
        marginRight: 4,
      }}
      className={className}
    >
      <Icon
        css={{
          color: iconColor,
          marginRight: 8,
          flex: '0 0 16px',
        }}
      />
      <div>{children}</div>
    </div>
  );
}
