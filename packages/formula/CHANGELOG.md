# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
