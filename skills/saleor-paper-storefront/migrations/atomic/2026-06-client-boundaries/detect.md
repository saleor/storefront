# Detect: client-boundaries

## Already applied if

```bash
test -f src/ui/components/storefront-providers.tsx
grep -q StorefrontProviders src/app/\[channel\]/\(main\)/layout.tsx
```

## Note

If fork intentionally uses client links everywhere, port provider split only; skip ProductElement server Link if it breaks fork analytics hooks — ask user.
