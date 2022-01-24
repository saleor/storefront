# saleor-checkout

Extensible, powerful checkout distributed as a React npm package.


## Setup

This monorepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager.

### Monorepo structure

- `checkout`: a React checkout component library
- `nextjs`: an example [Next.js](https://nextjs.org) app that uses @saleor/checkout package
- `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo


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
