# Env Vars

This package is used for importing environment variables specified in `.env`, `.env.local` or `.env.development` files in your packages / apps and in the root of the monorepo.

It uses `dotfiles` and `dotfiles-expand` for loading the variables and expanding values of variables that include reference to other variables (by using `$`).
It also uses `find-config` to find the `.env` files from root of monorepo

The default export from the module is an object of all vairables loaded form `.env` files (it does not include every env variable like `process.env`)

```js
import envVars from "env-vars";

envVars.SETTINGS_ENCRYPTION_SECRET; // "super_secret_value"
envVars.NODE_ENV; // undefined - it doesn't include every environment variable, just the ones loaded from `.env` files
```

## Order of loading variables

- `apps/**/.env.local`
- `apps/**/.env.development`
- `apps/**/.env`
- `.env.local` (root of monorepo)
- `.env` (root of monorepo)

If you define a variable with the same name in `.env.local` and in `.env` then the variable from `.env.local` takes precedence.

> Note: variables defined later in the file, override already defined variables.
>
> For example:
>
> ```bash
> MY_ENV=initial_value
> # ...
> MY_ENV=overriden_value # this overrides `initial_value` with `overriden_value`
> ```
