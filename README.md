# React Storefront

React Storefront is an open-source frontend e-commerce platform from the [Saleor](https://saleor.io) team.

* Next.js
* TypeScript
* GraphQL

## Motivation

* modern & fast
* easily customizable
* works out-of-the-box
* all-in-one solution

## Setup

Install dependencies:

```bash
pnpm i
```

Start the dev server:

```bash
npm run dev
```

If you modify GraphQL files and would like to update the hooks, run:

```bash
npm run generate
```

Script will start the [GraphQL Code Generator](https://www.graphql-code-generator.com/) in the watch mode, so changes in the querries will be automatically updated.


## Configuration

The `.env` file contains environment variables used by the application. You can override them by creating `.env.local` file.

[Read more](https://nextjs.org/docs/basic-features/environment-variables)

## Debugging using VS Code

The repository contains ready to use VS Code debugger configuration (`.vscode/launch.json`).

Start server in debug mode

```bash
npm run debug
```

Add [breakpoints](https://code.visualstudio.com/docs/editor/debugging#_breakpoints), and start debugging session in your editor.

## VS Code GraphQL Extension

GraphQL extension for VSCode adds syntax highlighting, validation, and language features like go to definition, hover information and autocompletion for graphql projects. This extension also works with queries annotated with gql tag.

VS Marketplace [link](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)
