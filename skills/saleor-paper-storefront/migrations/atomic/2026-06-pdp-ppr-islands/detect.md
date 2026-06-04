# Detect: pdp-ppr-islands

## Already applied if

```bash
grep -q ProductShell src/app/\[channel\]/\(main\)/products/\[slug\]/page.tsx
grep -q VariantGalleryDynamic src/ui/components/pdp/
```

And PDP page/shell does **not** top-level await searchParams:

```bash
# Should return no match in page.tsx ProductShell region
grep "await.*searchParams" src/app/\[channel\]/\(main\)/products/\[slug\]/page.tsx
# OK if only inside dynamic island files
```
