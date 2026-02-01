import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  output: 'static', // SSG like Gatsby
  integrations: [
    react({
      // Enable Emotion support in React components
      experimentalReactChildren: true
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  vite: {
    ssr: {
      // Prevent these packages from being externalized during SSR
      noExternal: ['@emotion/react', '@emotion/styled', 'react-leaflet', 'leaflet']
    },
    optimizeDeps: {
      include: ['react-leaflet', 'leaflet']
    },
    resolve: {
      alias: {
        '@babel/runtime/helpers/extends': '@babel/runtime/helpers/esm/extends'
      }
    }
  }
});
