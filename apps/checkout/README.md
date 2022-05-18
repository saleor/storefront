# Saleor Checkout

Saleor checkout is a [CRA](https://create-react-app.dev/) for connecting Saleor based storefronts with checkout logic.

## Local development

First, setup necessary environment variables:

```
REACT_APP_CHECKOUT_APP_URL=https://your-checkout-app-url.app/api
REACT_APP_SALEOR_API_URL=https://your-saleor-instance.saleor.cloud/graphql/
```

Install packages:

```bash
$ pnpm i
```

And run the development server:

```bash
$ pnpm dev
```

You'll need checkout token in order to use the checkout. You can generate new checkout either in your storefront or graphql playground. You can use a preexisting checkout as well.

> ⚠️ Note that if a given checkout has customer already attached, it'll become private and **you won't be able to fetch its data from the api** without the same customer being logged in your current browser. Checkout uses [Saleor SDK](https://github.com/saleor/saleor-sdk) for authentication.

Open [localhost:8001?checkoutToken=yourToken](http://localhost:8001?checkoutToken=) with your browser and add the your token to the url.

## Project structure

### Api requests and types

Checkout uses urql for all graphql queries and mutations. Queries and mutations are split between `checkout.graphql`, `order.graphql`. To add a query or mutation, go to respective file and add your code there. Then generate typescript types by running:

```bash
$ pnpm generate
```

Use fragments for repetitive data or fragment types generation e.g. `AddressFragment`.

Rest requests are defined in `src/fetch/requests.ts` and all use `useFetch` hook defined in `hooks` directory.

### Theming and styles

You can configure your styling (colors, font sizes, etc.) in your `checkout configuration app` (called checkout-app in this repository). The branding config is being fetched from the checkout app in `AppConfigProvider` as a `AppConfig` object. Then the styles are parsed and injected into the css. Check implementation of AppConfigProvider.

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
