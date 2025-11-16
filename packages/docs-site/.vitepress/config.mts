import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Formula',
  description: 'A form state library for static HTML forms',
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => tag === 'formula-form',
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        '@webhelpers/formula/webcomponent': resolve(__dirname, '../../formula/dist/webcomponent.mjs'),
        '@webhelpers/formula': resolve(__dirname, '../../formula/dist/index.mjs'),
      },
    },
    optimizeDeps: {
      include: ['@webhelpers/formula', '@webhelpers/formula/webcomponent'],
    },
    ssr: {
      noExternal: ['@webhelpers/formula', '@webhelpers/formula/webcomponent'],
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/docs/index' },
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Home', link: '/docs/index' },
          {
            text: 'API Reference',
            items: [
              { text: 'formula() Function', link: '/docs/api/formula-function' },
              { text: 'Web Component', link: '/docs/api/web-component' },
              { text: 'Stores Overview', link: '/docs/api/stores' },
            ],
          },
          {
            text: 'Store Details',
            items: [
              { text: 'formValues', link: '/docs/api/store-formValues' },
              { text: 'errors', link: '/docs/api/store-errors' },
              { text: 'touched', link: '/docs/api/store-touched' },
              { text: 'dirty', link: '/docs/api/store-dirty' },
              { text: 'formValid', link: '/docs/api/store-formValid' },
              { text: 'formReady', link: '/docs/api/store-formReady' },
            ],
          },
          {
            text: 'Examples',
            items: [
              { text: 'Basic Form', link: '/docs/basic-form' },
              { text: 'Custom Validation', link: '/docs/custom-validation' },
              { text: 'Dynamic Fields', link: '/docs/dynamic-fields' },
              { text: 'Web Component Usage', link: '/docs/web-component' },
            ],
          },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/web-helpers/formula' }],
  },
});
