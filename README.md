# saleor-checkout

Extensible, checkout and payment integrations powered by Saleor API.

## Setup

This monorepo uses [PNPM](https://pnpm.io/) as a package manager and [Turborepo](https://turborepo.org/) for building packages.

### Monorepo structure

Here's the list of each app and shared package in the monorepo (click to see a README of that project)

#### Apps

- [`apps/saleor-app-checkout`](apps/saleor-app-checkout/README.md): a Next.js Saleor app with dashboard for managing settings and theme, backend for Checkout, and the Checkout Storefront – ready to be extended/modified
- [`apps/checkout`](apps/checkout/README.md): an SPA React 18 checkout app, currently deprecated (kept for backward compatibility)

#### Packages

- `packages/ui-kit`: UI kit for checkout and [React Storefront](https://github.com/saleor/react-storefront)
- `packages/config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `packages/tsconfig`: `tsconfig.json`s used throughout the monorepo
- `packages/checkout-storefront`: Checkout store front component
- `packages/checkout-common`: Common types and utils

### Install dependencies

```
pnpm i
```

### Build

To build all apps and packages, run the following command:

```
pnpm run build
```

You can also build a specific app or package by running this command:

```bash
pnpm run build --filter=checkout
```

In this example, we'll only build `apps/checkout`

### Develop Saleor App

Create a tunnel for `saleor-app-checkout`:

```bash
cd apps/saleor-app-checkout && npx saleor app tunnel 3001
```

> Note: the process needs to be running in the background

Before you start the server, you need to change default environment variables. Create `.env.local` file in each app:

- [`apps/saleor-app-checkout`](./apps/saleor-app-checkout/README.md#env-variables)

To run the development server for all the apps, use the following command:

```
pnpm run dev --filter=saleor-app-checkout...
```

### Develop Checkout Storefront

When in dev, a special development server is also running for `checkout-storefront` on port 3002. Check out [localhost:3002?checkout=<ID>](http://localhost:3002?checkout=) and add the your token to the url.

### Other

You can also run only a specific app by running this command:

```bash
cd apps/checkout && pnpm dev
```

## Deployment

### GraphQL Schema

To generate GraphQL code based on latest schema from Saleor instance defined in `SALEOR_API_URL` env variable run this command:

```
pnpm run generate
```

You need to run this command after each change in `*.graphql` files

### Env variables

Change environment variables inside `.env` file:

- `SALEOR_API_URL` — GraphQL endpoint of your Saleor

  Example:

  ```
  https://my-env.eu.saleor.cloud/graphql/
  ```

  > To run sandbox Saleor environment in [Saleor Cloud](https://cloud.saleor.io/) use this command:
  >
  > ```bash
  > npx saleor project create && npx saleor environment create
  > ```
  >
  > You can also run Saleor locally. See [Saleor docs](https://docs.saleor.io/docs/3.x/developer/installation) for more instructions

- `CHECKOUT_APP_URL` — URL of deployed Checkout App

  Example:

  ```
  https://saleor-app-checkout.vercel.app
  ```

  > See [guide below](#vercel) on how to deploy the Checkout App

There are more environment variables available in each app. Go to their README's to learn more

### Vercel

Read Vercel deployment guide in [docs/vercel.md](./docs/vercel.md)

## Payment gateways configuration

Checkout app supports two payment gateways that you can configure:

<a href="https://www.mollie.com/en">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/logos/mollie_light.svg">
    <source media="(prefers-color-scheme: light)" srcset="./docs/logos/mollie_dark.svg">
    <img alt="Mollie" src="./docs/logos/mollie_dark.svg">
  </picture>
</a>

<br>

[![Adyen](./docs/logos/adyen.svg)](https://www.adyen.com/)

Payment gateways can be configured in the Checkout app inside Saleor dashboard.
Go to **Apps > Third party apps > Checkout**.

You can toggle, which payment gateway handles each different payment options per channel:

![Configuration options: Credit Card, Apple Pay, PayPal that are available in checkout app dashboard](./docs/screenshots/config-dashboard-1.png)

To use payment gateway, you need to provide its credentials. You can do that by clicking settings icon in channel configuration page

![Payment gateway configuration in Saleor dashboard](./docs/screenshots/config-dashboard-2.png)

### Mollie

Read setup guide in [docs/mollie.md](./docs/mollie.md)

### Adyen

Read setup guide in [docs/adyen.md](./docs/adyen.md)

## FAQ

Read FAQ in [docs/faq.md](./docs/faq.md)

## Ports

- apps/react-storefront: 3000
- apps/saleor-app-checkout: 3001
- packages/checkout-storefront: 3002
- apps/checkout: 3003
- packages/ui-kit storybook: 6006
