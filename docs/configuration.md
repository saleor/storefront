# Configuration

## Environment variables

SRS is built using Next.js framework which comes with complete workflow for working with environment variables. You can read more at [documentation](https://nextjs.org/docs/basic-features/environment-variables) pages.

All of the options available to change via environment variables can be found in `.env` file.

### Example - Changing the API URI

For local development we are recommending configuration via `.env.local` file:

1. Create `.env.local` in the root of the project
2. Add entry `NEXT_PUBLIC_API_URI=https://my-saleor-instance/graphql/`
3. If dev server was running, new values will be loaded after the server restart

To ensure that local configuration will not be exposed, `.env.local` file is ignored by Git.

For application deployments we suggest to setup environment variables instead of files. Depending of hosting provider, the way you can set them vary. In case of using Vercel, related documentation can be found [here](https://vercel.com/docs/concepts/projects/environment-variables).

## Changing available channels

List of available channels can be changed by adding new entries to `CHANNELS` constant located in the `lib/regions.ts` file.

## Languages

To configure available languages, read [translation](docs/translations.md) docs.
