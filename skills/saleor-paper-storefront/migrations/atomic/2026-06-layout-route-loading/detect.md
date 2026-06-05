# Detect: layout-route-loading

## Already applied if

```bash
grep -A5 "<main" src/app/\[channel\]/\(main\)/layout.tsx | grep -v "Suspense.*children"
# main should not wrap children in Suspense fallback={null}

test -f src/ui/components/plp/plp-page-loading.tsx
```

## False positive

Layout Suspense around header/footer is OK — only **main children** wrapper should be removed.
