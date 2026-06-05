# Detect: menu-webhooks

## Already applied if

```bash
grep -q planMenuRevalidation src/lib/cache-manifest.ts
grep -q menu src/app/api/revalidate/route.ts
```

## Skip if

- No paper-app / no Saleor webhooks configured
- User accepts menus TTL staleness
