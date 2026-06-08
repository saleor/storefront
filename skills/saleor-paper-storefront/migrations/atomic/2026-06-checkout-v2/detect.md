# Detect: checkout-v2

## Needs migration if

Fork still uses client-side urql checkout or pre-v2 layout:

```bash
# urql in checkout runtime (not just codegen)
grep -r "useCheckoutQuery\|from \"urql\"\|from '@urql" src/checkout --include="*.tsx" --include="*.ts" \
  | grep -v "graphql/generated" | grep -v "codegen"

# Old single-page checkout without route groups
test -d src/app/checkout && ! test -d src/app/\(checkout\) && echo "NEEDS — legacy app/checkout layout"

# No session bridge
test ! -d src/session-bridge && echo "NEEDS — missing @paper/session-bridge"

# Order confirmation still on ?order= inside /checkout
grep -q "orderId.*searchParams" src/app/\(checkout\)/checkout/checkout-session-loader.tsx 2>/dev/null \
  && grep -q "redirect.*complete" src/app/\(checkout\)/checkout/checkout-session-loader.tsx || \
  test ! -f src/app/\(checkout\)/checkout/complete/page.tsx && echo "NEEDS — no /checkout/complete route"

# Reference SDK still present
test -d src/_reference && echo "LIKELY — remove _reference after porting customizations"
```

## Already applied if

```bash
test -f src/app/\(checkout\)/checkout/checkout-session-loader.tsx
test -f src/checkout/lib/checkout-search-params.ts
test -f src/app/\(checkout\)/checkout/complete/page.tsx
test -f src/app/\(checkout\)/actions.ts
grep -q "CheckoutDataProvider" src/checkout/checkout-app.tsx
! grep -rq "useCheckoutQuery" src/checkout --include="*.tsx" --include="*.ts" 2>/dev/null \
  | grep -v generated
```

## Skip if

Greenfield fork already generated from post–checkout-v2 Paper (all detect markers pass).

## False positive

- `typescript-urql` in `codegen.ts` or generated `src/checkout/graphql/generated/` — expected; hooks are not used at runtime
- `useCheckout()` hook name unchanged — v2 reimplements it over context, not urql
