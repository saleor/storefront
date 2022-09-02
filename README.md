![Nextjs Storefront](https://user-images.githubusercontent.com/44495184/185616229-5eadcddb-9170-404f-be57-91c66ffe3bae.png)

<div align="center">
  <h1>Next.js Storefront</h1>
</div>

<div align="center">
  <p><b>Next.js Storefront</b>: Your open-source frontend starter pack for building performant e-commerce experiences with <a href="https://github.com/saleor/saleor">Saleor</a>.
  <p><b>Saleor Checkout</b>: Extensible Next.js checkout application and payment integrations powered by Saleor API.</p>
</div>

<div align="center">
  <a href="https://saleor.io/">🏠 Website</a>
  <span> • </span>
  <a href="https://docs.saleor.io/docs/3.x/">📚 Docs</a>
  <span> • </span>
  <a href="https://saleor.io/blog/">📰 Blog</a>
  <span> • </span>
  <a href="https://twitter.com/getsaleor">🐦 Twitter</a>
</div>

<div align="center">
  <a href="https://demo.saleor.io/">▶️ Demo</a>
   <span> • </span>
  <a href="https://githubbox.com/saleor/react-storefront">🔎 Explore Code</a>
</div>

## Motivation

🏎️ **modern & fast**:
The project utilizes all the best practices for e-commerce, like SSR, ISR, and image optimization.

💳 **integrated payments**: 
Reduce the purchase friction by taking advantage of integrations with modern payment providers such as Adyen or Mollie.

🛠️ **easily customizable**:
TailwindCSS can be easily extended and tweaked, or completely replaced with your favorite CSS solution.

👌 **works out-of-the-box**:
Pre-configured tools built with DX in mind.

## Stack

- Next.js
- TypeScript
- GraphQL with Apollo Client
- Tailwind CSS
- Saleor Checkout

## Quickstart

Supercharge your development with our CLI tool and free developer account at [Saleor Cloud](https://cloud.saleor.io/). To download and install Saleor CLI, run the following command:

```
npm i -g @saleor/cli
```

[Learn more about Saleor CLI](https://docs.saleor.io/docs/3.x/cli)

Set up your local storefront development environment by running the `storefront create` command. It will take you through the process of creating a new Saleor API instance (or choosing an existing one) and connecting it to your freshly cloned local storefront setup:

```
saleor storefront create
```

If you don't want to customize available options, you can also spawn a fully functional local storefront development environment using `--demo` attribute:

```
saleor storefront create --demo
```

---

## Development
First install [`pnpm`](https://pnpm.io/) (an alternative to `npm`, focused on performance) globally:
```
npm install -g pnpm
```

Then install dependencies:
```
pnpm i
```

To start the servers, run:
```
pnpm dev
```

[The command will boot up 4 applications running on different ports](./docs/development.md#ports).

Read more about development in [docs/development.md](./docs/development.md).

## Payment gateways

Saleor App Checkout supports two configurable payment gateways:

<a href="https://www.mollie.com/en">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/logos/mollie_light.svg">
    <source media="(prefers-color-scheme: light)" srcset="./docs/logos/mollie_dark.svg">
    <img alt="Mollie" src="./docs/logos/mollie_dark.svg">
  </picture>
</a>

<br>

[![Adyen](./docs/logos/adyen.svg)](https://www.adyen.com/)

For further information, please go to [docs/payment/index.md](./docs/payment/index.md).

## Deployment

Read Vercel deployment guide in [docs/vercel.md](./docs/vercel.md)

## FAQ

Read FAQ in [docs/faq.md](./docs/faq.md)
