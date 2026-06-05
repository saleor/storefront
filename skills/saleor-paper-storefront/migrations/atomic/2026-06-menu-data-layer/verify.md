# Verify: menu-data-layer

```bash
pnpm exec tsc --noEmit
```

- [ ] `src/lib/menus/get-menu-data.ts` has `"use cache"` on fetch functions
- [ ] Nav/footer UI files do not contain `"use cache"` directive
- [ ] Navigation and footer still render in dev
- [ ] Custom nav styling unchanged (visual spot-check)

Record: `2026-06-menu-data-layer` / `72a0a6d6`
