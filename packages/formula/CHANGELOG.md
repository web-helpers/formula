# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Implementation of [Svelte Formula](https://www.npmjs.com/package/svelte-formula) in Vanilla JS, the library is still shiped as the main package
- Created a new `<formula-form>` web component that can be wrapped around a form element, or a container with a form and will create a reactive form using `nanostores`
- New subscription events on the `formula-form` web component that can be subscribed to.  Please note these events are subject to change in future APIs

#### Events

| Event          | Detail                    | Description                                                                                                                    |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `dirty`        | `Record<string, boolean>` | Fired when the dirty store is updated                                                                                          |
| `enrichment`   | `Record<string, any>`     | Fired when the enrichment store is updated                                                                                     |
| `form:connect` | `FormulaForm`             | Fired when the form instance is initialised, returns the form instance                                                         |
| `form:init`    | `Formula`                 | Fired when the formula instance is initialised, returns the formula instance                                                   |
| `form:submit`  | `Record<string, any>`     | Fired when the form is submitted if `data-handle-submit` is set on the web component, otherwise the form will submit as normal |
| `formReady`    | `boolean`                 | Fired when the formReady store is updated                                                                                      |
| `formValid`    | `boolean`                 | Fired when the formValid store is updated                                                                                      |
| `formValidity` | `Record<string, any>`     | Fired when the formValidity store is updated                                                                                   |
| `formValues`   | `Record<string, any>`     | Fired when the formValues store is updated                                                                                     |
| `postChanges`  | `(values) => void`        | Fired after a change is made to the form stores update, contains the latest form state                                         |
| `preChanges`   | `function`                | Fired before a change is made to the form stores update, useful for UI changes                                                 |
| `submitValues` | `Record<string, any>`     | Fired when the submitValues store is updated                                                                                   |
| `touched`      | `Record<string, boolean>` | Fired when the touched store is updated                                                                                        |
| `validity`     | `Record<string, any>`     | Fired when the validity store is updated                                                                                       |


### Changed

- Switched Svelte stores to [nanostores](https://www.npmjs.com/package/nanostores)
- `isFormReady` subscription is now `formReady`
- `isFormValid` subscription is now `formValid`