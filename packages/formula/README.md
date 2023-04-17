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
        console.log(e.detail);
    });
</script>
```

Now you can use the `formula-webcomponent` to wrap any existing form:

```html
<formula-webcomonent>
    <form id="customer-form" method="POST" action="/customer/manage">

    </form>
</formula-webcomponent>
```