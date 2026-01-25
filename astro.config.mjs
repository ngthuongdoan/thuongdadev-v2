// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'https://thuongda.dev',
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],

  experimental: {
    fonts: [{
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist",
      fallbacks: ["Inter", "sans-serif"],
    }]
  },

  adapter: node({
    mode: "standalone"
  })
});