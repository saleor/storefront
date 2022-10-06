# Development

## Structure

This repository is a monorepo built with [Turborepo](https://turborepo.org/). Here's the list of all the apps and packages in it (each app has its own README):

### Apps

- [`apps/storefront`](../apps/storefront/README.md): Next.js e-commerce storefront starter pack
- [`apps/saleor-app-checkout`](../apps/saleor-app-checkout/README.md): a Next.js Saleor app with a dashboard for managing settings and theme, backend for Checkout, and the Checkout Storefront – ready to be extended/modified

### Packages

- [`packages/ui-kit`](../packages/ui-kit): UI kit for Storefront and Checkout
- [`packages/eslint-config-checkout`](../packages/eslint-config-checkout): `eslint` configuration
- [`packages/tsconfig`](../packages/tsconfig): `tsconfig.json`s used throughout the monorepo
- [`packages/checkout-storefront`](../packages/checkout-storefront): Checkout storefront component
- [`packages/checkout-common`](../packages/checkout-common): Common types and utils
- [`packages/env-vars`](../packages/env-vars): Importing env vars across packages

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

For development instructions, please go to [apps/saleor-app-checkout/README.md](../apps/saleor-app-checkout/README.md).

#### [`checkout-storefront`](../packages/checkout-storefront/README.md)

For development instructions, please go to [packages/checkout-storefront/README.md](../packages/checkout-storefront/README.md).

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

## Starting production server

After completing the development, these commands are suitable to start the `storefront` and `saleor-app-checkout` applications in a production-like environment:

```bash
pnpm build
pnpm start
```

Alternatively, you can start a specific application by running either of these commands:

```bash
pnpm start:saleor-app-checkout
```

```bash
pnpm start:storefront
```

Either way, [the applications will start on different ports](#ports).

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

You need to run this command after each change in the `*.graphql` files or when you update your Saleor instance.

### Code formatting

Before committing the code, git pre-hooks will check staged changes for following the code styles. If you would like to format the code by yourself, run the command:

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
