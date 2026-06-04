# Detect: homepage-featured-layer

```bash
test -f src/lib/catalog/get-featured-products.ts
grep -q getFeaturedProducts src/lib/catalog/get-featured-products.ts
```

Homepage page uses Suspense boundary (not fully async default export without inner boundary).
