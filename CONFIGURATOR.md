# Saleor Configurator

Define your entire Saleor data model — channels, categories, collections, product types, attributes, menus — in a single `config.yml` file, then deploy it to any Saleor instance.

## Why

Instead of clicking through the Dashboard to create categories, attributes, and product types one by one, you declare everything in YAML and deploy it. This gives you:

- **Reproducible setups** — spin up identical stores across environments
- **Version control** — track data model changes in git alongside your storefront code
- **AI-assisted modeling** — use Claude Code slash commands to generate and validate configs

## Quick Start

### 1. Generate a config

Use the built-in slash commands in Claude Code:

```
/configurator init          # Start from a skeleton template
/recipe fashion             # Start from a pre-built recipe (fashion, electronics, etc.)
/discover https://example.com  # Generate config by analyzing an existing website
```

Or create `config.yml` manually (see [Schema](#schema) below).

### 2. Validate

```
/configurator validate
```

Checks YAML syntax, required fields, cross-references (e.g., products referencing valid product types), and best practices.

### 3. Deploy

```bash
pnpm dlx @saleor/configurator deploy --url=https://your-instance.saleor.cloud/graphql/ --token=YOUR_TOKEN
```

Preview changes first with `diff`:

```bash
pnpm dlx @saleor/configurator diff --url=https://your-instance.saleor.cloud/graphql/ --token=YOUR_TOKEN
```

## Slash Commands

| Command                  | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| `/configurator init`     | Create a new `config.yml` from skeleton                                |
| `/configurator validate` | Validate config for errors and warnings                                |
| `/configurator edit`     | Interactive menu to add/modify/remove entities                         |
| `/configurator review`   | Deep review for best practices and common mistakes                     |
| `/recipe [type]`         | Apply a pre-built template (fashion, electronics, food, subscriptions) |
| `/discover [url]`        | Generate config from an existing website or Saleor instance            |
| `/configurator-model`    | Interactive wizard for designing product types and catalog structure   |
| `/configurator-fix`      | Auto-fix common config.yml issues                                      |

## Schema

The config file supports these top-level sections:

```yaml
shop: # Store name, description, email settings
channels: # Sales channels (currency, country, stock settings)
productAttributes: # Reusable product attributes (color, size, material, etc.)
contentAttributes: # Reusable content/page attributes
productTypes: # Product type definitions referencing attributes
categories: # Hierarchical category tree
collections: # Curated product groups with channel listings
products: # Products with variants, pricing, and inventory
warehouses: # Inventory locations
shippingZones: # Geographic shipping regions with methods
taxClasses: # Tax rate configurations
menus: # Navigation menus with nested items
pageTypes: # Content page type definitions
pages: # Content pages (about, contact, etc.)
```

### Entity identification

- **Slug-based**: channels, categories, collections, products, warehouses, menus, pages
- **Name-based**: productTypes, pageTypes, productAttributes, contentAttributes, taxClasses, shippingZones

### Attribute types

`DROPDOWN`, `MULTISELECT`, `RICH_TEXT`, `PLAIN_TEXT`, `NUMERIC`, `BOOLEAN`, `DATE`, `DATE_TIME`, `SWATCH`, `FILE`, `REFERENCE`

For `SWATCH` type, each value takes a `value` field with a hex color code.

### Minimal example

```yaml
channels:
  - name: "US Store"
    slug: "us-store"
    currencyCode: USD
    defaultCountry: US

productAttributes:
  - name: "Size"
    type: DROPDOWN
    values:
      - name: "S"
      - name: "M"
      - name: "L"

productTypes:
  - name: "T-Shirt"
    isShippingRequired: true
    variantAttributes:
      - name: "Size"

categories:
  - name: "Clothing"
    slug: "clothing"

collections:
  - name: "New Arrivals"
    slug: "new-arrivals"
    channelListings:
      - channel: "us-store"
        isPublished: true
```

## Introspecting an Existing Instance

Pull the current state of a Saleor instance into a config file:

```bash
pnpm dlx @saleor/configurator introspect --url=https://your-instance.saleor.cloud/graphql/ --token=YOUR_TOKEN
```

## CI/CD

Use `diff` in CI to preview changes before deploying:

```bash
pnpm dlx @saleor/configurator diff --url=$SALEOR_URL --token=$SALEOR_TOKEN
# Review output, then:
pnpm dlx @saleor/configurator deploy --url=$SALEOR_URL --token=$SALEOR_TOKEN
```
