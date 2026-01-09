# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-01-09

### Added

- Comprehensive real browser test suite with Vitest and Playwright browser provider
  - **163 test cases across 14 test files** covering most form functionality in the HTML spec
  - Tests for memory leaks, state mutations, race conditions, and edge cases
  - New test files: `extract.spec.mjs` (16 tests), `group.spec.mjs` (12 tests), `form.spec.mjs` (35 tests), `init.spec.mjs` (14 tests), `index.spec.mjs` (20 tests - webcomponent), `lib.spec.mjs` (5 tests - webcomponent)
  - Enhanced test files: `dirty.spec.mjs` (6 tests), `enrichment.spec.mjs` (4 tests), `event.spec.mjs` (26 tests), `errors.spec.mjs` (6 tests), `touch.spec.mjs` (3 tests), `fields.spec.mjs` (2 tests), `stores.spec.mjs` (6 tests), `aria.spec.mjs` (8 tests)
- Vite build system with Rollup bundler
  - Module bundling with tree-shaking and optimization
  - Source maps for debugging
  - Preserved module structure for better code splitting
  - Watch mode for development (`npm run dev`)
  - Build produces ~20KB total (~8KB gzipped)

### Changed

- **BREAKING**: Updated package exports to point to `dist/` folder instead of source files
  - Main export: `./index.mjs` → `./dist/index.mjs`
  - Webcomponent export: `./src/lib/webcomponent/index.mjs` → `./dist/src/lib/webcomponent/index.mjs`
- Updated all dependencies to latest versions:
  - TypeScript: 5.0.4 → 5.9.3
  - @playwright/test: 1.32.3 → 1.56.1
  - nanostores: >=0.8.0 → >=1.0.1
  - eslint: ~8.36.0 → ~9.39.1
  - prettier: ~2.8.7 → ~3.6.2
- Updated Node.js requirement: 18.15.0 → >=20.19.5
- Updated npm requirement: (none) → >=10.8.2
- Build process now uses Vite instead of plain TypeScript compiler
- Test infrastructure migrated from Jest to Vitest with Playwright
- **Documentation site migrated from Astro to VitePress** for better performance and developer experience
- Improved event handler implementation in `event.mjs` for better reliability
- Enhanced form lifecycle management in `form.mjs` with better initialization and reset handling
- Improved web component implementation in `webcomponent/index.mjs` with better event handling and lifecycle management

### Fixed

#### Critical Bugs

- **Memory Leaks**
  - Fixed subscription leak in dirty handler that was never unsubscribed ([#3](packages/formula/src/lib/form/dirty.mjs))
  - Fixed store subscriptions in `FormulaWebComponent` not cleaned up on disconnect ([#4](packages/formula/src/lib/webcomponent/index.mjs))
  - Fixed dirty tracking bug where subscription continuously updated initial values, preventing dirty state detection ([#6](packages/formula/src/lib/form/dirty.mjs))

- **State Mutation Bugs**
  - Fixed enrichment store being overwritten instead of merged, losing other field enrichments ([#5](packages/formula/src/lib/form/event.mjs))
  - Fixed hidden fields state being mutated directly before setting ([#11](packages/formula/src/lib/form/event.mjs))
  - Fixed array state mutations in `group.mjs` breaking reactivity:
    - `setupSubscriptions` method now uses immutable updates ([#8](packages/formula/src/lib/group/group.mjs))
    - `set()` method now uses immutable updates ([#9](packages/formula/src/lib/group/group.mjs))
    - `delete()` method now uses immutable updates ([#10](packages/formula/src/lib/group/group.mjs))

- **Logic Bugs**
  - Fixed incorrect method call `form.form()` → `form.init()` in group.mjs ([#12](packages/formula/src/lib/group/group.mjs))
  - Fixed reduce callback in enrichment.mjs not returning accumulator ([#13](packages/formula/src/lib/form/enrichment.mjs))
  - Fixed race condition in group subscription setup with shared `initial` flag ([#14](packages/formula/src/lib/group/group.mjs))
  - Fixed early return in `cleanupStores` preventing cleanup of touched/dirty/error stores ([#15](packages/formula/src/lib/group/group.mjs))
  - Fixed `aria-checked` being set on all elements instead of only checkboxes/radios ([#16](packages/formula/src/lib/form/aria.mjs))
  - Fixed incorrect store access pattern `stores.formValues.get(name)?.[name]` in extract.mjs ([#7](packages/formula/src/lib/form/extract.mjs))

#### TypeScript Issues

- Removed duplicate `@property validators` typedef in `form.mjs` ([#1](packages/formula/src/lib/form/form.mjs))
- Removed duplicate `@property validators` typedef in `group.mjs` ([#2](packages/formula/src/lib/group/group.mjs))

### Test Improvements

- Fixed async race conditions in event.spec.mjs by using synchronous assertions
- Corrected extract.spec.mjs test expectations to match actual DOM extraction behavior
- Simplified group.spec.mjs race condition test for more reliable validation
- All tests now run in real Chromium browser environment
- Expanded test coverage from initial 76 tests to 163 tests across 14 test files
- Added comprehensive tests for form initialization, reset functionality, and web component behavior

## [0.2.0] - 2023-05-26

### Fixed

- Fixed incorrect store name being called in internal code

## [0.1.1] - 2023-04-23

### Changed

- Fixed export type of `formula` function to include stores
- Change all webcomponent calls until after first frame request, fixes issues with some frameworks
- Updated Readme examples to be more clear
- Cleaned up exports in `package.json`

## [0.1.0] - 2023-04-21

### Added

- Implementation of [Svelte Formula](https://www.npmjs.com/package/svelte-formula) in Vanilla JS, the library is still shiped as the main package and available via `import { formula } from '@webhelpers/formula`
- Created a new `<formula-form>` web component that can be wrapped around a form element, or a container with a form and will create a reactive form using `nanostores`
- New subscription events on the `formula-form` web component that can be subscribed to. Please note these events are subject to change in future APIs

#### Events

| Event              | Detail                    | Description                                                                                                                    |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `form:dirty`       | `Record<string, boolean>` | Fired when the dirty store is updated                                                                                          |
| `form:enrichment`  | `Record<string, any>`     | Fired when the enrichment store is updated                                                                                     |
| `form:connect`     | `FormulaForm`             | Fired when the form instance is initialised, returns the form instance                                                         |
| `form:init`        | `Formula`                 | Fired when the formula instance is initialised, returns the formula instance                                                   |
| `form:submit`      | `Record<string, any>`     | Fired when the form is submitted if `data-handle-submit` is set on the web component, otherwise the form will submit as normal |
| `form:ready`       | `boolean`                 | Fired when the formReady store is updated                                                                                      |
| `form:valid`       | `boolean`                 | Fired when the formValid store is updated                                                                                      |
| `form:validity`    | `Record<string, any>`     | Fired when the formValidity store is updated                                                                                   |
| `form:values`      | `Record<string, any>`     | Fired when the formValues store is updated                                                                                     |
| `form:postChanges` | `(values) => void`        | Fired after a change is made to the form stores update, contains the latest form state                                         |
| `form:preChanges`  | `function`                | Fired before a change is made to the form stores update, useful for UI changes                                                 |
| `submit:values`    | `Record<string, any>`     | Fired when the submitValues store is updated                                                                                   |
| `form:touched`     | `Record<string, boolean>` | Fired when the touched store is updated                                                                                        |
| `form:errors`      | `Record<string, any>`     | Fired when the validity store is updated                                                                                       |

#### Attributes

New attributes that can be used on the web component

| Attribute         | Type                  | Default     | Description                                                                                         |
| ----------------- | --------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `formula-options` | `string \| undefined` | "undefined" | The options to pass to the formula instance                                                         |
| `handle-submit`   | `boolean`             | true        | If Formula should handle the form submission                                                        |
| `root-selector`   | `string \| undefined` | "undefined" | The root selector to use to find the form element, if not set, the first child element will be used |

### Changed

- Switched Svelte stores to [nanostores](https://www.npmjs.com/package/nanostores)
- `isFormReady` subscription is now `formReady`
- `isFormValid` subscription is now `formValid`
