# saleor-checkout

Extensible, powerful checkout powered by Saleor API.

## Setup

This monorepo uses [PNPM](https://pnpm.io/) as a package manager.

### Monorepo structure

- `apps/checkout`: a SPA React 18 checkout app, ready to be extended/modified
- `apps/checkout-app`: a Next.js checkout dashboard + payments app, ready to be extended/modified
- `packages/ui-kit`: UI kit for checkout and (React Storefront)[https://github.com/saleor/react-storefront]
- `packages/config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `packages/tsconfig`: `tsconfig.json`s used throughout the monorepo

### Install
```
pnpm i
```

### Build

To build all apps and packages, run the following command:

```
pnpm run build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm run dev
```
