[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsaleor%2Fstorefront&env=NEXT_PUBLIC_SALEOR_API_URL,NEXT_PUBLIC_DEFAULT_CHANNEL&envDescription=Your%20Saleor%20API%20URL%20is%20the%20GraphQL%20endpoint%20of%20your%20instance%20(e.g.%20https%3A%2F%2Fyour-instance.saleor.cloud%2Fgraphql%2F).%20The%20channel%20slug%20can%20be%20found%20in%20Saleor%20Dashboard%20under%20Configuration%20%3E%20Channels%20(e.g.%20default-channel).%20For%20multi-channel%20support%2C%20add%20SALEOR_APP_TOKEN%20after%20deploy.&envLink=https%3A%2F%2Fgithub.com%2Fsaleor%2Fstorefront%23environment-variables&project-name=my-saleor-storefront&repository-name=my-saleor-storefront&demo-title=Saleor%20Next.js%20Storefront&demo-description=Starter%20pack%20for%20building%20performant%20e-commerce%20experiences%20with%20Saleor.&demo-url=https%3A%2F%2Fstorefront.saleor.io%2F&demo-image=https%3A%2F%2Fstorefront-d5h86wzey-saleorcommerce.vercel.app%2Fopengraph-image.png%3F4db0ee8cf66e90af>)

<img width="1920" height="1080" alt="saleor-storefront-paper-fin" src="https://github.com/user-attachments/assets/a8e37c20-35c8-42e0-a9c5-5c0b6097b921" />

<br/>
<br/>
<div align="center">
<img width="180" height="180" alt="apple-touch-icon-dark" src="https://github.com/user-attachments/assets/5327c1d3-86eb-4e5b-811a-81e8a5561d19" />
  <h1>Paper</h1>
  <p>A minimal, production-ready storefront template for <a href="https://github.com/saleor/saleor">Saleor</a>.<br/>Clean as a blank page — built to ship.</p>
</div>

<br/>

<div align="center">
  <a href="https://saleor.io/start">Learn about headless storefronts</a>
  <span> · </span>
  <a href="https://saleor.io/">Website</a>
  <span> · </span>
  <a href="https://docs.saleor.io/docs/3.x">Docs</a>
  <span> · </span>
  <a href="https://saleor.io/discord">Discord</a>
  <span> · </span>
  <a href="https://saleor.io/roadmap">Roadmap</a>
</div>

<br/>

> [!TIP]
> Questions or issues? Check our [Discord](https://saleor.io/discord) for help.

---

## Why Paper?

**Ship faster, customize everything.** Paper is a new release—expect some rough edges—but every component is built with real-world e-commerce in mind. This is a foundation you can actually build on.

### 🛒 Open Checkout

The checkout is where most storefronts fall apart or fall short. Paper's doesn't. We aim to provide open UI components and full wiring around the whole process.

- **Multi-step, mobile-first** — Each step is a focused form. No infinite scrolling on phones.
- **Guest & authenticated** — Seamless flow for everyone. Logged-in users get address book and saved preferences.
- **International address forms** — Country-aware fields that adapt (US states, UK postcodes, German formats).
- **Connection resilience** — Automatic retries with exponential backoff. Flaky networks? Handled.
- **Componentized architecture** — Swap steps, add steps, remove steps. It's your checkout.
- **Multi-channel ready** — Different currencies and shipping zones per channel.

### 🌍 Multi-Channel, Multi-Currency

One codebase, many storefronts. Channel-scoped routing means `/us/products` and `/eu/products` can serve different catalogs, prices, and shipping options—all from the same deployment.

### 📱 Product Pages Done Right

The hard parts are solved. Adapt the look, keep the logic.

- **Multi-attribute variant selection** — Color + Size + Material? Handled. Complex variant matrices just work.
- **Dynamic pricing** — Sale prices, variant-specific pricing, channel pricing—all reactive.
- **Image gallery** — Next.js Image optimization, proper aspect ratios, keyboard navigation.

### ♿ Accessibility Built In

Not an afterthought. Focus management on step transitions, keyboard navigation everywhere, semantic HTML, proper ARIA labels. Everyone deserves to shop.

### 🤖 AI-Ready Codebase

Built for front-end developers _and_ AI agents. The codebase includes:

- **`AGENTS.md`** — Architecture overview and quick reference for AI assistants
- **[`skills/saleor-paper-storefront/`](skills/saleor-paper-storefront/)** — 11 task-specific rules covering GraphQL, caching, variant selection, checkout, and more
- **[`.agents/skills/`](.agents/skills/)** — Installed community skills (Vercel React best practices, composition patterns)
- **Consistent patterns** — Predictable structure that AI tools can navigate and modify confidently

Whether you're pair-programming with Cursor, Claude, or Copilot—the codebase is designed to help them help you.

### ⚡ Bleeding Edge Stack

- **Next.js 16** with App Router and Server Components
- **React 19** with the latest concurrent features
- **TypeScript** in strict mode—your IDE will thank you
- **Tailwind CSS** with design tokens (OKLCH colors, CSS variables)
- **GraphQL Codegen** for type-safe Saleor API calls

---

## What's in the Box

| Feature              | Description                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| **Checkout**         | Multi-step flow with guest/auth support, address selector, international forms    |
| **Cart**             | Slide-over drawer with real-time updates, quantity editing                        |
| **Product Pages**    | Multi-attribute variants, image gallery, sticky add-to-cart                       |
| **Product Listings** | Category & collection pages with pagination                                       |
| **Navigation**       | Dynamic menus from Saleor, mobile hamburger                                       |
| **SEO**              | Metadata, JSON-LD, Open Graph images                                              |
| **Caching**          | ISR with on-demand revalidation via webhooks                                      |
| **Customer Profile** | Account dashboard, address book, order history, password change, account deletion |
| **Authentication**   | Login, register, password reset, guest checkout                                   |
| **API Resilience**   | Automatic retries, rate limiting, timeouts—handles flaky connections gracefully   |

---

## Caching Architecture

Paper uses **Cache Components** (Partial Prerendering) for optimal performance—static shells load instantly while dynamic content streams in. Learn more in the [Next.js documentation](https://nextjs.org/docs/app/api-reference/directives/use-cache) or see [`skills/saleor-paper-storefront/rules/data-caching.md`](skills/saleor-paper-storefront/rules/data-caching.md) for project-specific implementation details.

The **display-cached, checkout-live** model ensures fast browsing with accurate checkout:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA FRESHNESS                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Product Pages          Cart / Checkout         Payment            │
│   ──────────────         ──────────────          ───────            │
│                                                                     │
│   ┌───────────┐         ┌───────────┐          ┌───────────┐       │
│   │  CACHED   │────────▶│   LIVE    │─────────▶│   LIVE    │       │
│   │  5 min    │  Add    │  Always   │   Pay    │  Always   │       │
│   └───────────┘  to     └───────────┘          └───────────┘       │
│                  Cart                                               │
│   Fast page loads        Real-time prices       Saleor validates    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### How It Works

| Component               | Freshness          | Why                                  |
| ----------------------- | ------------------ | ------------------------------------ |
| **Product pages**       | Cached (5 min TTL) | Instant loads, great Core Web Vitals |
| **Category/Collection** | Cached (5 min TTL) | Fast browsing experience             |
| **Cart drawer**         | Always live        | Saleor API with `cache: "no-cache"`  |
| **Checkout**            | Always live        | Direct API calls, real-time totals   |

### Instant Updates with Webhooks

Configure Saleor webhooks to invalidate cache immediately when data changes:

1. Create webhook in Saleor Dashboard → Configuration → Webhooks
2. Point to `https://your-store.com/api/revalidate`
3. Subscribe to `PRODUCT_UPDATED`, `CATEGORY_UPDATED`, etc.
4. Set `SALEOR_WEBHOOK_SECRET` env var

Without webhooks? TTL handles it—cached data expires naturally after 5 minutes.

### Why This Is Safe

- **Saleor is the source of truth**: `checkoutLinesAdd` calculates prices server-side
- **Cart always fetches fresh**: Users see current prices before checkout
- **Payment validates**: `checkoutComplete` uses real-time data

> 📚 **Deep dive**: See [`skills/saleor-paper-storefront/rules/data-caching.md`](skills/saleor-paper-storefront/rules/data-caching.md) for the full architecture, Cache Components (PPR), webhook setup, and debugging guide.

---

## Quick Start

> [!NOTE]
> New to Saleor? Check out [saleor.io/start](https://saleor.io/start) to learn how storefronts work underneath.

### 1. Get a Saleor Backend

**Option A:** Free [Saleor Cloud](https://cloud.saleor.io/?utm_source=storefront&utm_medium=github) account (recommended)

**Option B:** [Run locally with Docker](https://docs.saleor.io/docs/3.x/setup/docker-compose)

### 2. Clone & Configure

```bash
# Using Saleor CLI (recommended)
npm i -g @saleor/cli@latest
saleor storefront create --url https://{YOUR_INSTANCE}/graphql/

# Or manually
git clone https://github.com/saleor/storefront.git
cd storefront
cp .env.example .env
pnpm install
```

Edit `.env` with your Saleor instance details:

```bash
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel  # Your Saleor channel slug
```

> **Finding your channel slug:** In Saleor Dashboard → Configuration → Channels → copy the slug

### 3. Run

```bash
pnpm dev
```

Open [localhost:3000](http://localhost:3000). That's it.

---

## Development

### Commands

```bash
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm run generate           # Regenerate GraphQL types (storefront)
pnpm run generate:checkout  # Regenerate GraphQL types (checkout)
```

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [channel]/          # Channel-scoped routes
│   └── checkout/           # Checkout pages
├── checkout/               # Checkout components & logic
├── graphql/                # GraphQL queries
├── gql/                    # Generated types (don't edit)
├── ui/components/          # UI components
│   ├── account/            # Customer profile & address book
│   ├── pdp/                # Product detail page
│   ├── plp/                # Product listing page
│   ├── cart/               # Cart drawer
│   └── ui/                 # Primitives (Button, Badge, etc.)
└── styles/brand.css        # Design tokens
```

### For AI Agents

If you're working with AI coding assistants, point them to:

- **`AGENTS.md`** — Architecture, commands, gotchas
- **`skills/saleor-paper-storefront/`** — 11 project-specific rules (GraphQL, caching, checkout, etc.)
- **`.agents/skills/`** — Installed community skills (React best practices, composition patterns)

To install the project skill for agent auto-discovery:

```shell
npx skills add . --skill saleor-paper-storefront
```

### Environment Variables

```env
# Required
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/

# Optional
NEXT_PUBLIC_STOREFRONT_URL=   # For canonical URLs and OG images
REVALIDATE_SECRET=            # Manual cache invalidation
SALEOR_WEBHOOK_SECRET=        # Webhook HMAC verification
SALEOR_APP_TOKEN=             # For channels query
```

---

## Payments

The checkout architecture supports Saleor payment apps like [Adyen](https://docs.saleor.io/docs/3.x/developer/app-store/apps/adyen) and [Stripe](https://docs.saleor.io/docs/3.x/developer/app-store/apps/stripe). The heavy lifting is done—integrating your gateway requires minimal work compared to building from scratch.

---

## Customization

Paper works as a reference implementation and as a starting point for your own storefront. Start here:

- **Colors & typography** → `src/styles/brand.css`
- **Components** → `src/ui/components/`
- **Checkout flow** → `src/checkout/views/SaleorCheckout/`

The design token system uses CSS custom properties—swap the entire color palette by editing a few lines.

---

## Next Steps

Features planned for future development:

- **Filtering logic iteration.** Fetching attributes from API for dynamic product filters.
- **Paper App.** Iteration on the revalidation logic and supported webhooks, providing a _Preview in storefront_ feature in Saleor Dashboard.
- **Opinionated model for standard content.** Moving currently hardcoded stuff like Credibility or Free checkout information to API models.

---

## License

[FSL-1.1-ALv2](./LICENSE) (Functional Source License, Version 1.1, ALv2 Future License) — use it, modify it, ship it. Build your storefront, run your business. The license converts to Apache 2.0 after two years.

Want to offer it as a managed service? [Let's talk](https://saleor.io/contact).

---

<div align="center">
  <br/>
  <p>Built with 🖤 by the <a href="https://saleor.io">Saleor</a> team</p>
</div>
