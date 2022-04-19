# Configuration

## Environment variables

SRS is built using the Next.js framework. It comes with a complete workflow for working with environment variables. You can read more at these [documentation](https://nextjs.org/docs/basic-features/environment-variables) pages.

All available options to change via environment variables can be found in the `.env` file.

### Example - Changing the API URI

For local development, we recommend configuration via the `.env.local` file:

1. Create `.env.local` in the root of the project
2. Add entry `NEXT_PUBLIC_API_URI=https://my-saleor-instance/graphql/`
3. If dev server was running, new values will be loaded after the server restart

Git ignores the `.env.local` file to ensure that the local configuration is not exposed.

For application deployments, we suggest setting environment variables instead of files. The way you can set them varies depending on the hosting provider. In the case of using Vercel, related documentation can be found [here](https://vercel.com/docs/concepts/projects/environment-variables).

## Changing available channels

The list of available channels can be changed by adding new entries to the `CHANNELS` constant located in the `lib/regions.ts` file.

## Languages

To configure available languages, read [translation](docs/translations.md) docs.

## Homepage

The homepage will show content blocks based, by default, on the Menu object fetched from the API. Slug of the object can be configured with the `NEXT_PUBLIC_HOMEPAGE_MENU` variable.
