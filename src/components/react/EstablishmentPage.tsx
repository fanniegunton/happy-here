/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import theme from '@styles/theme';
import SanityImage from './SanityImage';
import IconButton from './IconButton';
import Icons from '@lib/icons';
import AmmenityPill from './AmmenityPill';
import { hoursCover } from '@lib/parseHours';
import { getTodayEndTime } from '@lib/getTodayTime';
import { getNextStartTime } from '@lib/getNextStartTime';
import { formatMilitaryTime } from '@lib/formatMilitaryTime';
import {
  MapPin,
  UtensilsCrossed,
  Beer,
  Wine,
  Martini,
  Coffee,
  CupSoda,
  Store,
  TreePalm,
  PawPrint,
  UserRound,
  UsersRound,
  ConciergeBell,
  CalendarCheck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import type { SanityEstablishment } from '@/types/sanity';

interface EstablishmentPageProps {
  establishment: SanityEstablishment;
}

export default function EstablishmentPage({ establishment }: EstablishmentPageProps) {
  const [isHappyHour, setHappyHour] = useState(false);

  useEffect(() => {
    const checkHours = () => {
      setHappyHour(hoursCover(establishment.happyHourTimes ?? [], new Date()));
    };
    checkHours();
    const timer = window.setInterval(checkHours, 30_000);
    return () => window.clearInterval(timer);
  }, [establishment.happyHourTimes]);

  const todayEndTime = getTodayEndTime(establishment.happyHourTimes ?? []);
  const formattedEndTime = todayEndTime !== null ? formatMilitaryTime(todayEndTime) : 'Closed';

  let nextHappyHourDay = '';
  let nextHappyHourTime = '';

  const nextStartDate = getNextStartTime(establishment.happyHourTimes ?? []);
  if (nextStartDate) {
    const militaryTime = nextStartDate.getHours() * 100 + nextStartDate.getMinutes();
    const formattedTime = formatMilitaryTime(militaryTime);
    const now = new Date();
    const dayLabel =
      nextStartDate.toDateString() === now.toDateString()
        ? 'Today'
        : nextStartDate.toLocaleDateString('en-US', { weekday: 'long' });
    nextHappyHourDay = dayLabel;
    nextHappyHourTime = formattedTime;
  }

  const whatWeHaveHere = establishment.whatWeHaveHere ?? [];
  const theSpaceIsLike = establishment.theSpaceIsLike ?? [];
  const hours = establishment.hours ?? [];
  const happyHourTimes = establishment.happyHourTimes ?? [];

  return (
    <div>
      {/* Back button */}
      <a
        href="/"
        css={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: theme.oceanBlue,
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 24,
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        <ArrowLeft size={16} />
        Back to all establishments
      </a>

      <div css={{ maxWidth: 900 }}>
        {/* Title and Happy Hour Status */}
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
            gap: 24,
            [theme.mobile]: {
              flexDirection: 'column',
              gap: 16,
            },
          }}
        >
          <div>
            <h1
              css={{
                fontFamily: theme.fancyFontFamily,
                fontSize: 48,
                fontWeight: 300,
                lineHeight: 1.35,
                margin: '0 0 12px 0',
                [theme.mobile]: {
                  fontSize: 32,
                },
              }}
            >
              {establishment.name}
            </h1>
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: theme.black,
                fontSize: 18,
              }}
            >
              <MapPin size={20} />
              {establishment.neighborhood}
            </div>
          </div>

          {/* Happy Hour Status Badge */}
          {isHappyHour ? (
            <div
              css={{
                backgroundColor: theme.oceanBlue,
                color: theme.white,
                padding: '16px 24px',
                borderRadius: 12,
                textAlign: 'center',
                fontWeight: 600,
                minWidth: 200,
              }}
            >
              <div
                css={{
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  opacity: 0.9,
                  marginBottom: 4,
                }}
              >
                It's Happy Hour!
              </div>
              <div css={{ fontSize: 18 }}>Until {formattedEndTime}</div>
            </div>
          ) : (
            <div
              css={{
                backgroundColor: theme.lightGrout,
                color: theme.black,
                padding: '16px 24px',
                borderRadius: 12,
                textAlign: 'center',
                fontWeight: 600,
                minWidth: 200,
              }}
            >
              <div
                css={{
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  opacity: 0.7,
                  marginBottom: 4,
                }}
              >
                Next Happy Hour
              </div>
              <div css={{ fontSize: 16 }}>
                {nextHappyHourDay}
                <br />
                {nextHappyHourTime}
              </div>
            </div>
          )}
        </div>

        {/* Hero Image */}
        {establishment.photo && (
          <SanityImage
            image={establishment.photo}
            width={900}
            height={400}
            alt={`Photo of ${establishment.name}`}
            style={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              borderRadius: 20,
              marginBottom: 24,
            }}
          />
        )}

        {/* Contact Icons */}
        <div
          css={{
            display: 'flex',
            gap: 16,
            marginBottom: 24,
            paddingBottom: 24,
            borderBottom: `2px solid ${theme.lightGrout}`,
          }}
        >
          {establishment.happyHourMenu && (
            <IconButton
              icon={Icons.Menu}
              href={establishment.happyHourMenu}
              target="_blank"
              rel="noopener noreferrer"
              css={{ transform: 'scale(1.3)' }}
            />
          )}
          {establishment.website && (
            <IconButton
              icon={Icons.Website}
              href={establishment.website}
              target="_blank"
              rel="noopener noreferrer"
              css={{ transform: 'scale(1.3)' }}
            />
          )}
          {establishment.instagram && (
            <IconButton
              icon={Icons.Instagram}
              href={establishment.instagram}
              target="_blank"
              rel="noopener noreferrer"
              css={{ transform: 'scale(1.3)' }}
            />
          )}
        </div>

        {/* Main Content Grid */}
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 32,
            [theme.tablet]: {
              gridTemplateColumns: '1fr',
              gap: 24,
            },
          }}
        >
          {/* Left Column - Details */}
          <div>
            {/* Happy Hour Details */}
            {establishment.happyHourDetails && (
              <div css={{ marginBottom: 24 }}>
                <h2
                  css={{
                    fontFamily: theme.fancyFontFamily,
                    fontSize: 28,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Happy Hour Details
                </h2>
                {establishment.happyHourDetails.includes('\n') ? (
                  <ul
                    css={{
                      listStyleType: 'disc',
                      listStylePosition: 'outside',
                      paddingLeft: 20,
                      marginLeft: 0,
                      fontSize: 16,
                      lineHeight: 1.6,
                    }}
                  >
                    {establishment.happyHourDetails
                      .split('\n')
                      .filter(Boolean)
                      .map((line, index) => (
                        <li
                          key={index}
                          css={{
                            marginBottom: 8,
                            paddingLeft: 8,
                          }}
                        >
                          {line}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p css={{ fontSize: 16, lineHeight: 1.6 }}>{establishment.happyHourDetails}</p>
                )}
              </div>
            )}

            {/* Amenities */}
            <div css={{ marginBottom: 24 }}>
              <h2
                css={{
                  fontFamily: theme.fancyFontFamily,
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                What We Have Here
              </h2>
              <div
                css={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {whatWeHaveHere.includes('cocktails') && <AmmenityPill icon={Martini}>Cocktails</AmmenityPill>}
                {whatWeHaveHere.includes('wine') && <AmmenityPill icon={Wine}>Wine</AmmenityPill>}
                {whatWeHaveHere.includes('beer') && <AmmenityPill icon={Beer}>Beer</AmmenityPill>}
                {whatWeHaveHere.includes('food') && <AmmenityPill icon={UtensilsCrossed}>Food</AmmenityPill>}
                {whatWeHaveHere.includes('naDrinks') && <AmmenityPill icon={CupSoda}>NA Drinks</AmmenityPill>}
                {whatWeHaveHere.includes('coffee') && <AmmenityPill icon={Coffee}>Coffee</AmmenityPill>}
                {theSpaceIsLike.includes('indoor') && <AmmenityPill icon={Store}>Indoors</AmmenityPill>}
                {theSpaceIsLike.includes('patio') && <AmmenityPill icon={TreePalm}>Patio</AmmenityPill>}
                {theSpaceIsLike.includes('barSeating') && <AmmenityPill icon={ConciergeBell}>Bar Seats</AmmenityPill>}
                {theSpaceIsLike.includes('dogFriendly') && <AmmenityPill icon={PawPrint}>Dog Friendly</AmmenityPill>}
                {theSpaceIsLike.includes('smallGroups') && <AmmenityPill icon={UserRound}>Up to 4 People</AmmenityPill>}
                {theSpaceIsLike.includes('bigGroups') && <AmmenityPill icon={UsersRound}>4+ People OK</AmmenityPill>}
                {theSpaceIsLike.includes('reservationsRec') && (
                  <AmmenityPill icon={CalendarCheck}>Reso Reco'd</AmmenityPill>
                )}
                {theSpaceIsLike.includes('staffPick') && (
                  <AmmenityPill icon={Sparkles} css={{ background: theme.lemonYellow }}>
                    Staff Pick!
                  </AmmenityPill>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Location & Hours */}
          <div>
            <div
              css={{
                backgroundColor: theme.lightGrout,
                padding: 24,
                borderRadius: 12,
              }}
            >
              <h3
                css={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                Location & Hours
              </h3>

              <div css={{ marginBottom: 16 }}>
                <h4
                  css={{
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    opacity: 0.7,
                    marginBottom: 8,
                  }}
                >
                  Address
                </h4>
                <p css={{ fontSize: 14, textTransform: 'capitalize' }}>{establishment.address}</p>
              </div>

              <div css={{ marginBottom: 16 }}>
                <h4
                  css={{
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    opacity: 0.7,
                    marginBottom: 8,
                  }}
                >
                  Open Hours
                </h4>
                {hours.map((line, index) => (
                  <div key={index} css={{ fontSize: 14, marginBottom: 4 }}>
                    {line}
                  </div>
                ))}
              </div>

              {happyHourTimes.length > 0 && (
                <div>
                  <h4
                    css={{
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      opacity: 0.7,
                      marginBottom: 8,
                    }}
                  >
                    Happy Hour Hours
                  </h4>
                  {happyHourTimes.map((line, index) => (
                    <div key={index} css={{ fontSize: 14, marginBottom: 4 }}>
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
