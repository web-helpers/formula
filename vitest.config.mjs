import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    globals: true,
    // Use browser mode with Playwright for DOM testing
    browser: {
      enabled: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
      provider: playwright(),
      headless: true,
    },
    include: ['packages/formula/src/**/*.spec.mjs'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/formula/src/**/*.mjs'],
      exclude: ['packages/formula/src/**/*.spec.mjs'],
    },
  },
});
