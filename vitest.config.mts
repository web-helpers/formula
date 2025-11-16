import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 10000, // 10 second timeout per test
    hookTimeout: 10000, // 10 second timeout for hooks
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
    include: ['packages/formula/src/**/*.spec.mts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/formula/src/**/*.mts'],
      exclude: ['packages/formula/src/**/*.spec.mts'],
    },
  },
});
