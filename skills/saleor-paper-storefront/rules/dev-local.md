# Local Development & Mobile Testing

Patterns for running `pnpm dev` on a real phone (ngrok, LAN IP, tunnel) without mistaking Next.js dev restrictions for product bugs.

---

## Cross-origin dev resources (ngrok / tunnels)

### Symptom

Testing on a **real device** via ngrok (or similar) while the dev server runs on your laptop:

- Client components behave broken (carousels won't swipe, buttons feel dead, hydration oddities)
- Browser console shows Next.js blocking `/_next/*` (HMR, chunks, dev middleware)
- **Chrome DevTools responsive mode on localhost still works** — the page origin matches the dev server

This is **not** a production bug and often **not** a component/touch bug. The HTML loads from the tunnel host, but dev assets are rejected when the browser treats the request as cross-origin.

### Fix

Allow the tunnel hostname in `allowedDevOrigins` and **restart** `pnpm dev`.

Paper reads hostnames from `.env.local`:

```env
# Hostname only — no https://, comma-separated for multiple tunnels
ALLOWED_DEV_ORIGINS=servilely-quare-polly.ngrok-free.dev
```

`next.config.js` maps that to Next.js:

```javascript
allowedDevOrigins: ["servilely-quare-polly.ngrok-free.dev"];
```

After changing `ALLOWED_DEV_ORIGINS` or `next.config.js`, restart the dev server.

### LAN testing (`--hostname 0.0.0.0`)

Same rule applies when you open `http://192.168.x.x:3000` from your phone. Add the IP (or a stable local hostname) to `ALLOWED_DEV_ORIGINS` if dev chunks are blocked.

### When to use production build instead

For final QA of touch/gesture behavior without dev middleware:

```bash
pnpm build && pnpm start
```

Tunnel or LAN to the production server — no `allowedDevOrigins` needed.

---

## Chrome on iOS: `__gcruniqueid` hydration warnings

### Symptom

After ngrok/LAN dev works, the console shows a hydration mismatch on `<form>` / `<input>` (often `SearchBar` in the header):

```diff
  <form ...>
-   __gcruniqueid="1"
  <input ...>
-   __gcruniqueid="2"
```

Paper does **not** render these attributes — grep the repo finds nothing.

### Cause

**Chrome (and Chromium-based Edge) on iOS** inject `__gcruniqueid` / `__gchrome_uniqueid` on form fields for autofill **after** the server HTML is sent but **before** React hydrates. React then warns because client DOM ≠ server HTML.

This is a [known Chromium + React limitation](https://github.com/vercel/next.js/issues/77710). Safari on iOS typically does not inject these attributes.

### What to do

| Goal                | Action                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Confirm it's benign | Reproduce in **Safari** on the same phone — warning usually disappears                                     |
| Ignore in dev       | Safe — **no user-visible breakage** in production per Next.js/React guidance                               |
| Quieter dev console | Avoid Chrome on iOS for day-to-day mobile QA; use Safari                                                   |
| Last resort         | `suppressHydrationWarning` on affected inputs — silences real mismatches too; not recommended project-wide |

Do **not** refactor `SearchBar` or disable SSR on the header to silence this.

---

## Debugging checklist (mobile-only issues)

1. **Console on the phone** — Safari Web Inspector (Mac) or Eruda; look for Next.js "Cross-origin access to Next.js dev resources" first.
2. **`ALLOWED_DEV_ORIGINS`** — tunnel hostname listed? Dev server restarted?
3. **Origin mismatch** — ngrok URL in the address bar must match the hostname in `ALLOWED_DEV_ORIGINS` (subdomain changes when ngrok restarts free tunnels).
4. **Component layer** — only after dev origins are clean; e.g. Embla carousels need `touch-pan-y` on the viewport for real iOS touch (see `src/ui/components/ui/carousel.tsx`).
5. **Hydration on `__gcruniqueid`** — Chrome on iOS autofill injection; not a storefront bug (see above).

---

## Anti-patterns

❌ **Don't debug carousel swipe on ngrok** before fixing `allowedDevOrigins` — client JS may not load  
❌ **Don't commit personal ngrok hostnames** — use `ALLOWED_DEV_ORIGINS` in `.env.local`  
❌ **Don't assume Chrome device toolbar = real phone** — it uses localhost + mouse events, not tunnel + touch
