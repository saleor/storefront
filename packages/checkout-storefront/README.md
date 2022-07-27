# Saleor Checkout

Checkout Storefront is a component used for connecting Saleor based storefronts with checkout logic.

## Project structure

### API requests and types

Checkout uses urql for all graphql queries and mutations. Queries and mutations are split between `checkout.graphql`, `order.graphql`. To add a query or mutation, go to respective file and add your code there. Then generate typescript types by running:

```bash
$ pnpm generate
```

Use fragments for repetitive data or fragment types generation e.g. `AddressFragment`.

Rest requests are defined in `src/fetch/requests.ts` and all use `useFetch` hook defined in `hooks` directory.

### Theming and styles

You can configure your styling (colors, font sizes, etc.) in your `checkout configuration app` (called saleor-app-checkout in this repository). The branding config is being fetched from the checkout app in `AppConfigProvider` as a `AppConfig` object. Then the styles are parsed and injected into the css. Check implementation of AppConfigProvider.

Checkout uses [tailwindcss](https://tailwindcss.com/) for styling. You can find tailwind config in `tailwind.config.js`. In the config, the css variables are mapped to tailwind styles like so:

```js
border: {
  primary: "rgba(var(--border-color-primary-rgb), 0.4)",
  secondary: "rgba(var(--border-color-primary-rgb), 0.15)",
}
```

### Forms and error handling

Checkout uses [React Hook Form](https://react-hook-form.com/) for forms handling, with [yup](https://github.com/jquense/yup) as validation library.

There is a top level `ErrorsProvider` for global error handling. It keeps an object of all errors from forms and api requests based on `ErrorScope` respective to the given code section e.g `checkoutShippingUpdate` or `userRegister`. Components can access selected errors using `useErrors` hook with provided scope.
