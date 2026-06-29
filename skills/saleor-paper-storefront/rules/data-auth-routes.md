---
name: data-auth-routes
description: BFF auth and PPR-safe account routes: /api/auth/*, HttpOnly cookies, resolveSessionUser, header chrome refresh. Use when touching login/session, account pages, or fixing 'uncached data outside Suspense' on routes that read cookies.
---

# Authenticated Route Segments (PPR / Cache Components)

**CRITICAL** when `cacheComponents: true` and routes read session cookies. Reference implementation: `src/app/[channel]/(main)/account/`. The PPR boundary model and the generic "uncached data outside `<Suspense>`" fix menu live in [`data-caching.md`](data-caching.md); this rule covers what's auth-specific.

> **Fork upgrades:** apply migration `2026-06-account-ppr-auth` in [`../migrations/manifest.json`](../migrations/manifest.json) when catching up from pre–June 2026 Paper.

Anything that calls `cookies()`, `headers()`, or authenticated GraphQL is **dynamic**. In an async **page** without a Suspense boundary it fails the build (`Uncached data was accessed outside of <Suspense>`). Fix at the **route segment that owns the dynamic work** — never by wrapping `<main>{children}</main>` (hides the issue and blocks route `loading.tsx`).

## BFF auth (session lifecycle)

Login, logout, and password reset go through **Next.js API routes**, not the browser Saleor SDK. Tokens are **HttpOnly** cookies set server-side via `getServerAuthClient()`.

| Route                                            | Purpose                                     |
| ------------------------------------------------ | ------------------------------------------- |
| `POST /api/auth/login`                           | `tokenCreate` → Set-Cookie                  |
| `POST /api/auth/register`                        | Account registration                        |
| `POST /api/auth/reset-password` / `set-password` | Request reset email / reset token → session |
| `logout()` server action                         | Clear cookies + detach checkout             |

Client forms call `loginWithBff()` / `setPasswordWithBff()` (`src/lib/auth/bff-client.ts`). Commerce (cart, checkout lines) stays on **server actions** — do not proxy all GraphQL. The header user menu (`UserMenuServer`) calls `getHeaderUser()` inside Suspense — same server session as account pages, no client `me` fetch.

## Keeping header chrome fresh (Router Cache)

HttpOnly cookies are the source of truth, but the **client Router Cache** can reuse a stale RSC payload for the header after a session change. Paper uses explicit triggers — never client-side retry loops:

| Trigger                       | When                                 | Mechanism                                                                             |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| Initial load / hard refresh   | Land with an existing session        | `HeaderAuthRefresh` → `revalidateStorefrontChrome` + `router.refresh()` once on mount |
| In-store soft nav             | `<Link>` within `/${channel}`        | `HeaderAuthRefresh` → `router.refresh()` on pathname change                           |
| Cross-tab                     | Return after login/logout elsewhere  | `visibilitychange` → `revalidateStorefrontChromeAction` + `router.refresh()`          |
| Cross-surface / auth boundary | Login, logout, checkout → storefront | `revalidateStorefrontChrome` + **hard navigation**                                    |

**Hard navigation is required** when leaving `/checkout` or after login/logout — soft `router.push`/`<Link>` can restore a cached anonymous `UserMenuServer`. Use `syncAuthSurfacesAfterSignIn({ redirectTo })`, `useLogout({ channel })`, `navigateToStorefrontHome()`, or `StorefrontHomeLink` (plain anchor). `revalidateStorefrontChrome(channel)` invalidates the `/${channel}` layout (user menu + cart badge) and `/checkout` — call it from server actions (after cart mutations / checkout complete / before a client refresh), not during RSC render.

## Account architecture

Browse layouts use per-chrome slots; account uses a **layout-shell auth gate** (one Suspense + async shell; session checks only inside the shell):

```
account/layout.tsx
└── Suspense fallback={<AccountSkeleton />}
    └── AccountShell (async)
        ├── no session / invalid user → <AccountLogin />   (LoginForm → BFF)
        └── user → AccountProvider
            ├── AccountNav (static client)
            └── {children}   (sync pages + nested Suspense islands)

header.tsx → Suspense → HeaderAuthRefresh (client; router.refresh on pathname change)
                          └── UserMenuServer (async; cookies() + getHeaderUser() or sign-in link)
```

```tsx
// Layout shell — gate inside the async shell, not the page
async function AccountShell({ children }: { children: ReactNode }) {
	if (!(await hasAuthSession())) return <AccountLogin />;
	const user = await getCurrentUser(); // React.cache — deduped per request
	if (!user) return <AccountLogin />;
	return <AccountProvider user={user}>{/* nav + children */}</AccountProvider>;
}

// Sync page → fetch user once via context, secondary fetches in nested Suspense
export default function AccountOverviewPage() {
	return (
		<div>
			<AccountOverviewWelcome /> {/* useAccountUser() — from layout context */}
			<Suspense fallback={<RecentOrdersSectionSkeleton />}>
				<RecentOrdersSection />
			</Suspense>
		</div>
	);
}
```

**Moving a logged-in area to PPR-safe patterns:** layout owns the auth gate; pages stay sync (`<Suspense><AsyncContent/></Suspense>`); fetch the profile once in the layout and expose via `AccountProvider`/`useAccountUser()` (avoids `cookies()` per page); secondary fetches in nested Suspense; sign-in via `AccountLogin`. When UI reads user from layout context, mutations must `revalidatePath("/account", "layout")` **+** `router.refresh()` (page-only revalidation leaves stale context). Verify with `STOREFRONT_CHANNELS=aud,default-channel pnpm run build`.

## Anti-patterns

❌ `cookies()` / `getCurrentUser()` in an async page without a page/layout Suspense boundary
❌ Browser → Saleor for login or `me` — use BFF routes + server `getHeaderUser()`
❌ `connection()` in the account layout — can break PPR with `CartProvider` in the parent tree
❌ Wrapping only `<main>` in Suspense as a workaround — use the layout shell that owns the fetch
❌ `key={pathname}` without `router.refresh()` on header auth — remounting RSC children doesn't bust the Router Cache
❌ Client-side sessionStorage retry/recover gates or looping `router.refresh()` from effects — fix cache boundaries server-side
❌ Treating all `me === null` as signed out — use `resolveSessionUser` (`guest`/`authenticated`/`unavailable`); show the login link only on `guest`
❌ `<Link>` from checkout → storefront when the session may have changed — use a plain `<a href>` / `navigateToStorefrontHome()`

## Key files

| Concern                | File                                                                                                                        | Note                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Cookie presence        | `src/lib/auth/has-auth-session.ts`                                                                                          | Same lookup as auth SDK (`readAuthCookieValue`)                 |
| User profile           | `account/get-current-user.ts`                                                                                               | `React.cache()` — deduped per request                           |
| Header user            | `src/lib/auth/get-header-user.ts`                                                                                           | guest / authenticated / unavailable                             |
| Session resolution     | `src/lib/auth/resolve-session-user.ts`                                                                                      | Classifies the `me` fetch; one server retry on transient errors |
| Auth failure codes     | `src/lib/auth/session-auth-state.ts`                                                                                        | `isDefinitiveAuthFailure` — Saleor JWT codes + message fallback |
| BFF sign-in            | `src/lib/auth/bff-server.ts`, `/api/auth/login/route.ts`                                                                    | HttpOnly cookies, rate limited                                  |
| Client forms / profile | `bff-client.ts`, `account-context.tsx`                                                                                      | `loginWithBff`; `useAccountUser()`                              |
| Sign-in UI             | `account-login.tsx`                                                                                                         | `LoginForm` in Suspense (no SDK provider)                       |
| Chrome refresh         | `user-menu-server.tsx`, `header-auth-refresh.tsx`, `revalidate-storefront-chrome.ts`, `sync-auth-surfaces-after-sign-in.ts` | Header auth chrome + Router Cache sync + post-login hard nav    |
| Layouts                | `(main)/layout.tsx`, `account/layout.tsx`, `account/actions.ts`                                                             | Browse chrome vs account auth gate; layout revalidation         |

Related: [`data-caching.md`](data-caching.md) (page-boundary model), [`checkout-management.md`](checkout-management.md) (checkout BFF sign-in + `router.refresh()`).
