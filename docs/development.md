# Development

## Structure

This repository is a monorepo. Here's the list of all the apps and packages in it (each app has its own README):

### Apps

- [`apps/storefront`](../apps/storefront/README.md): Next.js e-commerce storefront starter pack
- [`apps/saleor-app-checkout`](../apps/saleor-app-checkout/README.md): a Next.js Saleor app with a dashboard for managing settings and theme, backend for Checkout, and the Checkout Storefront – ready to be extended/modified

### Packages

- `packages/ui-kit`: UI kit for Storefront and Checkout
- `packages/config-checkout`: `eslint` configuration
- `packages/config-storefront`: `eslint` configuration
- `packages/tsconfig`: `tsconfig.json`s used throughout the monorepo
- `packages/checkout-storefront`: Checkout storefront component
- `packages/checkout-common`: Common types and utils

## Getting started

### Prerequisites

This monorepo uses `pnpm` as a package manager, so you will have to install it beforehand. To install it, run:

```bash
npm install -g pnpm
```

### Installing dependencies

To install dependencies, run:

```bash
pnpm i
```

### Running

To start all the dev servers, run:

```bash
pnpm dev
```

[The command will boot up 4 applications running on different ports.](#ports).

You can also start a specific app by running:

```bash
pnpm dev --filter=saleor-app-checkout
```

#### [`saleor-app-checkout`](../apps/saleor-app-checkout/README.md)

First, you need to change the default environment variables. Create `.env.local` file in `apps/saleor-app-checkout`, as described [here](../apps/saleor-app-checkout/README.md#env-variables).

Then, to develop `saleor-app-checkout` app locally, you need to create a tunnel for it. The tunnel will enable you to display it within your Saleor Dashboard.

If you want to read more about Saleor Apps architecture, see [the documentation](https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts).

To create a tunnel, run:

```bash
cd apps/saleor-app-checkout && npx saleor app tunnel 3001
```

> Note: The process needs to be running in the background. Please don't kill it during the development.

<!-- is the bit below correct? you have to filter something to run it for all the apps? -->
<!-- 
To run the development server for all the apps, use the following command:

```
pnpm run dev --filter=saleor-app-checkout...
```
 -->
#### [`checkout-storefront`](../packages/checkout-storefront/README.md)

The URL structure for `checkout-storefront` is `localhost:3002?checkout=<ID>`, which means it requires a checkout id to work correctly. You don't have to supply it manually; it will be provided when transitioning from the cart to checkout.

### Building

To build all apps and packages, run the following command:

```
pnpm run build
```

You can also build a specific app or package by running this command:

```bash
pnpm run build --filter=saleor-app-checkout
```

In this example, we'll only build `apps/saleor-app-checkout`

### Ports

- apps/react-storefront: **http://localhost:3000**
- apps/saleor-app-checkout: **http://localhost:3001**
- packages/checkout-storefront: **http://localhost:3002**
- packages/ui-kit storybook: **http://localhost:6006**

## Other

### GraphQL Schema

To generate GraphQL code based on the latest schema from Saleor instance defined in `SALEOR_API_URL` env variable, run this command:

```
pnpm run generate
```

You need to run this command after each change in the `*.graphql` files.
  
### Code formatting

Before committing the code, Git pre-hooks will check staged changes for following the code styles. If you would like to format the code by yourself, run the command:

```bash
pnpm lint
```
  
### Configuration

Instructions how to configure the application (e.g. change the GraphQL API URL) can be found [here](apps/storefront/docs/configuration.md).

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

- `CHECKOUT_APP_URL` — URL of deployed Saleor App Checkout

  Example:

  ```
  https://saleor-app-checkout.vercel.app
  ```

  > See [guide below](#vercel) on how to deploy the Saleor App Checkout

There are more environment variables available in each app. Go to their README's to learn more.

### Tooling

#### Debugging using VS Code

The repository contains ready-to-use VS Code debugger configuration (`.vscode/launch.json`).

Start server in debug mode

```bash
pnpm debug
```

Add [breakpoints](https://code.visualstudio.com/docs/editor/debugging#_breakpoints), and start debugging session in your editor.

#### VS Code GraphQL Extension

GraphQL extension for VSCode adds syntax highlighting, validation, and language features like go to definition, hover information, and autocompletion for GraphQL projects. This extension also works with queries annotated with `gql` tag.

VS Marketplace [link](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

