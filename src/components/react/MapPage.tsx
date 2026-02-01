/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import Map from './Map';
import theme from '@styles/theme';
import { hoursCover } from '@lib/parseHours';
import type { SanityEstablishment } from '@/types/sanity';

interface MapPageProps {
  establishments: SanityEstablishment[];
}

const MapPage = ({ establishments }: MapPageProps) => {
  const [happyHourStatus, setHappyHourStatus] = useState<Record<string, boolean>>({});

  // Check happy hour status for all establishments
  useEffect(() => {
    const checkAllHours = () => {
      const status: Record<string, boolean> = {};
      establishments.forEach((est) => {
        status[est._id] = hoursCover(est.happyHourTimes ?? [], new Date());
      });
      setHappyHourStatus(status);
    };

    checkAllHours();
    const timer = setInterval(checkAllHours, 30_000);
    return () => clearInterval(timer);
  }, [establishments]);

  return (
    <div>
      {/* Divider before happy hour now section */}
      <div
        css={{
          margin: '40px -40px 0',
          borderTop: '4px dotted #006eff',
          [theme.mobile]: {
            margin: '30px -20px 0',
            borderTop: '2px dotted #006eff',
          },
        }}
      />

      <div
        css={{
          marginTop: 60,
          marginBottom: 24,
          padding: '0 20px',
          [theme.mobile]: {
            margin: '16px 30px',
            padding: 0,
          },
        }}
      >
        <h2
          css={{
            fontFamily: theme.fancyFontFamily,
            fontSize: 36,
            textAlign: 'left',
            [theme.mobile]: {
              fontSize: 28,
            },
          }}
        >
          Look for the <span css={{ color: theme.oceanBlue }}>BLUE</span> to find Happy Hour NOW!
        </h2>
      </div>

      {/* Map Container */}
      <Map
        establishments={establishments}
        happyHourStatus={happyHourStatus}
        theme={theme}
      />

      {/* Stats */}
      <div
        css={{
          marginTop: 24,
          display: 'flex',
          gap: 24,
          fontSize: 14,
          color: theme.black,
          [theme.mobile]: {
            flexDirection: 'column',
            gap: 12,
            padding: '0 20px',
          },
        }}
      >
        <h3>
          <strong>{establishments.length}</strong> establishments on map
        </h3>
        <h3>
          <strong>{Object.values(happyHourStatus).filter(Boolean).length}</strong> currently in happy hour
        </h3>
      </div>

      {/* Instructions */}
      {establishments.length === 0 && (
        <div
          css={{
            marginTop: 24,
            padding: 20,
            backgroundColor: theme.lightGrout,
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <p css={{ fontSize: 16, marginBottom: 8 }}>
            No establishments with location data yet.
          </p>
          <p css={{ fontSize: 14, color: theme.black, opacity: 0.7 }}>
            Add a <code>location</code> field with <code>lat</code> and <code>lng</code> to your Sanity
            establishments to see them on the map!
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPage;
