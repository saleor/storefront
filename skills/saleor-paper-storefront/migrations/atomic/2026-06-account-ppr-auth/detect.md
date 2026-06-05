# Detect: account-ppr-auth

## Needs migration if

Fork has account routes **and** any of:

```bash
# Async account page calling getCurrentUser (common #1201 regression)
grep -r "getCurrentUser" src/app/\[channel\]/\(main\)/account/*/page.tsx 2>/dev/null

# Bare LoginForm without AuthProvider in account layout
grep "LoginForm" src/app/\[channel\]/\(main\)/account/layout.tsx 2>/dev/null | grep -v AccountLogin

# connection() in account layout (problematic with CartProvider)
grep "connection()" src/app/\[channel\]/\(main\)/account/layout.tsx 2>/dev/null
```

## Already applied if

```bash
test -f src/ui/components/account/account-login.tsx
grep -q "AccountLogin" src/app/\[channel\]/\(main\)/account/layout.tsx
grep -q "useAccountUser" src/ui/components/account/addresses-page.tsx
! grep -q "getCurrentUser" src/app/\[channel\]/\(main\)/account/addresses/page.tsx 2>/dev/null
grep -q "AccountShell" src/app/\[channel\]/\(main\)/account/layout.tsx
```

## Skip if

No account segment:

```bash
test ! -d src/app/\[channel\]/\(main\)/account && echo "SKIP — no account routes"
```

## False positive

- `getCurrentUser` only in `account/layout.tsx` inside `AccountShell` (expected)
- `getCurrentUser` in `get-current-user.ts` (expected)
