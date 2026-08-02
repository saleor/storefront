# Configuring Allowed Origins

Storefront uses the following sources (environment variables) to determine whether
a given origin is allowed:

- `NEXT_PUBLIC_STOREFRONT_URL` - the URL where the frontend is hosted. See other
  relevant documents for more info.
- `NEXT_PUBLIC_CHECKOUT_URL` - the URL where the checkout is hosted. See other documents
  for more details.
- `ALLOWED_EXTRA_ORIGINS` - a custom list of additional origins to allow. This is
  comma-separated without any spaces and must contain protocol + hostname + optionally
  the port number.

  For example:

  ```
  ALLOWED_EXTRA_ORIGINS=http://localhost:3000,https://example.com
  ```

**Important:** all these variables are optional. If you are using Vercel, then
you likely do not need to configure anything.

As well as Vercel-specific sources:

- [`VERCEL_PROJECT_PRODUCTION_URL`]
- [`VERCEL_BRANCH_URL`]
- [`VERCEL_URL`]

[`VERCEL_PROJECT_PRODUCTION_URL`]: https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_PROJECT_PRODUCTION_URL
[`VERCEL_BRANCH_URL`]: https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_BRANCH_URL
[`VERCEL_URL`]: https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_URL
