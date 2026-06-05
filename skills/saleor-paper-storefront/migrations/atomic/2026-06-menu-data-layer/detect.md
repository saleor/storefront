# Detect: menu-data-layer

## Already applied if

```bash
test -f src/lib/menus/get-menu-data.ts && grep -q getNavbarMenuItems src/lib/menus/get-menu-data.ts
grep -L '"use cache"' src/ui/components/nav/components/nav-links.tsx 2>/dev/null || \
  ! grep -q '"use cache"' src/ui/components/nav/components/nav-links.tsx
```

Data layer file exists; `"use cache"` not on whole NavLinks component.

## Fork adaptations

- Renamed `NavLinks` → search for menu GraphQL + navbar slug
- Inline footer menu fetch → extract to `getFooterMenuItems`
