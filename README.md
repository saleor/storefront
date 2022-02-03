# saleor-checkout

Extensible, powerful checkout powered by Saleor API.


## Setup

This monorepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager.

### Monorepo structure

- `apps/checkout`: a React 18 checkout app, ready to be extended/modified
- `packages/config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `packages/tsconfig`: `tsconfig.json`s used throughout the monorepo


### Build

To build all apps and packages, run the following command:

```
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
yarn run dev
```
