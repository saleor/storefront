# Authenticated Route Segments (PPR / Cache Components)

**Impact: CRITICAL** when `cacheComponents: true` and routes read session cookies.

Reference implementation: `src/app/[channel]/(main)/account/`.

> **Fork upgrades:** Apply atomic migration `2026-06-account-ppr-auth` in [`../migrations/manifest.json`](../migrations/manifest.json) when catching up from pre–June 2026 Paper (especially after #1201-style layout changes).

## Problem

With Cache Components enabled, any server component that calls `cookies()`, `headers()`, or authenticated GraphQL (`cache: "no-cache"` with session) is **dynamic**. If that runs in an async **page** without a Suspense boundary, production builds fail:

```
Uncached data was accessed outside of <Suspense>
```

Do **not** fix this by wrapping `<main>{children}</main>` in Suspense — that hides the issue and blocks route `loading.tsx`. Fix at the **route segment** that owns the dynamic work.

## BFF auth (session lifecycle)

Login, logout, and password reset go through **Next.js API routes** — not the browser Saleor SDK. Tokens are stored as **HttpOnly** cookies via `getServerAuthClient()` on the server.

| Route                           | Purpose                         |
| ------------------------------- | ------------------------------- |
| `POST /api/auth/login`          | `tokenCreate` → Set-Cookie      |
| `POST /api/auth/register`       | Account registration            |
| `POST /api/auth/reset-password` | Request reset email             |
| `POST /api/auth/set-password`   | Reset token → session           |
| `logout()` server action        | Clear cookies + detach checkout |

Client forms call `loginWithBff()` / `setPasswordWithBff()` from `src/lib/auth/bff-client.ts`. Commerce (cart, checkout lines) stays on **server actions** — do not proxy all GraphQL.

**Header user menu:** `UserMenuServer` calls `getHeaderUser()` inside Suspense — same server session as account pages. No client `me` fetch.

## Migration Checklist

Use this when moving a logged-in area (account, wishlist, etc.) to PPR-safe patterns:

1. **Layout owns auth gate** — one `Suspense` + async shell; call `hasAuthSession()` / `getCurrentUser()` only inside the shell.
2. **Sync page exports** — `export default function Page()` returns `<Suspense><AsyncContent /></Suspense>` for pages that fetch orders, etc.
3. **Profile data from layout** — fetch user once; expose via client `AccountProvider` + `useAccountUser()` for settings/addresses (avoids `cookies()` in every page).
4. **Nested Suspense for secondary fetches** — e.g. recent orders, order list, order detail (authenticated GraphQL in child async components).
5. **Login fallback** — use `AccountLogin` (`LoginForm` in Suspense); sign-in posts to `/api/auth/login`.
6. **Mutations + client context** — if UI reads user from layout context, use `revalidatePath("/account", "layout")` and `router.refresh()` on success (page-only revalidation leaves stale context).
7. **Verify build** — `STOREFRONT_CHANNELS=aud,default-channel pnpm run build` (CI may not run full build).

## Architecture

```
account/layout.tsx
└── Suspense fallback={<AccountSkeleton />}
    └── AccountShell (async)
        ├── no session / invalid user → <AccountLogin />  (LoginForm → BFF)
        └── user → AccountProvider
            ├── AccountNav (static client)
            └── {children}  (sync pages + nested Suspense islands)

header.tsx
└── Suspense
    └── UserMenuServer (async) → getHeaderUser() or sign-in link
```

| Concern            | Location                                  | Notes                                              |
| ------------------ | ----------------------------------------- | -------------------------------------------------- |
| Auth cookies check | `has-auth-session.ts`                     | Marker cookie names only; safe in Suspense shell   |
| User profile       | `get-current-user.ts`                     | `React.cache()` — deduped per request              |
| Header user        | `get-header-user.ts`                      | `CurrentUser` query for nav menu                   |
| BFF sign-in        | `bff-server.ts`, `/api/auth/login`        | HttpOnly cookies, rate limited                     |
| Client forms       | `bff-client.ts`                           | `loginWithBff`, `setPasswordWithBff`               |
| Client profile     | `account-context.tsx`                     | `useAccountUser()` for settings/addresses/overview |
| Sign-in UI         | `account-login.tsx`                       | `LoginForm` in Suspense (no SDK provider)          |
| Order fetches      | `recent-orders-section.tsx`, orders pages | Inside page-level Suspense                         |

## Code Patterns

### Layout shell

```tsx
export default function AccountLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<AccountSkeleton />}>
			<AccountShell>{children}</AccountShell>
		</Suspense>
	);
}

async function AccountShell({ children }: { children: ReactNode }) {
	if (!(await hasAuthSession())) return <AccountLogin />;
	const user = await getCurrentUser();
	if (!user) return <AccountLogin />;
	return <AccountProvider user={user}>{/* nav + children */}</AccountProvider>;
}
```

### Sync page + dynamic island

```tsx
export default function AccountOverviewPage() {
	return (
		<div>
			<AccountOverviewWelcome /> {/* useAccountUser() */}
			<Suspense fallback={<RecentOrdersSectionSkeleton />}>
				<RecentOrdersSection />
			</Suspense>
		</div>
	);
}
```

### Server actions with layout context

```typescript
function revalidateAccountLayout() {
	revalidatePath("/account", "layout");
}
```

```tsx
// Client form after successful BFF login
await revalidateAuthLayout(channel);
router.push(`/${channel}`);
router.refresh();
```

## Anti-patterns

❌ **`cookies()` or `getCurrentUser()` in async page components** without a page/layout Suspense boundary  
❌ **Browser → Saleor for login or `me`** — use BFF routes and server `getHeaderUser()`  
❌ **`connection()` in account layout** — can break PPR with `CartProvider` in parent tree  
❌ **Blanket `<Suspense>{children}</Suspense>` on main layout** — workaround, not architecture  
❌ **`revalidatePath("/account/addresses", "page")` only** when addresses read `useAccountUser()` from layout  
❌ **`fallback={null}`** on account order Suspense — use section skeletons

## Related Rules

- `data-caching.md` — three-layer page model, no main Suspense, sync page shell
- `checkout-management.md` — checkout session via RSC + BFF sign-in + `router.refresh()`

## Files

| File                                                              | Purpose                    |
| ----------------------------------------------------------------- | -------------------------- |
| `src/app/[channel]/(main)/account/layout.tsx`                     | Suspense + auth gate       |
| `src/app/[channel]/(main)/account/get-current-user.ts`            | Cached profile fetch       |
| `src/lib/auth/has-auth-session.ts`                                | Cookie presence check      |
| `src/lib/auth/bff-server.ts`                                      | Server sign-in / sign-out  |
| `src/lib/auth/get-header-user.ts`                                 | Header `me` fetch          |
| `src/app/api/auth/login/route.ts`                                 | BFF login endpoint         |
| `src/ui/components/account/account-login.tsx`                     | Signed-out account login   |
| `src/ui/components/account/account-context.tsx`                   | Client profile context     |
| `src/ui/components/nav/components/user-menu/user-menu-server.tsx` | Header auth chrome         |
| `src/app/[channel]/(main)/account/actions.ts`                     | Layout revalidation helper |
