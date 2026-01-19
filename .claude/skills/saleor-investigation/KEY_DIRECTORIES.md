# Saleor Core Key Directories

Reference for navigating the Saleor source code when investigating API behavior.

## Clone Command

```bash
cd /tmp && git clone --depth 1 https://github.com/saleor/saleor.git saleor-core
```

## Directory Structure

| Path                        | Purpose                          |
| --------------------------- | -------------------------------- |
| `saleor/graphql/`           | GraphQL schema, resolvers, types |
| `saleor/graphql/product/`   | Product queries/mutations        |
| `saleor/graphql/attribute/` | Attribute handling               |
| `saleor/graphql/checkout/`  | Checkout operations              |
| `saleor/graphql/order/`     | Order processing                 |
| `saleor/graphql/account/`   | User/authentication              |
| `saleor/product/models.py`  | Product Django models            |
| `saleor/attribute/models/`  | Attribute Django models          |
| `saleor/checkout/models.py` | Checkout Django models           |
| `saleor/order/models.py`    | Order Django models              |

## Common Investigation Patterns

### Finding a Resolver

```bash
# Find where a field is resolved
grep -r "def resolve_" saleor/graphql/product/
```

### Understanding Permission Logic

```bash
# Find permission checks
grep -r "has_perm" saleor/graphql/product/resolvers.py

# Find permission decorators
grep -r "@permission_required" saleor/graphql/
```

### Finding Mutation Logic

```bash
# Find mutation perform methods
grep -r "def perform_mutation" saleor/graphql/checkout/
```

### Tracing Data Loaders

```bash
# Find data loader definitions
grep -r "class.*Loader" saleor/graphql/product/dataloaders/
```

## Key Files by Feature

### Products

- `saleor/graphql/product/types/products.py` - Product type definition
- `saleor/graphql/product/resolvers.py` - Product query resolvers
- `saleor/graphql/product/mutations/products.py` - Product mutations

### Attributes

- `saleor/graphql/attribute/types.py` - Attribute types
- `saleor/graphql/attribute/resolvers.py` - Attribute resolvers
- `saleor/attribute/models/base.py` - Core attribute model

### Checkout

- `saleor/graphql/checkout/types.py` - Checkout type
- `saleor/graphql/checkout/mutations/` - Checkout mutations
- `saleor/checkout/calculations.py` - Price calculations

### Permissions

- `saleor/graphql/core/enums.py` - Permission enum definitions
- `saleor/permission/enums.py` - Backend permission enums

## Token-Based Data Filtering

Saleor filters data based on authentication:

| Token Type              | What's Returned                          |
| ----------------------- | ---------------------------------------- |
| None (anonymous)        | Only public, `visibleInStorefront` items |
| Customer JWT            | Same as anonymous + user's own data      |
| App with specific perms | Based on granted permissions             |
| App with `MANAGE_*`     | ALL data for that domain                 |

This applies to many "visible in storefront" flags across Saleor.
