# Vercel deployment guide

In this guide we'll deploy Saleor Checkout to production and host it on Vercel.

## Preparations

We assume you've already configured environment variables except `CHECKOUT_APP_URL`, as described [in README](../README.md#env-variables)

The repo needs to be hosted on GitHub or some other git repository. Before you start, fork the repo to your account or organization.

- Authenticate the Turborepo CLI with your Vercel account

```
pnpm dlx turbo login
```

- Link the repo to a Vercel scope to enable the Remote Caching feature

```
pnpm dlx turbo link
```

> Remote Caching drastically reduces build times if you work in a team. Learn more about it at [Turborepo documentation](https://turborepo.org/docs/core-concepts/remote-caching) and [Vercel documentation](https://vercel.com/docs/concepts/monorepos/remote-caching)

## Deploying Checkout App

### 1. Create new project

Start by [creating new project](https://vercel.com/docs/concepts/projects/overview#creating-a-project) on Vercel and select your forked GitHub repo

> Note: Vercel doesn't support importing the entire monorepo at the moment, you will need to set up a project yourself for each app inside `/apps` folder

![Create project on Vercel by selecting your cloned GitHub repository in the menu](./screenshots/setup-vercel-1.png)

### 2. Configuring new project for saleor-app-checkout

On the configuration page:

- Provide your project name (for example `saleor-app-checkout`)
- Select framework to Next.js
- Choose the root directory to be `apps/saleor-app-checkout`
- Override the build command to:

```bash
cd ../.. && pnpm run build:saleor-app-checkout
```

- Add environment variables:
  - `ENABLE_EXPERIMENTAL_COREPACK` with value `1` – this enables the [Corepack](https://vercel.com/docs/concepts/deployments/configure-a-build#corepack) support and is required for the proper pnpm version to be used in Vercel
  - `SETTINGS_ENCRYPTION_SECRET` — Random string used for encrypting apps configuration (you can generate it using `openssl rand -hex 256`)
  - @TODO upstash or FileAPL or env variable?

Here's the final result on configuration page:

![Vercel "Configure project" page with all settings filled out](./screenshots/setup-vercel-2.png)

Click deploy and wait until the app is deployed

### 3. Update environment variables in repository

Update `CHECKOUT_APP_URL` in `.env` file located at the root of monorepo to be your deployment URL

Example:

```
CHECKOUT_APP_URL=https://saleor-app-checkout.vercel.app
```

### 4. Install the app in Saleor

Grab the deployed app URL from Vercel and add `/api/manifest`. This URL points to the manifest file that is required for installing the app in Saleor

> Example manifest URL:
>
> ```
> https://saleor-checkout-xyz-myusername.vercel.app/api/manifest
> ```

You can install the app by using:

- [Saleor Dashboard](https://github.com/saleor/saleor-dashboard)

```
http://<YOUR_SALEOR_URL>/dashboard/apps/install?manifestUrl=<YOUR_MANIFEST_URL>
```

- [Saleor CLI](https://github.com/saleor/saleor-cli)

```
saleor app install
```

- [Saleor Core manage.py script](https://docs.saleor.io/docs/3.x/developer/extending/apps/installing-apps#installing-third-party-apps)
- [Saleor GraphQL API](https://docs.saleor.io/docs/3.x/developer/extending/apps/installing-apps#installation-using-graphql-api)

> **PROTIP 💡**: If you want your app to automatically update whenever you push changes to the `main` branch, make sure to use **production** domain from Vercel (not deployment domain) for your manifest URL.
>
> ❌ Deployment domain (won't update app after push):
>
> ```
> https://saleor-app-checkout-jluy793b2-myusername.vercel.app/api/manifest
> ```
>
> ✅ Production domain:
>
> ```
> https://saleor-app-checkout.vercel.app/api/manifest
> ```
>
> To see which domain is used for production go to [Vercel Dashboard](https://vercel.com) > Settings > Domains:
> ![Vercel dashboard settings page that shows which domain is connected to production deployment](./screenshots/setup-vercel-domain.png)

6. 🥳 Congrats! saleor-app-checkout is now ready to be used!

## Checkout SPA

Checkout SPA (user-facing interface for Checkout) is available on the same URL as the saleor-app-checkout under the `/checkout-spa` path.

## Deploying Storefront SPA

### 1. Create another project on Vercel

Start by creating another project on Vercel [similar to saleor-app-checkout](#2-configuring-new-project-for-saleor-app-checkout).

On the configuration page:

- Provide your project name (for example `saleor-storefront`)
- Select framework to Next.js
- Choose the root directory to be `apps/storefront`
- Override the build command to:

```bash
cd ../.. && pnpm run build:storefront
```
