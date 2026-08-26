// @ts-check
import { defineConfig } from 'astro/config';

import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://flyingmachine.github.io',
  base: '/posthog-demo',
  integrations: [
    starlight({
      title: 'PostHog Demo',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/flyingmachine/posthog-demo' },
      ],
      sidebar: [
        {
          label: 'Guide',
          items: [{ autogenerate: { directory: 'guide' } }],
        },
      ],
    }),
  ],
});