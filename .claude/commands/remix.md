---
name: remix
description: Transform this storefront into a domain-specific store - restructures UI components, layout, and generates Saleor Configurator config
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion, Glob, Grep, Agent, TaskCreate, TaskUpdate, TaskList, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__take_screenshot, mcp__chrome-devtools__click, mcp__chrome-devtools__evaluate_script
argument-hint: [store-url-or-description]
---

# Remix Storefront

Transform this storefront for a specific business domain. This goes far beyond
swapping colors and logos. Different domains need fundamentally different UX:
an optical store emphasizes frame shape, try-on, and prescription info. A grocery
store emphasizes availability, dietary info, and fast add-to-cart. A fashion store
(the current default) emphasizes color swatches, size selection, and lifestyle imagery.

This command restructures the actual UI components, page layouts, product cards,
filters, navigation, and content sections to match the domain.

## MANDATORY: Read Before Modifying

Before making ANY code changes, you MUST read the codebase documentation to understand
existing patterns, conventions, and architecture. This ensures heavy changes are made
WITH awareness, not against it.

### Required Reading (do this in Phase 0)

**Architecture & Conventions:**

- `.cursor/conventions.md` - File naming (kebab-case), component exports, import aliases
- `skills/saleor-paper-storefront/SKILL.md` - Rule categories, when to apply each rule
- `skills/saleor-paper-storefront/references/saleor-key-directories.md` - Saleor API structure

**Codebase Rules (read the ones relevant to your changes):**

- `skills/saleor-paper-storefront/rules/ui-components.md` - Design tokens, shadcn/ui primitives, component locations
- `skills/saleor-paper-storefront/rules/product-pdp.md` - PDP architecture, gallery, data flow, add-to-cart
- `skills/saleor-paper-storefront/rules/product-variants.md` - Variant selection state machine, option states
- `skills/saleor-paper-storefront/rules/product-filtering.md` - Server vs client filtering, category slug resolution
- `skills/saleor-paper-storefront/rules/data-caching.md` - Cache Components (PPR), cache tags, revalidation
- `skills/saleor-paper-storefront/rules/data-graphql.md` - Two codegen setups, permission patterns
- `skills/saleor-paper-storefront/rules/ui-channels.md` - Multi-channel URLs, channel selector
- `skills/saleor-paper-storefront/rules/seo-metadata.md` - JSON-LD, OG images, metadata helpers
- `skills/saleor-paper-storefront/rules/checkout-management.md` - Checkout lifecycle
- `skills/saleor-paper-storefront/rules/checkout-components.md` - Reusable checkout UI

**Brand & Styling System:**

- `src/styles/README.md` - Color token system (OKLCH), 3-color philosophy, customization guide
- `src/styles/brand.css` - Current design tokens (light + dark mode)
- `src/config/brand.ts` - Brand config fields, helpers

**Existing Domain Infrastructure (multi-tenant):**

- `src/lib/store.ts` - Multi-tenant store system using Saleor Custom Models (Entities)
- `src/lib/store-data.ts` - Store types, demo data
- `src/ui/components/store/` - Store context, header badge components
- `src/app/(main)/store/[store]/` - Per-store routes (products, collections, categories)

**Reference Implementations:**

- `src/_reference/README.md` - Payment gateway reference code (Adyen, Stripe, Dummy)
- `src/_reference/checkout-sections/PaymentSection/` - Full payment integration examples

**App Structure:**

- `src/app/(main)/` - Main routes (products, cart, account, search, collections, categories, store)
- `src/app/config.ts` - Channel config, products per page
- `config.yml` - Saleor Configurator config (generated via `/configurator init` or `/recipe`)

### How to Use This Knowledge

When modifying a component, FIRST read:

1. The component file itself
2. The relevant rule from `skills/saleor-paper-storefront/rules/`
3. Any files it imports or depends on

This prevents breaking existing patterns like:

- Cache Component boundaries (don't remove `"use cache"` directives)
- Variant selection state machine (don't simplify the option state logic)
- GraphQL query structure (don't change query shapes without understanding codegen)
- Channel-aware routing (understand when channel is in URL vs env var)

## Progress Tracking

Create tasks to track wizard progress:

```
Use TaskCreate to create these tasks at the start:
0. "Study codebase" - activeForm: "Reading docs and understanding patterns"
1. "Discover domain" - activeForm: "Understanding the business domain"
2. "Build domain profile" - activeForm: "Building domain profile"
3. "Brand identity & design tokens" - activeForm: "Configuring brand"
4. "Structural adaptation" - activeForm: "Restructuring components"
5. "Product catalog" - activeForm: "Generating config.yml"
6. "Verify result" - activeForm: "Verifying changes"

Update task status as you progress:
- Set to in_progress when starting a step
- Set to completed when step finishes
```

## Workflow Overview

```
Phase 0: Study Codebase    -> Read docs, understand patterns and conventions
Phase 1: Discovery         -> Understand the domain (URL analysis or conversation)
Phase 2: Domain Profile    -> Build a structured profile of what this store needs
Phase 3: Brand Identity    -> Name, colors, typography, logos
Phase 4: Structural Adapt  -> Rewrite components to match the domain
Phase 5: Product Catalog   -> Generate config.yml via Saleor Configurator
Phase 6: Verify            -> Dev server + screenshot to confirm the result
```

---

## Phase 0: Study Codebase

**Goal**: Build awareness of existing architecture before making changes.

Read these files (use parallel reads for efficiency):

1. `.cursor/conventions.md` - Naming conventions
2. `skills/saleor-paper-storefront/SKILL.md` - Architecture overview
3. `skills/saleor-paper-storefront/rules/ui-components.md` - Design token system
4. `skills/saleor-paper-storefront/rules/product-pdp.md` - PDP architecture
5. `src/styles/README.md` - Color system docs
6. `src/styles/brand.css` - Current tokens
7. `src/config/brand.ts` - Current brand config
8. `src/app/config.ts` - App config
9. `config.yml` (if it exists) - Current product catalog structure

Also scan the current component structure:

```
Glob: src/ui/components/**/*.tsx
Glob: src/app/(main)/**/*.tsx
```

Internalize:

- The design token naming convention (--background, --primary, --foreground, etc.)
- How components reference tokens via Tailwind (bg-background, text-foreground, etc.)
- The routing structure (whether using /[channel]/ or /(main)/ patterns)
- Whether multi-tenant store system is active (src/lib/store.ts, src/app/(main)/store/)
- Cache patterns ("use cache", cacheLife, cacheTag)

Only proceed to Phase 1 after reading these files.

---

## Phase 1: Discovery

**Goal**: Understand what kind of store this is and what its customers need.

**Ask the user:**

> What kind of store are you building? You can:
>
> 1. Give me a URL to an existing store/website to analyze
> 2. Describe your business (e.g., "optical store selling prescription glasses")
> 3. Both

### If URL provided

Use Chrome DevTools MCP to deeply analyze the site:

1. `mcp__chrome-devtools__navigate_page` to the homepage, take screenshot
2. Browse to a product listing page, take screenshot
3. Browse to a product detail page, take screenshot
4. Browse to the navigation/menu, take screenshot

Extract:

- **Domain signals**: What products are sold? What information is prominent?
- **Layout patterns**: Grid density, image aspect ratios, info hierarchy
- **Navigation depth**: Flat categories vs deep hierarchies vs faceted
- **Product card anatomy**: What info appears on each card? Badge types?
- **PDP structure**: Gallery style, which attributes are highlighted, trust signals
- **Filters**: What do customers filter by in this domain?
- **Color palette & typography**: For brand identity phase

### If description provided

Ask targeted follow-up questions to build the domain profile:

- "What are the 2-3 most important pieces of info a customer needs to see on a product card?"
- "How do customers typically browse - by category, by attribute (e.g. frame shape), or by search?"
- "Are there domain-specific concerns? (prescriptions, allergens, compatibility, sizing)"

---

## Phase 2: Domain Profile

Based on discovery, build a **domain profile** - a structured understanding of
what this storefront needs. Present it to the user for confirmation before proceeding.

### Profile Template

```
DOMAIN PROFILE: [Store Type]
==================================

Product Card Design:
  - Image aspect ratio: [3/4 fashion | 1/1 square | 4/3 landscape | custom]
  - Primary info: [what shows prominently - name, price, what else?]
  - Secondary info: [what shows smaller - brand, variants preview, specs?]
  - Badges: [Sale, New, Prescription, Organic, In Stock, Limited, etc.]
  - Hover behavior: [alt image, quick-add, specs preview, none]
  - Quick add: [prominent | on-hover | hidden]

Product Detail Page:
  - Gallery style: [carousel with thumbnails | single hero | grid | with zoom]
  - Key info sections: [list the attribute groups/accordions needed]
  - Variant selection: [color+size | configuration builder | quantity tiers | simple]
  - Trust signals: [what reassurances does this domain need?]
  - Sticky mobile bar: [yes with what info | no]

Homepage:
  - Hero section: [banner with CTA | category showcase | featured product | none]
  - Content sections: [what sections appear below hero?]
  - Featured collection: [slug name for the featured products]

Navigation:
  - Style: [flat links | dropdowns | mega menu categories]
  - Primary categories: [list them]
  - Special nav items: [e.g., "Virtual Try-On", "Recipes", "Deals"]

Filters:
  - Domain-specific filters: [list them with types]
  - Sort options: [which sort orders matter for this domain?]
  - Filter UI: [sidebar | horizontal bar | both]

Cart Experience:
  - Shipping threshold: [amount and currency, or none]
  - Trust signals: [domain-specific reassurances]
  - Upsell: [related items, accessories, warranty, none]

Footer:
  - Sections: [what info columns?]
  - Special content: [certifications, trust badges, etc.]
```

### Domain Examples

Below are reference profiles. Use these as starting points, but always customize
based on the specific business. The user's store may be a hybrid or a niche within
a domain.

#### Optical Store

```
Product Card:
  - aspect: 4/3 (show frame shape clearly)
  - primary: Frame name, price
  - secondary: Brand, available colors as dots
  - badges: "New", "Bestseller", "Rx Ready"
  - hover: show frame from side angle
  - quick-add: hidden (needs configuration)

PDP:
  - gallery: multi-angle (front, side, 3/4) - NOT color variants
  - sections: Description, Frame Measurements (bridge/lens/temple width),
    Lens Options, Material & Weight, Fitting Guide
  - variants: Frame color -> Lens type (stepped selection)
  - trust: "Free Adjustments", "30-Day Home Trial", "Rx Verified"
  - sticky bar: yes (frame name + price + "Select Lenses" CTA)

Homepage:
  - hero: "Find Your Perfect Frame" with shape-based browsing CTA
  - sections: Shop by Shape (visual grid), New Arrivals, Bestsellers,
    Brand Spotlight, "How It Works" (order process explainer)
  - featured: "new-arrivals"

Navigation:
  - style: category dropdowns
  - categories: Eyeglasses, Sunglasses, Contact Lenses, Accessories
  - special: "Virtual Try-On", "Find Your Fit"

Filters:
  - Frame Shape (Cat Eye, Round, Rectangle, Aviator, Oval) - visual swatches
  - Frame Material (Acetate, Metal, Titanium, TR90) - checkboxes
  - Lens Type (Single Vision, Progressive, Bifocal, Blue Light) - checkboxes
  - Face Width (Narrow, Medium, Wide) - buttons
  - Price range
  - Brand
  Sort: Featured, New, Price, Bestselling

Cart:
  - threshold: none (high-value items)
  - trust: "Includes Basic Lenses", "Free Shipping", "365-Day Warranty"
  - upsell: lens upgrades, cleaning kits
```

#### Grocery / Food Store

```
Product Card:
  - aspect: 1/1 (square, packaged goods)
  - primary: Product name, price per unit, price per kg/lb
  - secondary: Brand, weight/volume
  - badges: "Organic", "Sale -X%", "Low Stock", "New"
  - hover: none (no alt images for groceries)
  - quick-add: PROMINENT (default quantity 1, +/- buttons on card)

PDP:
  - gallery: single image or minimal (1-2 images)
  - sections: Description, Nutrition Facts, Ingredients, Allergens,
    Storage Instructions, Origin/Producer
  - variants: Weight/size options (250g, 500g, 1kg) - simple buttons
  - trust: "Fresh Guarantee", "Same-Day Delivery", "Easy Returns"
  - sticky bar: yes (price + quick add)

Homepage:
  - hero: "This Week's Specials" with countdown/date
  - sections: Weekly Deals, Popular Now, Shop by Category (visual grid),
    Seasonal Picks, "New This Week"
  - featured: "weekly-deals"

Navigation:
  - style: mega menu with category images
  - categories: Produce, Dairy & Eggs, Meat & Fish, Bakery, Pantry,
    Frozen, Beverages, Organic, Household
  - special: "Deals", "New", "Recipes" (if applicable)

Filters:
  - Dietary (Organic, Vegan, Gluten-Free, Keto, Dairy-Free) - checkboxes
  - Brand - searchable dropdown
  - Allergens (Contains: Nuts, Soy, Dairy, Gluten) - exclusion checkboxes
  - Price range
  Sort: Featured, Price, Newest, Alphabetical

Cart:
  - threshold: free delivery over X
  - trust: "Freshness Guaranteed", "Delivered Today"
  - upsell: "Frequently bought together"
```

#### Electronics Store

```
Product Card:
  - aspect: 1/1 (square, device photos)
  - primary: Product name, price
  - secondary: Key spec (e.g., "256GB | 8GB RAM"), rating stars
  - badges: "New", "Sale", "Limited Stock", "Top Rated"
  - hover: show back of device or accessory bundle
  - quick-add: hidden (needs spec selection)

PDP:
  - gallery: multi-angle + lifestyle shots, video support indicator
  - sections: Overview, Specifications (full table), What's in the Box,
    Reviews & Ratings, Compatibility, Warranty
  - variants: Storage/RAM/Color configuration (stepped)
  - trust: "Official Warranty", "Free Shipping", "14-Day Returns"
  - sticky bar: yes (price + "Add to Cart" + stock status)

Homepage:
  - hero: Featured product launch or seasonal sale
  - sections: New Arrivals, Bestsellers by Category, Deals,
    Brand Showcase, "Recently Viewed"
  - featured: "new-arrivals"

Navigation:
  - style: mega menu with subcategories
  - categories: Phones, Laptops, Audio, Wearables, Accessories, Gaming
  - special: "Deals", "Compare"

Filters:
  - Brand - checkboxes with counts
  - Price range - slider
  - Specs vary by category (RAM, Storage, Screen Size, Battery, etc.)
  - Rating (4+ stars, 3+ stars) - buttons
  - Availability - toggle
  Sort: Featured, Price, Newest, Rating, Bestselling

Cart:
  - threshold: free shipping over X
  - trust: "Official Products", "Secure Checkout", "Fast Shipping"
  - upsell: accessories, extended warranty, protection plan
```

#### Fashion Store (current default)

```
Product Card:
  - aspect: 3/4 (tall, model/mannequin shots)
  - primary: Product name, price
  - secondary: Brand, color swatches (up to 4 + overflow)
  - badges: "Sale", "New"
  - hover: alt image (back view), quick-add button
  - quick-add: on hover

PDP:
  - gallery: carousel with thumbnails, swipe on mobile
  - sections: Description, Product Details (material, care), Shipping & Returns
  - variants: Color swatches + Size buttons
  - trust: "Secure Checkout", "Free Shipping over X"
  - sticky bar: yes (price + size selector + add to cart)

Homepage:
  - hero: seasonal campaign banner
  - sections: New Arrivals, Shop by Category, Bestsellers
  - featured: "featured-products"

Navigation:
  - style: flat links or simple dropdowns
  - categories: Women, Men, Kids, Accessories, Sale
  - special: "New Arrivals"

Filters:
  - Category, Color (swatches), Size (buttons), Price range
  Sort: Featured, Newest, Price ASC/DESC, Bestselling

Cart:
  - threshold: free shipping over X
  - trust: "Free Shipping", "30-Day Returns"
  - upsell: styling suggestions
```

---

## Phase 3: Brand Identity & Design Tokens

Collect brand info and visual identity together (don't separate into two phases
when talking to the user - it's one conversation).

### Pre-read Required

Before modifying brand files, read:

- `src/styles/README.md` - Understand the OKLCH color system and token naming
- `src/styles/brand.css` - See current token values
- `src/config/brand.ts` - See current brand config shape
- `skills/saleor-paper-storefront/rules/ui-components.md` - Design token usage in components

### Brand Config

| Field             | Maps To                        | Required                       |
| ----------------- | ------------------------------ | ------------------------------ |
| Store name        | `brandConfig.siteName`         | yes                            |
| Legal entity      | `brandConfig.copyrightHolder`  | yes                            |
| Tagline           | `brandConfig.tagline`          | yes                            |
| Meta description  | `brandConfig.description`      | yes                            |
| Organization name | `brandConfig.organizationName` | no, defaults to store name     |
| Default brand     | `brandConfig.defaultBrand`     | no, defaults to store name     |
| Logo aria label   | `brandConfig.logoAriaLabel`    | no, defaults to store name     |
| Title template    | `brandConfig.titleTemplate`    | no, defaults to "%s \| {name}" |
| Twitter           | `brandConfig.social.twitter`   | no                             |
| Instagram         | `brandConfig.social.instagram` | no                             |
| Facebook          | `brandConfig.social.facebook`  | no                             |

**File**: `src/config/brand.ts`

### Colors

Accept any color format (hex, RGB, named) and convert to OKLCH.

Refer to `src/styles/README.md` for the OKLCH format explanation:

- Lightness: 0 (black) to 1 (white)
- Chroma: 0 (gray) to ~0.4 (vivid)
- Hue: 0-360 degrees (0=pink, 90=yellow, 180=cyan, 270=blue)

Ask for:

1. **Primary brand color** -> `--primary` (CTA buttons, key UI)
2. **Background preference** -> `--background` (warm, cool, pure white, dark)
3. **Accent/sale color** -> `--destructive` (default: red)

Auto-derive everything else:

- `--foreground`: Near-black or near-white based on background
- `--card`, `--secondary`, `--muted`, `--accent`: Variations of background
- `--primary-foreground`: Contrast against primary
- `--border`, `--input`, `--ring`: Derived from palette
- Dark mode: Automatically generate inverted palette

**File**: `src/styles/brand.css`

### Typography (optional)

Default: Geist Sans. If custom font requested:

- Install via pnpm or guide user to place files in `public/fonts/`
- Update `src/app/layout.tsx` font loading
- Consider domain: serif for luxury/optical, sans-serif for tech, rounded for kids

### Border Radius (optional)

Options: sharp (0), subtle (0.25rem), default (0.5rem), rounded (0.75rem), pill (1rem)

**File**: `src/styles/brand.css` (`--radius`)

### Logo & Favicons

Ask user to provide:

- `public/logo.svg` (for light backgrounds)
- `public/logo-dark.svg` (for dark backgrounds)
- Favicons (optional, suggest as TODO if not available)

Update `src/ui/components/shared/logo.tsx` if aspect ratio differs from 100:23.
Update `public/site.webmanifest` with store name.

---

## Phase 4: Structural Adaptation

This is the core differentiator. Based on the domain profile from Phase 2,
modify the actual component structure, not just styles.

### Pre-read Required

Before modifying any component, read:

1. The target component file itself
2. The relevant rule from `skills/saleor-paper-storefront/rules/`
3. Files it imports (check with Grep for import statements)

Key rules to reference during structural changes:

- `skills/saleor-paper-storefront/rules/product-pdp.md` - Before touching PDP files
- `skills/saleor-paper-storefront/rules/product-variants.md` - Before touching variant selection
- `skills/saleor-paper-storefront/rules/product-filtering.md` - Before touching filters
- `skills/saleor-paper-storefront/rules/data-caching.md` - Before touching any server component with caching
- `skills/saleor-paper-storefront/rules/seo-metadata.md` - Before touching metadata or JSON-LD

### Critical: Preserve These Patterns

When restructuring, do NOT break:

- `"use cache"` directives and cacheLife/cacheTag calls in server components
- The variant selection state machine in product pages (read `rules/product-variants.md`)
- GraphQL query/fragment structure (read `rules/data-graphql.md`)
- The `@/` import alias convention (read `.cursor/conventions.md`)
- Kebab-case file naming (read `.cursor/conventions.md`)
- Multi-tenant store system if active (check `src/lib/store.ts`, `src/app/(main)/store/`)

### Decide: Multi-tenant or Single-tenant

Check the current state:

- If `src/lib/store.ts` and `src/app/(main)/store/[store]/` exist, the codebase supports multi-tenant
- Ask the user: "The current codebase has a multi-store system. Do you want to keep it (each store is a sub-brand) or simplify to a single store?"
- If simplifying, the store components and routes can be removed
- If keeping, adapt the store components to the new domain too

### 4.1 Product Card (`src/ui/components/plp/product-card.tsx`)

Adapt based on domain profile:

- **Image aspect ratio**: Change `aspect-[3/4]` to match domain (1/1, 4/3, etc.)
- **Info density**: Add or remove fields. Grocery needs unit pricing. Electronics
  needs key specs. Optical needs frame measurements preview.
- **Badges**: Change badge types and logic. Map to domain-specific indicators.
- **Hover behavior**: Disable for domains where alt-image doesn't make sense.
  Add specs-on-hover for electronics. Keep alt-image for fashion.
- **Quick add**: Make prominent for grocery (with quantity +/-). Hide for
  complex products (optical, electronics with config). Keep hover-reveal for fashion.
- **Color swatches**: Keep for fashion/optical. Remove for grocery/electronics.
  Replace with spec pills for electronics.

Also read `src/ui/components/plp/utils.ts` for product card utility functions.

### 4.2 Product Detail Page

Read `skills/saleor-paper-storefront/rules/product-pdp.md` before modifying PDP files.

#### Gallery (`src/ui/components/pdp/product-gallery.tsx`)

- **Fashion/Optical**: Full carousel with thumbnails, multiple angles
- **Grocery**: Single image or minimal gallery (1-2 images), larger product info area
- **Electronics**: Gallery + video indicator, zoom capability

#### Info Sections (`src/ui/components/pdp/product-attributes.tsx`)

Rewrite the accordion sections to match domain:

- **Remove** sections that don't apply (e.g., "Care Instructions" for electronics)
- **Add** domain-specific sections (e.g., "Nutrition Facts" for grocery,
  "Specifications" table for electronics, "Frame Measurements" for optical)
- **Reorder** by importance for the domain
- **Change icons**: Map attribute names to appropriate Lucide icons for the domain

#### Variant Selection (`src/ui/components/pdp/variant-selector.tsx` area)

Read `skills/saleor-paper-storefront/rules/product-variants.md` first - the variant
selection uses a state machine pattern. Adapt the UX without breaking the state logic:

- **Fashion**: Color swatches + size buttons (current)
- **Optical**: Frame color -> Lens type (stepped/dependent selection)
- **Grocery**: Weight/quantity tiers (simple buttons: 250g, 500g, 1kg)
- **Electronics**: Configuration builder (Storage -> RAM -> Color)

#### Trust Signals

Replace the generic "Secure Checkout" / "Free Shipping" with domain-appropriate ones:

- **Optical**: "Free Adjustments", "Rx Verified", "365-Day Warranty"
- **Grocery**: "Freshness Guaranteed", "Same-Day Delivery"
- **Electronics**: "Official Warranty", "Authorized Reseller"
- **Fashion**: "Free Returns", "Secure Checkout"

### 4.3 Homepage (`src/app/(main)/page.tsx`)

The current homepage is minimal (just a product grid). Restructure it:

1. **Add hero section** appropriate to domain:

   - Fashion: Campaign banner with seasonal imagery
   - Optical: "Find Your Perfect Frame" with shape-browsing CTA
   - Grocery: "This Week's Specials" with deal highlights
   - Electronics: Featured product launch

2. **Add content sections** below hero:

   - Category showcase (visual grid of top categories)
   - Multiple featured collections (New, Bestsellers, On Sale)
   - Domain-specific content (How It Works for optical, Recipes for grocery)
   - Brand showcase (if multi-brand store)

3. **Update featured collection slug** to match the most important collection

Note: Check if there's also a `src/app/(main)/store/[store]/page.tsx` that needs
parallel updates for the multi-tenant version.

### 4.4 Filter Bar (`src/ui/components/plp/filter-bar.tsx`)

Read `skills/saleor-paper-storefront/rules/product-filtering.md` first.

Add domain-specific filters:

- **Optical**: Frame Shape (visual swatches), Frame Material, Lens Type, Face Width
- **Grocery**: Dietary (Organic, Vegan, GF), Allergen exclusions, Brand
- **Electronics**: Brand, Specs (category-dependent), Rating, Availability
- **Fashion**: Color, Size, Price (current - keep as is)

Update sort options if domain needs different ones (e.g., grocery rarely needs
"bestselling" but needs "alphabetical"; electronics needs "rating").

### 4.5 Navigation Structure

Update header navigation to match domain categories:

- Read `src/ui/components/header.tsx` and `src/ui/components/nav/` first
- Modify the CMS menu fallback in `src/ui/components/nav/components/nav-links.tsx`
  to show domain-appropriate categories when no CMS menu exists
- Add special nav items if needed (e.g., "Virtual Try-On" for optical)
- Update `src/ui/components/nav/components/search-bar.tsx` placeholder text
- Update `src/ui/components/nav/components/cart-nav-item.tsx` if cart badge behavior changes

### 4.6 Cart Drawer (`src/ui/components/cart/cart-drawer.tsx`)

Also read `src/ui/components/cart/cart-drawer-wrapper.tsx` for the drawer container.

- Update shipping threshold amount and messaging
- Replace trust signals with domain-appropriate ones
- Adjust cart item display (show unit pricing for grocery, show lens options for optical)

### 4.7 Footer (`src/ui/components/footer.tsx`)

- Update fallback menu structure to match domain categories
- Update brand description text
- Add domain-specific footer content (certifications, trust badges)

### 4.8 Auth Pages (if needed)

Read current auth components before modifying:

- `src/ui/components/auth/login-mode.tsx`
- `src/ui/components/auth/set-password-mode.tsx`
- `src/ui/components/sign-up-form.tsx`
- `src/app/(main)/login/page.tsx`
- `src/app/(main)/signup/page.tsx`

Usually these don't need domain-specific changes, but update copy/messaging if needed.

### 4.9 Account Pages (if needed)

- `src/ui/components/account/account-nav.tsx`
- `src/app/(main)/account/` pages

Update navigation labels if domain uses different terminology.

### 4.10 Channel Select

- `src/ui/components/channel-select.tsx` - Update if multi-channel behavior changes
- `src/ui/atoms/link-with-channel.tsx` - Channel-aware link component

---

## Phase 5: Product Catalog (Saleor Configurator)

Generate `config.yml` using the domain profile to inform product modeling.

### Pre-read Required

Read the current `config.yml` to understand the existing structure before replacing it.

### From Discovery (URL was analyzed)

Use observed products, categories, and attributes to generate:

- `productAttributes`: Domain-specific attributes found on the site
- `productTypes`: Grouped by observed product categories
- `categories`: Mirroring the site's navigation structure
- `collections`: For featured/sale/new sections
- `menus`: Navigation matching the domain profile

### Interactive (no URL)

1. Check if a configurator recipe matches the domain
2. If yes, use `/recipe [type]` as starting point, then customize
3. If no recipe fits, use `/configurator init` and guide through:
   - Product types for this domain
   - Attributes specific to this domain
   - Category hierarchy
   - Collections for homepage sections
   - Navigation menu

### From Import (user has data)

Use `csv-importer` or `shopify-importer` agents.

**Always run `config-review` agent after generating config.yml.**

---

## Phase 6: Verify

After all changes are applied:

1. Start the dev server: `pnpm run dev`
2. Use Chrome DevTools MCP to screenshot the result:
   - Homepage
   - Product listing page
   - Product detail page (if products exist)
3. Show screenshots to the user
4. Ask: "How does this look? What would you like to adjust?"
5. Iterate on feedback

---

## Files Modified Summary

### Always modified

| File                   | What Changes                           |
| ---------------------- | -------------------------------------- |
| `src/config/brand.ts`  | Store name, tagline, social links      |
| `src/styles/brand.css` | Color tokens, border radius, dark mode |
| `config.yml`           | Full product catalog configuration     |

### Structurally modified (domain adaptation)

| File                                              | What Changes                                   |
| ------------------------------------------------- | ---------------------------------------------- |
| `src/app/(main)/page.tsx`                         | Homepage layout, hero, content sections        |
| `src/ui/components/plp/product-card.tsx`          | Card aspect ratio, info density, badges, hover |
| `src/ui/components/plp/utils.ts`                  | Product card utility functions                 |
| `src/ui/components/pdp/product-gallery.tsx`       | Gallery style per domain                       |
| `src/ui/components/pdp/product-attributes.tsx`    | Info sections, icons, accordions               |
| `src/ui/components/plp/filter-bar.tsx`            | Domain-specific filters and sort options       |
| `src/ui/components/cart/cart-drawer.tsx`          | Trust signals, threshold, item display         |
| `src/ui/components/cart/cart-drawer-wrapper.tsx`  | Drawer container if needed                     |
| `src/ui/components/nav/components/nav-links.tsx`  | Navigation fallback categories                 |
| `src/ui/components/nav/components/search-bar.tsx` | Search placeholder text                        |
| `src/ui/components/header.tsx`                    | Header structure if needed                     |
| `src/ui/components/footer.tsx`                    | Footer structure, brand text                   |
| `src/ui/components/shared/logo.tsx`               | Logo aspect ratio (if changed)                 |
| `src/ui/components/search-results.tsx`            | Search results display per domain              |

### Multi-tenant store files (if keeping multi-tenant)

| File                                             | What Changes                   |
| ------------------------------------------------ | ------------------------------ |
| `src/app/(main)/store/[store]/page.tsx`          | Store homepage per domain      |
| `src/app/(main)/store/[store]/layout.tsx`        | Store layout                   |
| `src/ui/components/store/store-context.tsx`      | Store context if needed        |
| `src/ui/components/store/store-header-badge.tsx` | Store badge styling            |
| `src/lib/store-data.ts`                          | Demo store data for new domain |

### Conditionally modified

| File                                      | Condition              |
| ----------------------------------------- | ---------------------- |
| `src/app/layout.tsx`                      | Custom font requested  |
| `public/logo.svg`, `public/logo-dark.svg` | Logo files provided    |
| `public/favicon-*.png`                    | Favicon files provided |
| `public/site.webmanifest`                 | Store name changed     |

---

## Interaction Style

- **Batch questions**: Group related questions, don't ask one at a time
- **Show before apply**: Present the domain profile and planned changes before modifying code
- **Smart defaults**: Everything optional should have a domain-appropriate default
- **Iterative**: After applying changes, screenshot and ask for feedback
- **Domain-first**: Lead with "what kind of store" not "what color do you want"
- **Code-aware**: Reference specific files and line numbers when discussing changes

## Example Session

```
User: /remix

Agent: [Phase 0: reads codebase docs in parallel]

I've studied the codebase. Key observations:
- Next.js 16 with App Router, routes under src/app/(main)/
- Multi-tenant store system active (demo stores)
- OKLCH design tokens in src/styles/brand.css
- Variant selection uses a state machine pattern
- Cache Components with PPR for performance

What kind of store are you building? Give me a URL to analyze,
describe your business, or both.

User: I'm building an online optical store. Here's a reference: https://warbyparker.com

Agent: [navigates to site, screenshots homepage, PLP, PDP]

I've analyzed the reference. Here's my domain profile for your optical store:

DOMAIN PROFILE: Optical Store
- Product cards: 4/3 aspect, frame name + price + color dots, "Rx Ready" badges
- PDP: Multi-angle gallery, frame measurements section, color -> lens type selection
- Homepage: Hero with "Find Your Frame" CTA, Shop by Shape, New Arrivals, How It Works
- Filters: Frame Shape, Material, Lens Type, Face Width, Price, Brand
- Cart: "Includes Basic Lenses", "Free Adjustments", "365-Day Warranty"

Does this match what you need? Anything to add or change?

User: Perfect, but add a "Kids" section in the navigation

Agent: Got it. Now let's set up your brand:
- Store name?
- Primary brand color? (I noticed the reference uses a warm navy #002B5C)
- Tagline?
- Do you have logo files ready?

User: "ClearView Optics", keep the navy, tagline "See the world clearly", no logo yet

Agent: [applies all structural changes, generates config.yml]
[starts dev server, takes screenshots]

Here's your store. [shows homepage, PLP, PDP screenshots]
The homepage has a hero section, "Shop by Shape" grid, and New Arrivals.
Product cards show frames in 4:3 with color swatches and "Rx Ready" badges.
The PDP has a multi-angle gallery with frame measurements.

Logo shows the store name as text until you provide SVG files.
What would you like to adjust?
```

## Post-Remix Next Steps

After the remix is complete, inform the user:

1. **Review changes**: `git diff` to see all modifications
2. **Test locally**: `pnpm run dev` to preview
3. **Deploy config**: `pnpm dlx @saleor/configurator deploy` to set up Saleor backend
4. **Add products**: Upload product data and images via Saleor Dashboard
5. **Logo & favicons**: Provide actual logo files when ready
6. **Iterate**: Run `/remix` again or modify individual components as needed
7. **Deep dive**: Read `skills/saleor-paper-storefront/AGENTS.md` for the full compiled guide
