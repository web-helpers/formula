import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Formula',
  description: 'A form state library for static HTML forms',
  vite: {
    resolve: {
      alias: {
        '@webhelpers/formula': resolve(__dirname, '../../formula/dist/index.mjs'),
      },
    },
    optimizeDeps: {
      include: ['@webhelpers/formula'],
    },
    ssr: {
      noExternal: ['@webhelpers/formula'],
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Formula Examples', link: '/docs/formula-examples' },
      { text: 'VitePress Examples', link: '/docs/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Home', link: '/docs/index' },
          { text: 'Basic Form', link: '/docs/basic-form' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/web-helpers/formula' }],
  },
});
