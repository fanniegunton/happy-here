/** @jsxImportSource @emotion/react */
import React from 'react';
import theme from '@styles/theme';

export default function AboutPage() {
  return (
    <div
      css={{
        padding: '0 20px',
        maxWidth: 1000,
        [theme.mobile]: {
          margin: '0 30px',
          padding: 0,
        },
      }}
    >
      <h1
        css={{
          ...theme.h1,
          marginBottom: 40,
          [theme.tablet]: { fontSize: 64 },
          [theme.mobile]: { fontSize: 40, paddingTop: 20 },
        }}
      >
        About Happy Here
      </h1>

      <h3 css={{ ...theme.h3, margin: '0 0 20px 0' }}>Built by Locals, for Locals</h3>
      <p css={{ fontFamily: theme.displayFontFamily, fontSize: 20, color: theme.black, lineHeight: 1.375, marginBottom: 20, [theme.mobile]: { fontSize: 16 } }}>
        Happy Here was created by the same team behind Takeout Tracker, the site we (Corey &
        Fannie) launched during the early days of the COVID-19 pandemic to help Austin's independent
        restaurants stay visible and connected to customers. What started as a way to support our
        city's food scene through crisis has evolved into a continued commitment to champion local
        bars, restaurants, and the people behind them.
      </p>

      <h3 css={{ ...theme.h3, margin: '0 0 20px 0' }}>Why Happy Here?</h3>
      <p css={{ fontFamily: theme.displayFontFamily, fontSize: 20, color: theme.black, lineHeight: 1.375, marginBottom: 20, [theme.mobile]: { fontSize: 16 } }}>
        We wanted to make it easier to find great happy hour deals around town—a simple, friendly
        tool to help you discover new places or revisit old favorites without the full-price sting.
        Happy hour is one of the best ways to explore a city's food and drink culture, and we
        believe everyone should have a clear way to see who's offering specials, when, and what they
        include.
      </p>

      <h3 css={{ ...theme.h3, margin: '0 0 20px 0' }}>A Love Letter to the Service Industry</h3>
      <p css={{ fontFamily: theme.displayFontFamily, fontSize: 20, color: theme.black, lineHeight: 1.375, marginBottom: 20, [theme.mobile]: { fontSize: 16 } }}>
        Our passion for this project is rooted in more than just a love of dining out; it's about
        recognizing the heart and hustle behind every menu, every plate, every pour. The work that
        goes into running a great bar or restaurant is enormous—hours of unseen labor, creativity,
        and dedication. Happy Here continues the spirit of Takeout Tracker by giving that hard work
        the respect it deserves.
      </p>

      <h3 css={{ ...theme.h3, margin: '0 0 20px 0' }}>What We Track</h3>
      <p css={{ fontFamily: theme.displayFontFamily, fontSize: 20, color: theme.black, lineHeight: 1.375, marginBottom: 20, [theme.mobile]: { fontSize: 16 } }}>
        On Happy Here, "happy hour" isn't just the classic 4–6 p.m. slot. We track reverse happy
        hours, daily recurring specials (like Wine Down Wednesdays), and brunch discounts too—any
        regular deal you can actually plan your week around. To keep things simple, we have one tile
        for each restaurant location–just expand the arrows for details on specials or for more
        about the location itself.
      </p>

      <h3 css={{ ...theme.h3, margin: '0 0 20px 0' }}>Local-First, Always</h3>
      <p css={{ fontFamily: theme.displayFontFamily, fontSize: 20, color: theme.black, lineHeight: 1.375, marginBottom: 20, [theme.mobile]: { fontSize: 16 } }}>
        We focus on locally owned businesses and Austin-born chains that have stayed true to their
        roots. You won't find big national fast-casual brands on Happy Here, no matter how many
        discounted apps they offer. Our goal is to highlight the places that make Austin unique, not
        just fill space with corporate names.
      </p>

      <h3 css={{ ...theme.h3, margin: '0 0 20px 0' }}>A Small Team with Big Love for Austin</h3>
      <p css={{ fontFamily: theme.displayFontFamily, fontSize: 20, color: theme.black, lineHeight: 1.375, marginBottom: 20, [theme.mobile]: { fontSize: 16 } }}>
        Happy Here is a small project, built and maintained by a tiny team (technically both of us,
        but mostly Fannie this time) with a tight feature list and a lot of heart. We're adding new
        spots all the time and keeping things as up-to-date as we can. If you know a bar or
        restaurant we should check out—or if you spot something that needs a tweak—you can{' '}
        <a href="mailto:happyhappyhere@gmail.com" css={{ textDecoration: 'green wavy underline' }}>
          send us a suggestion
        </a>{' '}
        anytime or{' '}
        <a
          href="https://www.instagram.com/takeouttracker/"
          css={{ textDecoration: 'green wavy underline' }}
        >
          send a DM
        </a>
        . We're always happy to hear from fellow happy hour hunters!
      </p>
    </div>
  );
}
