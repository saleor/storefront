# Auth Patterns

Authentication spans client-side (urql + cookie storage) and server-side (Next.js cookies + `fetchWithAuth`). Understanding the token flow, cookie encoding, and auth fallback behavior prevents login bugs, stale sessions, and build failures.

> **Key dependency**: `@saleor/auth-sdk` — Provides `createSaleorAuthClient`, `SaleorAuthProvider`, `useAuthChange`

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                       AUTH ARCHITECTURE                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Client-Side (Browser)              Server-Side (Next.js)           │
│   ─────────────────────              ──────────────────────          │
│                                                                      │
│   SaleorAuthProvider                 getServerAuthClient()           │
│   ├─ createSaleorAuthClient()        ├─ createSaleorAuthClient()    │
│   ├─ clientCookieStorage             ├─ serverCookieStorage          │
│   │  (document.cookie)               │  (next/headers cookies())    │
│   └─ urql client with authFetch      └─ fetchWithAuth()             │
│                                                                      │
│   Shared: Same cookie names via encodeCookieName()                   │
│   Tokens: access (15min) + refresh (7 days) in cookies               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Key Files

| File                                       | Purpose                                      |
| ------------------------------------------ | -------------------------------------------- |
| `src/lib/auth/auth-provider.tsx`           | Client-side SaleorAuthProvider + urql client |
| `src/lib/auth/server.ts`                   | Server-side auth client with cookie storage  |
| `src/lib/auth/constants.ts`                | Token lifetimes, cookie name encoding        |
| `src/app/api/auth/register/route.ts`       | Registration API route                       |
| `src/app/api/auth/reset-password/route.ts` | Password reset request                       |
| `src/app/api/auth/set-password/route.ts`   | Set new password (from reset link)           |

---

## Token Flow

Auth tokens (access: 15min, refresh: 7 days) are stored in cookies. Cookie name encoding and flags are defined in `src/lib/auth/constants.ts`. Both client and server use the same encoding so cookies are shared seamlessly.

> **Security note**: Cookies are NOT HttpOnly because the SDK reads them client-side to set `Authorization` headers. Mitigate XSS risk with strong CSP headers.

---

## Client-Side Auth

### Login Flow

```
User submits credentials
    → useSaleorAuthContext().signIn(email, password)
    → SDK stores tokens in cookies via clientCookieStorage
    → useAuthChange fires onSignedIn callback
    → New urql client created (picks up new tokens)
    → UI re-renders with authenticated state
```

The `AuthProvider` component (`src/lib/auth/auth-provider.tsx`) wraps the app:

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
	const [urqlClient, setUrqlClient] = useState<Client>(() => makeUrqlClient());

	useAuthChange({
		saleorApiUrl,
		onSignedOut: () => setUrqlClient(makeUrqlClient()),
		onSignedIn: () => setUrqlClient(makeUrqlClient()),
	});

	return (
		<SaleorAuthProvider client={saleorAuthClient}>
			<UrqlProvider value={urqlClient}>{children}</UrqlProvider>
		</SaleorAuthProvider>
	);
}
```

The urql client uses `saleorAuthClient.fetchWithAuth` wrapped with `withRetry` from `src/lib/fetch-retry.ts` for automatic retry on transient failures.

---

## Server-Side Auth

### `executeAuthenticatedGraphQL`

Server components and server actions use `executeAuthenticatedGraphQL()`, which:

1. Dynamically imports `getServerAuthClient` from `src/lib/auth/server.ts`
2. Creates a server-side `SaleorAuthClient` with cookie-based storage
3. Uses `fetchWithAuth()` to automatically attach/refresh tokens

```typescript
const result = await executeAuthenticatedGraphQL(CurrentUserDocument, {
	cache: "no-cache",
});
```

### DYNAMIC_SERVER_USAGE Fallback

During static generation (build time), `cookies()` isn't available. The execution layer catches this and falls back to an unauthenticated fetch:

```typescript
try {
	response = await (await getServerAuthClient()).fetchWithAuth(url, input);
} catch (authError) {
	const isDynamicServerError = /* check for DYNAMIC_SERVER_USAGE */;
	if (isDynamicServerError) {
		response = await fetchWithTimeout(url, input, timeoutMs); // Unauthenticated fallback
	} else {
		throw authError;
	}
}
```

This means pages using `executeAuthenticatedGraphQL` can still be statically generated — they just won't have auth data.

---

## Auth API Routes

Auth mutations use `executeRawGraphQL` (not codegen) because they're simple, standalone operations:

### Registration (`/api/auth/register`)

```typescript
const result = await executeRawGraphQL<AccountRegisterResult>({
	query: REGISTER_MUTATION,
	variables: { input: { email, password, channel, redirectUrl } },
});
```

### Password Reset (`/api/auth/reset-password`)

Returns success regardless of whether email exists — **prevents email enumeration**:

```typescript
// Always return success to prevent email enumeration
if (requestPasswordReset?.errors?.length) {
	console.error("Password reset validation errors");
	// Still return success
}
return NextResponse.json({ success: true });
```

### Set Password (`/api/auth/set-password`)

Sets auth cookies on success (used after password reset via email link):

```typescript
if (setPassword?.token && setPassword?.refreshToken) {
	cookieStore.set("token", setPassword.token, { httpOnly: true, secure: isProduction, ... });
	cookieStore.set("refreshToken", setPassword.refreshToken, { httpOnly: true, secure: isProduction, ... });
}
```

---

## Anti-patterns

- **Don't store tokens in localStorage** — Use cookies (shared between client and server)
- **Don't skip email enumeration prevention** — Always return success for password reset requests
- **Don't make cookies HttpOnly** — The SDK needs client-side access (protect with CSP instead)
- **Don't forget to recreate the urql client on auth change** — Stale clients use old/no tokens
- **Don't call `cookies()` in statically generated pages without handling the fallback** — Use `executeAuthenticatedGraphQL` which handles this automatically
