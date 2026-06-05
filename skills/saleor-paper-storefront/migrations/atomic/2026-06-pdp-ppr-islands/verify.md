# Verify: pdp-ppr-islands

```bash
pnpm exec tsc --noEmit
pnpm test src/ui/components/pdp 2>/dev/null || true
```

- [ ] Product name/JSON-LD in static shell (view page source / RSC)
- [ ] `?variant=` changes gallery and variant section
- [ ] Add to cart still works
- [ ] Custom variant UI styling preserved

Record: `2026-06-pdp-ppr-islands` / `651f7dd0`
