# Saleor Checkout

Saleor checkout is a [CRA](https://create-react-app.dev/) for connecting Saleor based storefronts with checkout logic.

## Local development

First, setup necessary [environment variables](#env-variables):

```
cp .env.template .env.local
```

Fill out each empty env variable in `.env.local` file

> Note: For development environment variables are applied in this order:
>
> - `.env`
> - `.env.local`

Install packages:

```bash
$ pnpm i
```

And run the development server:

```bash
$ pnpm dev
```

You'll need a token to use the checkout. A new checkout session can be generated either in your storefront or in the GraphQL Playground. You could use a preexisting checkout as well.

> ⚠️ Note that if a given checkout has customer already attached, it'll become private, and **you won't be able to fetch its data from the api** without the same customer being logged in your current browser. Checkout uses [Saleor SDK](https://github.com/saleor/saleor-sdk) for authentication.

To generate checkout in GraphQL API and retrieve its `id`:

```graphql
mutation {
  checkoutCreate(
    input: {
      channel: "default-channel"
      lines: [{ variantId: "UHJvZHVjdFZhcmlhbnQ6MjAz", quantity: 1 }]
    }
  ) {
    checkout {
      id
    }
  }
}
```

Learn more about creating checkout sessions in [Saleor docs](https://docs.saleor.io/docs/3.x/developer/checkout#creating-a-checkout-session)

Open [localhost:8001?checkout=<ID>](http://localhost:8001?checkout=) with your browser and add the your token to the url.

## Project structure

### API requests and types

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

## Env variables

By default those environment variables values are taken from `.env` file in root of monorepo. If you want to customise them, you can add a separate `.env.local` file in this app's folder, which won't be stored in git repository

Checkout uses the following environment variables:

- `REACT_APP_CHECKOUT_APP_URL` — URL of the deployed [Checkout App](../checkout-app/README.md)

> Example:
>
> ```
> REACT_APP_CHECKOUT_APP_URL=https://saleor-checkout-app.vercel.app
> ```

- `REACT_APP_SALEOR_API_URL` — URL of Saleor GraphQL API endpoint

> **PROTIP 💡**: If you need Saleor instance for tesitng, create one using [Saleor CLI](https://github.com/saleor/saleor-cli):
>
> ```bash
> npx saleor project create && npx saleor environment create
> ```
>
> This will create new Saleor sandbox in [Saleor Cloud](https://cloud.saleor.io/)
>
> ⚠️ You need to use the same Saleor instance in `checkout-app`. Make sure you have the same value of `NEXT_PUBLIC_SALEOR_API_URL` variable in `apps/checkout-app/.env.local`
