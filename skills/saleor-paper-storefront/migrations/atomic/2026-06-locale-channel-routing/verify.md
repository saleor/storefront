# Verify — locale-channel routing

- [ ] `/` redirects to `/{defaultLocale}/{defaultChannel}/`
- [ ] Legacy `/{channel}/products/foo` 308 to locale-prefixed URL
- [ ] `/pl/…/products/…` shows Polish catalog translations when set in Dashboard
- [ ] Homepage hero (Saleor Models) respects locale when `CONTENT_PROVIDER=saleor`
- [ ] PDP/category/collection/CMS `generateMetadata` includes canonical + hreflang
- [ ] Market switch with cart cookie shows confirmation
- [ ] Invalid `STOREFRONT_LOCALE_CHANNELS` pair returns 404
- [ ] `pnpm exec tsc --noEmit` and content/seo tests pass
