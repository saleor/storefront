# Detect: plp-shell-split

```bash
test -f src/lib/catalog/get-category-data.ts
test -f src/lib/catalog/get-collection-data.ts
```

Category/collection pages import cached getters; hero and grid are not in one Suspense block only.
