![Nextjs Storefront](https://user-images.githubusercontent.com/44495184/185616416-2cbd9aa4-d3a1-4a4f-b9b1-cb4b78ad864b.png)

<div align="center">
  <h1>Next.js Storefront</h1>
</div>

<div align="center">
  <p>Open-source frontend e-commerce platform from the <a href="https://github.com/saleor/saleor">Saleor</a> team.</p>
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

## Development

### GraphQL queries

Graphql queries are located under the `./graphql`. We strongly encourage use of [fragments](https://graphql.org/learn/queries/#fragments), which minimizes code duplication and plays nicely with the TypeScript, during transformation of incoming data.

Our client of choice is [Apollo](https://www.apollographql.com/docs/react/), which provides excellent cache and features out of the box. To get fully typed requests and responses, [GraphQL Code Generator](https://www.graphql-code-generator.com/) transforms all `.graphql` files into ready to use hooks. Generated code is located at `./saleor/api.tsx` file.

API endpoint can be configured via `.env` file as described in [docs](docs/configuration.md).

#### Workflow

- Modify or create GraphQL file. For example, new query at `./graphql/queries/FeaturedProducts.graphql`
- Run `pnpm generate` command
- New query will be added to the `./saleor/api.tsx` file
- Import generated hook (`import { useFeaturedProductsQuery } from "@/saleor/api";`) in your component code

Script will start the [GraphQL Code Generator](https://www.graphql-code-generator.com/) in the watch mode, so changes in the queries will be automatically updated.

### React and Next.js code structure

When creating new components, please follow the [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/).

Code for the payment gateways can be found at `./components/checkout/payments`. At the moment we support [Saleor test gateway](https://docs.saleor.io/docs/3.0/developer/available-plugins/dummy-credit-card) and basic flow for Stripe.

#### Routing and urls

Project use [file based routing](https://nextjs.org/docs/routing/introduction). Available routes can be found at `./pages`. Dynamic routes (for example `./pages/product/[slug].tsx`) are generated at build time based on [`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation).

To ensure, that Link components use only the existing URLs with required arguments, we use [pathpida](https://github.com/aspida/pathpida). It is used to automatically generate the `./lib/$path.ts` file with all available routes. File should not be updated manually, instead run:

```bash
pnpm paths
```

Since routes require additional arguments with current locale and channel, you should use `usePaths` hook which will automatically add those. Let's create example component with link to the product page:

```tsx
import Link from "next/link";
import { usePaths } from "@/lib/paths";

export const ProductLinkComponent = () => {
  const paths = usePaths();
  return (
    <Link href={paths.products._slug(line?.variant?.product?.slug).$url()}>
      <a>Product link</a>
    </Link>
  );
};
```

### Saleor Checkout

React Storefront uses the new [Saleor Checkout](../saleor-app-checkout/) for checkout and payments. The setup is as easy as:

1. Deploy Saleor Checkout
2. Set the `NEXT_PUBLIC_CHECKOUT_URL` environment variable with Saleor Checkout URL

### Bundle metrics

If you want to check how your changes impact page size, use command:

```bash
pnpm analyze-build
```

After the build, report will open in your browser.

## Deployment

### Vercel & Netlify

This application is optimized for deployments on Vercel and Netlify. You can use the following deploy buttons

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsaleor%2Freact-storefront&project-name=my-react-storefront&repo-name=my-react-storefront)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/saleor/react-storefront)

or, configure it directly in the respective cloud provider.

### Heroku

For Heroku, you need to specify a LTS version of Node.js in your `package.json` explicitly. Add the following snippet in `package.json`:

```json
"engines": {
  "node": ">=14 <17",
  "npm": ">=6.11.0 <8"
}
```

We don't add this in this codebase as we prefer to target the latest Node.js version.
