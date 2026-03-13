#!/usr/bin/env python3
"""
Saleor Product Import Script for InfinityBio catalog.

Connects to Saleor GraphQL API, clears demo data, creates product types,
categories, collections, and imports all products from CSV.

Usage:
    python3 import_products.py
"""

import csv
import json
import random
import string
import time
import urllib.request
import urllib.error
import ssl

# =============================================================================
# Configuration
# =============================================================================

SALEOR_URL = "http://localhost:8000/graphql/"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin"

CHANNEL_SLUG = "default-channel"
CHANNEL_ID = "Q2hhbm5lbDox"
WAREHOUSE_ID = "V2FyZWhvdXNlOjNiMjY5ZjU4LTg2MDYtNGJjOC04ZmFmLTE3ZTA5OWQwNzU2ZQ=="
DEFAULT_CATEGORY_ID = "Q2F0ZWdvcnk6MQ=="

CSV_PATH = "/Users/damienlarquey/storefront/product/infinitybio_products_catalog.csv"

PRODUCT_TYPES = [
    "Peptide",
    "Peptide Blend",
    "Hormone",
    "Injectable",
    "Injectable Blend",
    "Supply",
]

CATEGORIES = [
    "GLP-1 Receptor Agonists",
    "Growth Factors",
    "Growth Hormone",
    "Growth Hormone Secretagogues",
    "Hormones",
    "Injectables",
    "Nootropic Peptides",
    "Peptide Blends",
    "Peptides",
    "Supplies",
]

COLLECTIONS = [
    "Accessories",
    "Aesthetics",
    "Anti-Aging & Longevity",
    "Cognitive & Mood",
    "Fertility & Hormonal",
    "Growth & Recovery",
    "Immune Support",
    "Performance",
    "Recovery & Healing",
    "Sexual Health",
    "Sleep & Recovery",
    "Tanning & Skin",
    "Vitamins & Supplements",
    "Weight Management",
]


# =============================================================================
# Helpers
# =============================================================================

def random_block_id(length=10):
    """Generate a random alphanumeric block ID for EditorJS."""
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=length))


def make_description_json(text):
    """Convert plain text to EditorJS JSON format."""
    if not text or not text.strip():
        return ""
    return json.dumps({
        "time": int(time.time() * 1000),
        "blocks": [
            {
                "id": random_block_id(),
                "data": {"text": text.strip()},
                "type": "paragraph",
            }
        ],
        "version": "2.22.2",
    })


def slugify(name):
    """Simple slugify: lowercase, replace spaces and special chars with hyphens."""
    slug = name.lower()
    result = []
    for ch in slug:
        if ch.isalnum():
            result.append(ch)
        elif ch in (" ", "_", "&"):
            result.append("-")
        # skip other special characters
    slug = "-".join(part for part in "".join(result).split("-") if part)
    return slug


class SaleorClient:
    """Simple GraphQL client for Saleor using only stdlib."""

    def __init__(self, url):
        self.url = url
        self.token = None
        self.token_time = 0
        self.refresh_token = None

    def authenticate(self):
        """Obtain a new auth token."""
        print("\n[AUTH] Authenticating...")
        result = self.execute(
            """
            mutation TokenCreate($email: String!, $password: String!) {
                tokenCreate(email: $email, password: $password) {
                    token
                    refreshToken
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            auth=False,
        )
        data = result.get("tokenCreate", {})
        errors = data.get("errors", [])
        if errors:
            raise Exception(f"Authentication failed: {errors}")
        self.token = data["token"]
        self.refresh_token = data.get("refreshToken")
        self.token_time = time.time()
        print("[AUTH] Authenticated successfully.")

    def ensure_auth(self):
        """Re-authenticate if token is older than 4 minutes."""
        if not self.token or (time.time() - self.token_time) > 240:
            if self.refresh_token:
                # Try to refresh
                result = self.execute(
                    """
                    mutation TokenRefresh($refreshToken: String!) {
                        tokenRefresh(refreshToken: $refreshToken) {
                            token
                            errors {
                                field
                                message
                            }
                        }
                    }
                    """,
                    {"refreshToken": self.refresh_token},
                    auth=False,
                )
                data = result.get("tokenRefresh", {})
                errors = data.get("errors", [])
                if not errors and data.get("token"):
                    self.token = data["token"]
                    self.token_time = time.time()
                    print("[AUTH] Token refreshed.")
                    return
            # Fallback: full re-auth
            self.authenticate()

    def execute(self, query, variables=None, auth=True):
        """Execute a GraphQL query/mutation."""
        if auth:
            self.ensure_auth()

        payload = json.dumps({
            "query": query,
            "variables": variables or {},
        }).encode("utf-8")

        headers = {"Content-Type": "application/json"}
        if auth and self.token:
            headers["Authorization"] = f"Bearer {self.token}"

        req = urllib.request.Request(self.url, data=payload, headers=headers, method="POST")

        try:
            # Allow self-signed certs in dev
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE

            with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
                body = resp.read().decode("utf-8")
                result = json.loads(body)
                if "errors" in result:
                    print(f"  [GQL ERROR] {result['errors']}")
                return result.get("data", {})
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8") if e.fp else ""
            print(f"  [HTTP ERROR] {e.code}: {body[:500]}")
            return {}
        except Exception as e:
            print(f"  [ERROR] {e}")
            return {}


# =============================================================================
# Delete operations
# =============================================================================

def delete_all_products(client):
    """Delete all existing products."""
    print("\n" + "=" * 60)
    print("STEP 1: Deleting all existing products...")
    print("=" * 60)

    # Query all product IDs
    has_next = True
    cursor = None
    all_ids = []

    while has_next:
        after_clause = f', after: "{cursor}"' if cursor else ""
        result = client.execute(f"""
            query {{
                products(first: 100{after_clause}) {{
                    edges {{
                        node {{
                            id
                            name
                        }}
                        cursor
                    }}
                    pageInfo {{
                        hasNextPage
                    }}
                }}
            }}
        """)
        products = result.get("products", {})
        edges = products.get("edges", [])
        for edge in edges:
            all_ids.append((edge["node"]["id"], edge["node"]["name"]))
            cursor = edge["cursor"]
        has_next = products.get("pageInfo", {}).get("hasNextPage", False)

    print(f"  Found {len(all_ids)} products to delete.")

    for i, (pid, pname) in enumerate(all_ids, 1):
        result = client.execute(
            """
            mutation ProductDelete($id: ID!) {
                productDelete(id: $id) {
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {"id": pid},
        )
        errors = result.get("productDelete", {}).get("errors", [])
        if errors:
            print(f"  [{i}/{len(all_ids)}] FAILED to delete '{pname}': {errors}")
        else:
            print(f"  [{i}/{len(all_ids)}] Deleted '{pname}'")

    print(f"  Done. Deleted {len(all_ids)} products.")


def delete_all_product_types(client):
    """Delete all existing product types."""
    print("\n" + "=" * 60)
    print("STEP 2: Deleting all existing product types...")
    print("=" * 60)

    has_next = True
    cursor = None
    all_ids = []

    while has_next:
        after_clause = f', after: "{cursor}"' if cursor else ""
        result = client.execute(f"""
            query {{
                productTypes(first: 100{after_clause}) {{
                    edges {{
                        node {{
                            id
                            name
                        }}
                        cursor
                    }}
                    pageInfo {{
                        hasNextPage
                    }}
                }}
            }}
        """)
        pt = result.get("productTypes", {})
        edges = pt.get("edges", [])
        for edge in edges:
            all_ids.append((edge["node"]["id"], edge["node"]["name"]))
            cursor = edge["cursor"]
        has_next = pt.get("pageInfo", {}).get("hasNextPage", False)

    print(f"  Found {len(all_ids)} product types to delete.")

    for i, (ptid, ptname) in enumerate(all_ids, 1):
        result = client.execute(
            """
            mutation ProductTypeDelete($id: ID!) {
                productTypeDelete(id: $id) {
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {"id": ptid},
        )
        errors = result.get("productTypeDelete", {}).get("errors", [])
        if errors:
            print(f"  [{i}/{len(all_ids)}] FAILED to delete '{ptname}': {errors}")
        else:
            print(f"  [{i}/{len(all_ids)}] Deleted '{ptname}'")

    print(f"  Done. Deleted {len(all_ids)} product types.")


def delete_all_categories(client):
    """Delete all categories except Default Category."""
    print("\n" + "=" * 60)
    print("STEP 3: Deleting all categories (except Default Category)...")
    print("=" * 60)

    has_next = True
    cursor = None
    all_ids = []

    while has_next:
        after_clause = f', after: "{cursor}"' if cursor else ""
        result = client.execute(f"""
            query {{
                categories(first: 100{after_clause}) {{
                    edges {{
                        node {{
                            id
                            name
                        }}
                        cursor
                    }}
                    pageInfo {{
                        hasNextPage
                    }}
                }}
            }}
        """)
        cats = result.get("categories", {})
        edges = cats.get("edges", [])
        for edge in edges:
            nid = edge["node"]["id"]
            nname = edge["node"]["name"]
            if nid != DEFAULT_CATEGORY_ID:
                all_ids.append((nid, nname))
            cursor = edge["cursor"]
        has_next = cats.get("pageInfo", {}).get("hasNextPage", False)

    print(f"  Found {len(all_ids)} categories to delete (keeping Default Category).")

    for i, (cid, cname) in enumerate(all_ids, 1):
        result = client.execute(
            """
            mutation CategoryDelete($id: ID!) {
                categoryDelete(id: $id) {
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {"id": cid},
        )
        errors = result.get("categoryDelete", {}).get("errors", [])
        if errors:
            print(f"  [{i}/{len(all_ids)}] FAILED to delete '{cname}': {errors}")
        else:
            print(f"  [{i}/{len(all_ids)}] Deleted '{cname}'")

    print(f"  Done. Deleted {len(all_ids)} categories.")


def delete_all_collections(client):
    """Delete all existing collections."""
    print("\n" + "=" * 60)
    print("STEP 4: Deleting all existing collections...")
    print("=" * 60)

    has_next = True
    cursor = None
    all_ids = []

    while has_next:
        after_clause = f', after: "{cursor}"' if cursor else ""
        result = client.execute(f"""
            query {{
                collections(first: 100{after_clause}, channel: "{CHANNEL_SLUG}") {{
                    edges {{
                        node {{
                            id
                            name
                        }}
                        cursor
                    }}
                    pageInfo {{
                        hasNextPage
                    }}
                }}
            }}
        """)
        cols = result.get("collections", {})
        edges = cols.get("edges", [])
        for edge in edges:
            all_ids.append((edge["node"]["id"], edge["node"]["name"]))
            cursor = edge["cursor"]
        has_next = cols.get("pageInfo", {}).get("hasNextPage", False)

    print(f"  Found {len(all_ids)} collections to delete.")

    for i, (cid, cname) in enumerate(all_ids, 1):
        result = client.execute(
            """
            mutation CollectionDelete($id: ID!) {
                collectionDelete(id: $id) {
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {"id": cid},
        )
        errors = result.get("collectionDelete", {}).get("errors", [])
        if errors:
            print(f"  [{i}/{len(all_ids)}] FAILED to delete '{cname}': {errors}")
        else:
            print(f"  [{i}/{len(all_ids)}] Deleted '{cname}'")

    print(f"  Done. Deleted {len(all_ids)} collections.")


# =============================================================================
# Create operations
# =============================================================================

def create_product_types(client):
    """Create all product types. Returns dict: name -> ID."""
    print("\n" + "=" * 60)
    print("STEP 5: Creating product types...")
    print("=" * 60)

    pt_map = {}
    for pt_name in PRODUCT_TYPES:
        slug = slugify(pt_name)
        result = client.execute(
            """
            mutation ProductTypeCreate($input: ProductTypeInput!) {
                productTypeCreate(input: $input) {
                    productType {
                        id
                        name
                    }
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {
                "input": {
                    "name": pt_name,
                    "slug": slug,
                    "isShippingRequired": True,
                    "isDigital": False,
                    "productAttributes": [],
                    "variantAttributes": [],
                }
            },
        )
        data = result.get("productTypeCreate", {})
        errors = data.get("errors", [])
        if errors:
            print(f"  FAILED '{pt_name}': {errors}")
        else:
            pt = data.get("productType", {})
            pt_map[pt_name] = pt["id"]
            print(f"  Created '{pt_name}' -> {pt['id']}")

    return pt_map


def create_categories(client):
    """Create all categories. Returns dict: name -> ID."""
    print("\n" + "=" * 60)
    print("STEP 6: Creating categories...")
    print("=" * 60)

    cat_map = {}
    for cat_name in CATEGORIES:
        slug = slugify(cat_name)
        result = client.execute(
            """
            mutation CategoryCreate($input: CategoryInput!) {
                categoryCreate(input: $input) {
                    category {
                        id
                        name
                    }
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {
                "input": {
                    "name": cat_name,
                    "slug": slug,
                }
            },
        )
        data = result.get("categoryCreate", {})
        errors = data.get("errors", [])
        if errors:
            print(f"  FAILED '{cat_name}': {errors}")
        else:
            cat = data.get("category", {})
            cat_map[cat_name] = cat["id"]
            print(f"  Created '{cat_name}' -> {cat['id']}")

    return cat_map


def create_collections(client):
    """Create all collections and publish them in default-channel. Returns dict: name -> ID."""
    print("\n" + "=" * 60)
    print("STEP 7: Creating collections...")
    print("=" * 60)

    col_map = {}
    for col_name in COLLECTIONS:
        slug = slugify(col_name)
        result = client.execute(
            """
            mutation CollectionCreate($input: CollectionCreateInput!) {
                collectionCreate(input: $input) {
                    collection {
                        id
                        name
                    }
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {
                "input": {
                    "name": col_name,
                    "slug": slug,
                }
            },
        )
        data = result.get("collectionCreate", {})
        errors = data.get("errors", [])
        if errors:
            print(f"  FAILED to create '{col_name}': {errors}")
            continue

        col = data.get("collection", {})
        col_id = col["id"]
        col_map[col_name] = col_id
        print(f"  Created '{col_name}' -> {col_id}")

        # Now make it visible in default-channel
        result2 = client.execute(
            """
            mutation CollectionChannelListingUpdate($id: ID!, $input: CollectionChannelListingUpdateInput!) {
                collectionChannelListingUpdate(id: $id, input: $input) {
                    collection {
                        id
                    }
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {
                "id": col_id,
                "input": {
                    "addChannels": [
                        {
                            "channelId": CHANNEL_ID,
                            "isPublished": True,
                        }
                    ],
                },
            },
        )
        errors2 = result2.get("collectionChannelListingUpdate", {}).get("errors", [])
        if errors2:
            print(f"    WARNING: Failed to publish '{col_name}' in channel: {errors2}")
        else:
            print(f"    Published in {CHANNEL_SLUG}")

    return col_map


# =============================================================================
# Product import
# =============================================================================

def read_csv_products():
    """Read CSV and group rows by product_name. Returns ordered list of product dicts."""
    products = {}
    product_order = []

    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["product_name"]
            if name not in products:
                products[name] = {
                    "product_name": row["product_name"],
                    "product_slug": row["product_slug"],
                    "product_type": row["product_type"],
                    "category": row["category"],
                    "description": row["description"],
                    "seo_title": row.get("seo_title", ""),
                    "seo_description": row.get("seo_description", ""),
                    "collection": row["collection"],
                    "is_published": row.get("is_published", "true").lower() == "true",
                    "variants": [],
                }
                product_order.append(name)

            products[name]["variants"].append({
                "variant_name": row["variant_name"],
                "sku": row["sku"],
                "price_usd": row["price_usd"],
                "cost_price_usd": row["cost_price_usd"],
                "stock_quantity": int(row.get("stock_quantity", 0)),
                "weight_kg": row.get("weight_kg", ""),
            })

    return [products[name] for name in product_order]


def create_product(client, product_data, pt_map, cat_map, col_map):
    """Create a single product with its variants and collection assignment."""
    name = product_data["product_name"]
    slug = product_data["product_slug"]
    description_json = make_description_json(product_data["description"])

    # Look up IDs
    pt_id = pt_map.get(product_data["product_type"])
    cat_id = cat_map.get(product_data["category"])
    col_id = col_map.get(product_data["collection"])

    if not pt_id:
        print(f"    WARNING: Product type '{product_data['product_type']}' not found, skipping '{name}'")
        return False
    if not cat_id:
        print(f"    WARNING: Category '{product_data['category']}' not found, skipping '{name}'")
        return False

    # Build input (channelListings is NOT part of ProductCreateInput)
    product_input = {
        "name": name,
        "slug": slug,
        "productType": pt_id,
        "category": cat_id,
    }
    if description_json:
        product_input["description"] = description_json

    # Add SEO if present
    seo_title = product_data.get("seo_title", "").strip()
    seo_desc = product_data.get("seo_description", "").strip()
    if seo_title or seo_desc:
        product_input["seo"] = {}
        if seo_title:
            product_input["seo"]["title"] = seo_title
        if seo_desc:
            product_input["seo"]["description"] = seo_desc

    # Create product
    result = client.execute(
        """
        mutation ProductCreate($input: ProductCreateInput!) {
            productCreate(input: $input) {
                product {
                    id
                    name
                }
                errors {
                    field
                    message
                }
            }
        }
        """,
        {"input": product_input},
    )

    data = result.get("productCreate", {})
    errors = data.get("errors", [])
    if errors:
        print(f"    FAILED to create product '{name}': {errors}")
        return False

    product = data.get("product")
    if not product or "id" not in product:
        print(f"    FAILED to create product '{name}': no product returned")
        return False
    product_id = product["id"]

    # Set channel listing separately
    client.execute(
        """
        mutation ProductChannelListingUpdate($id: ID!, $input: ProductChannelListingUpdateInput!) {
            productChannelListingUpdate(id: $id, input: $input) {
                errors {
                    field
                    message
                    channels
                }
            }
        }
        """,
        {
            "id": product_id,
            "input": {
                "updateChannels": [
                    {
                        "channelId": CHANNEL_ID,
                        "isPublished": product_data["is_published"],
                        "isAvailableForPurchase": True,
                        "visibleInListings": True,
                    }
                ],
            },
        },
    )

    # Create variants via bulk
    variant_inputs = []
    for v in product_data["variants"]:
        vi = {
            "name": v["variant_name"],
            "sku": v["sku"],
            "attributes": [],
            "channelListings": [
                {
                    "channelId": CHANNEL_ID,
                    "price": v["price_usd"],
                    **({"costPrice": v["cost_price_usd"]} if v.get("cost_price_usd") else {}),
                }
            ],
            "stocks": [
                {
                    "warehouse": WAREHOUSE_ID,
                    "quantity": v["stock_quantity"],
                }
            ],
        }
        if v.get("weight_kg"):
            try:
                vi["weight"] = float(v["weight_kg"])
            except (ValueError, TypeError):
                pass
        variant_inputs.append(vi)

    result2 = client.execute(
        """
        mutation ProductVariantBulkCreate($id: ID!, $inputs: [ProductVariantBulkCreateInput!]!) {
            productVariantBulkCreate(product: $id, variants: $inputs) {
                productVariants {
                    id
                    name
                    sku
                }
                errors {
                    field
                    message
                    index
                }
            }
        }
        """,
        {"id": product_id, "inputs": variant_inputs},
    )

    data2 = result2.get("productVariantBulkCreate", {})
    errors2 = data2.get("errors", [])
    created_variants = data2.get("productVariants", [])
    if errors2:
        print(f"    WARNING: Variant errors for '{name}': {errors2}")
    variant_count = len(created_variants) if created_variants else 0

    # Add to collection
    if col_id:
        result3 = client.execute(
            """
            mutation CollectionAddProducts($id: ID!, $products: [ID!]!) {
                collectionAddProducts(collectionId: $id, products: $products) {
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {"id": col_id, "products": [product_id]},
        )
        errors3 = result3.get("collectionAddProducts", {}).get("errors", [])
        if errors3:
            print(f"    WARNING: Failed to add '{name}' to collection: {errors3}")

    return True


def import_products(client, pt_map, cat_map, col_map):
    """Read CSV and create all products."""
    print("\n" + "=" * 60)
    print("STEP 8: Importing products from CSV...")
    print("=" * 60)

    products = read_csv_products()
    total = len(products)
    success = 0
    failed = 0

    for i, product_data in enumerate(products, 1):
        # Re-auth every 10 products to be safe
        if i % 10 == 1:
            client.ensure_auth()

        name = product_data["product_name"]
        variant_count = len(product_data["variants"])
        collection = product_data["collection"]
        print(f"\n  [{i}/{total}] Creating '{name}' ({variant_count} variants, collection: '{collection}')...")

        ok = create_product(client, product_data, pt_map, cat_map, col_map)
        if ok:
            success += 1
            print(f"    OK")
        else:
            failed += 1

    return success, failed


# =============================================================================
# Main
# =============================================================================

def main():
    print("=" * 60)
    print("InfinityBio Saleor Product Import Script")
    print("=" * 60)
    print(f"API:       {SALEOR_URL}")
    print(f"Channel:   {CHANNEL_SLUG}")
    print(f"Warehouse: Default Warehouse")
    print(f"CSV:       {CSV_PATH}")

    client = SaleorClient(SALEOR_URL)
    client.authenticate()

    # Phase 1: Delete existing data
    delete_all_products(client)
    delete_all_product_types(client)
    delete_all_categories(client)
    delete_all_collections(client)

    # Phase 2: Create taxonomy
    pt_map = create_product_types(client)
    cat_map = create_categories(client)
    col_map = create_collections(client)

    print("\n--- Lookup maps ---")
    print(f"  Product Types: {len(pt_map)} created")
    print(f"  Categories:    {len(cat_map)} created")
    print(f"  Collections:   {len(col_map)} created")

    # Phase 3: Import products
    success, failed = import_products(client, pt_map, cat_map, col_map)

    # Summary
    print("\n" + "=" * 60)
    print("IMPORT COMPLETE")
    print("=" * 60)
    print(f"  Product Types: {len(pt_map)}")
    print(f"  Categories:    {len(cat_map)}")
    print(f"  Collections:   {len(col_map)}")
    print(f"  Products:      {success} created, {failed} failed")
    print("=" * 60)


if __name__ == "__main__":
    main()
