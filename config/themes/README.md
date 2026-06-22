# Storefront theme examples

Optional visual directions you can try locally. **The shipped default is always Direction C** (Geist + semantic type scale) unless you opt in.

## Typography themes

| Theme                       | Env value   | Display headings | Body / UI |
| --------------------------- | ----------- | ---------------- | --------- |
| **Default (Direction C)**   | _(omit)_    | Geist            | Geist     |
| **Editorial (Direction A)** | `editorial` | Fraunces (serif) | Geist     |

Editorial is an **example** for heritage / outdoor-adventure positioning — not maintained as a second production default. Forks can copy the pattern for their own display fonts.

### Try Editorial locally

**Option 1 — one-off dev session (no `.env` edit):**

```bash
pnpm run dev:theme-editorial
```

**Option 2 — merge into `.env.local`:**

```bash
cat config/themes/typography-editorial.env.example >> .env.local
```

Then restart the dev server (`rm -rf .next` if fonts do not update).

### How it works

- `NEXT_PUBLIC_TYPOGRAPHY_THEME=editorial` sets `data-typography="editorial"` on `<html>`.
- `src/styles/brand.css` switches `--font-display` to Fraunces; body stays Geist.
- Semantic tokens (`text-display`, `text-h1`–`text-h3`) pick up the display family automatically — no component changes.

See also: [`src/styles/README.md`](../src/styles/README.md) (type scale tokens).
