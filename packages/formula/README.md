# @webhelpers/formula

Formula is a Web Component and Library that can be used to make any static HTML 5 form dyanamic by simply wrapping it in
the Formula function. It's based on [Svelte Formula](https://github.com/tanepiper/svelte-formula) but now using [nanostores](https://github.com/nanostores/nanostores)
as it's Subscription store.

> Formula is the first library in [Web Helpers](https://github.com/web-helpers/) - A set of useful developer-first libraries for the web.

## Installing and Usage

To install the library and web component type `npm install @webhelpers/formula` in your project.

### Use as a web component

To use as a web component, import from the package

```html
<script type="module">
  import '@webhelpers/formula/webcomponent';

  const formulaEl = document.querySelector('formula-webcomponent') as HTMLElement;

  // Get the form values via a custom event
  formulaEl.addEventListener('formValues', (e: any) => {
      const { userName } = e.detail
      console.log(`Hello ${userName}`);
  });
</script>
```

Now you can use the `formula-webcomponent` to wrap any existing form:

```html
<formula-webcomponent>
  <form id="customer-form" method="POST" action="/customer/manage">
    <label for="userName">User Name</label>
    <input id="userName" name="username" type="text" required />
  </form>
</formula-webcomponent>
```

### Attributes

| Attribute         | Type                  | Default     | Description                                                                                         |
| ----------------- | --------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `formula-options` | `string \| undefined` | "undefined" | The options to pass to the formula instance                                                         |
| `handle-submit`   | `boolean`             | true        | If Formula should handle the form submission                                                        |
| `root-selector`   | `string \| undefined` | "undefined" | The root selector to use to find the form element, if not set, the first child element will be used |

## Events

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
