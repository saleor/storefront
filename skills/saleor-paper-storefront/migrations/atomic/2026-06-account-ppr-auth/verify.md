# Verify: account-ppr-auth

```bash
pnpm exec tsc --noEmit
```

Build with multi-channel env (catches PPR prerender errors):

```bash
STOREFRONT_CHANNELS=aud,default-channel pnpm run build
```

- [ ] Build completes without `Uncached data was accessed outside of <Suspense>` on `/account/addresses`
- [ ] `/account` shows login with working sign-in when signed out (no `useSaleorAuthContext` error)
- [ ] Addresses/settings update after create/edit/delete without full page reload
- [ ] Orders list and detail show skeletons while loading, not blank content

Record: `2026-06-account-ppr-auth` / `3b27d901`
