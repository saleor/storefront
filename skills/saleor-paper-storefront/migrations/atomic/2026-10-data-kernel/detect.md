# Detect

Pending when `src/lib/saleor/index.ts` does not export `cachedQuery`, or `data-layer.lock.md` is missing.

```bash
test -f src/lib/saleor/index.ts && grep -q cachedQuery src/lib/saleor/index.ts && test -f data-layer.lock.md
```
