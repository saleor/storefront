---
name: saleor-investigation
description: Investigate Saleor API behavior by checking source code. Use when API behavior is unclear from docs, getting unexpected permission errors, or need to understand exact data model.
allowed-tools: Read, Bash, WebSearch
---

# Saleor API Investigation

## When to Use

Use this skill when:

- Saleor API behavior is unclear from documentation
- You're getting unexpected permission errors
- You need to understand the exact data model
- Documentation doesn't answer your question

## Instructions

### 1. Check Documentation First

- [Saleor API Reference](https://docs.saleor.io/api-reference) - GraphQL schema
- [Saleor Developer Docs](https://docs.saleor.io/developer) - Guides and concepts

### 2. Clone Saleor Core (Source of Truth)

When docs aren't enough, check the source:

```bash
cd /tmp && git clone --depth 1 https://github.com/saleor/saleor.git saleor-core
```

### 3. Key Directories

For detailed directory structure and grep patterns, see [KEY_DIRECTORIES.md](KEY_DIRECTORIES.md).

| Path                       | Purpose                          |
| -------------------------- | -------------------------------- |
| `saleor/graphql/`          | GraphQL schema, resolvers, types |
| `saleor/graphql/product/`  | Product queries/mutations        |
| `saleor/product/models.py` | Product Django models            |

## Examples

### Example: Does `product.attributes` filter by `visibleInStorefront`?

**Investigation** in `saleor/graphql/product/resolvers.py`:

```python
def resolve_product_attributes(root, info, *, limit):
    if requestor_has_access_to_all_attributes(info.context):
        dataloader = AttributesByProductIdAndLimitLoader        # Admin: ALL
    else:
        dataloader = AttributesVisibleToCustomerByProductIdAndLimitLoader  # Customer: FILTERED
```

**Conclusion**: Yes, storefront users only see `visibleInStorefront=True` attributes. No client-side filtering needed.

### Example: Token-Based Data Filtering

Saleor filters data based on authentication:

| Token                      | `product.attributes` returns    |
| -------------------------- | ------------------------------- |
| None (anonymous)           | Only `visibleInStorefront=True` |
| Customer JWT               | Only `visibleInStorefront=True` |
| App with `MANAGE_PRODUCTS` | ALL attributes                  |

This applies to many "visible in storefront" flags across Saleor.

## Key Insights

### Storefront Auto-Filtering

When building storefront features, you typically don't need to:

- Fetch `visibleInStorefront` field
- Filter data client-side

The API already returns only what's meant to be shown based on your token.

### Product Types Control Variant Attributes

Which attributes appear on variants is configured at the **ProductType** level:

Dashboard → Configuration → Product Types → [Type] → Variant Attributes

If an attribute doesn't appear in `variant.attributes`, check the ProductType configuration.

## Anti-patterns

❌ **Don't guess API behavior** - Check the source  
❌ **Don't filter `visibleInStorefront` client-side** - API does it  
❌ **Don't assume attribute presence** - Check ProductType config
