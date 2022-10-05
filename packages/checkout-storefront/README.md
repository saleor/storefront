# Saleor Checkout

Checkout Storefront is a component used for connecting Saleor based storefronts with checkout logic.

## Project structure

### URL structure

The supported query parameters are:

- locale - locale, passed from storefront to checkout, will be used to display messages in the correct language
- checkout - checkout id, it will be provided when transitioning from the cart to checkout
- channel - channel slug for which we've created the checkout for

An example URL can look something like this:

```
https://example-saleor-app.com?locale=pl-PL&checkout=Q2hlY2tvdXQ6ZTcwZjBlYzgtOWMyMS00Y2FkLWE4YzktZWQ3ODcwYjNhN2I5&channel=channel-pln
```

### API requests and types

Checkout uses `urql` for all GraphQL queries and mutations. Queries and mutations are split between `checkout.graphql`, `order.graphql`. To add a query or mutation, go to the respective file and add your code there. Then generate typescript types by running:

```bash
$ pnpm generate
```

Use fragments for repetitive data or fragment types generation e.g. `AddressFragment`.

Rest requests are defined in `src/fetch/requests.ts` and all use `useFetch` hook defined in `hooks` directory.

### Theming and styles

You can configure your styling (colors, font sizes, etc.) in your `checkout configuration app` (called saleor-app-checkout in this repository). The branding config is being fetched from the checkout app in `AppConfigProvider` as a `AppConfig` object. Then the styles are parsed and injected into the css. Check implementation of AppConfigProvider.

Checkout uses [tailwindcss](https://tailwindcss.com/) for styling. You can find Tailwind config in `tailwind.config.js`. In the config, the css variables are mapped to Tailwind styles like so:

```js
border: {
  primary: "rgba(var(--border-color-primary-rgb), 0.4)",
  secondary: "rgba(var(--border-color-primary-rgb), 0.15)",
}
```

### Forms and error handling

Checkout uses [React Hook Form](https://react-hook-form.com/) for forms handling, with [yup](https://github.com/jquense/yup) as validation library.

There is a top level `ErrorsProvider` for global error handling. It keeps an object of all errors from forms and api requests based on `ErrorScope` respective to the given code section e.g `checkoutShippingUpdate` or `userRegister`. Components can access selected errors using `useErrors` hook with provided scope.
