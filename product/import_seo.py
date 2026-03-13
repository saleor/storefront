#!/usr/bin/env python3
"""
Saleor SEO Import Script for InfinityBio catalog.

Reads SEO data from CSV and updates existing products with:
- Product type attributes (Purity, Form, Storage, etc.)
- Rich descriptions (EditorJS 3-paragraph format)
- Product attributes (purity, form, storage, etc.)
- SEO fields (title, description)
- FAQ and reference metadata

Usage:
    python3 import_seo.py
"""

import csv
import json
import os
import random
import string
import time
import urllib.request
import urllib.error
import ssl

# =============================================================================
# Configuration (override via environment variables for production)
# =============================================================================

SALEOR_URL = os.environ.get("SALEOR_URL", "http://localhost:8000/graphql/")
ADMIN_EMAIL = os.environ.get("SALEOR_ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.environ.get("SALEOR_ADMIN_PASSWORD", "admin")

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.environ.get("SEO_CSV_PATH", os.path.join(SCRIPT_DIR, "infinitybio_products_seo_test.csv"))

PRODUCT_TYPE_NAMES = [
    "Peptide",
    "Peptide Blend",
    "Hormone",
    "Injectable",
    "Injectable Blend",
    "Supply",
]

# Attributes to create and assign to all product types
SEO_ATTRIBUTES = [
    {"name": "Purity", "slug": "purity", "input_type": "PLAIN_TEXT"},
    {"name": "Form", "slug": "form", "input_type": "PLAIN_TEXT"},
    {"name": "Storage", "slug": "storage", "input_type": "PLAIN_TEXT"},
    {"name": "Molecular Weight", "slug": "molecular-weight", "input_type": "PLAIN_TEXT"},
    {"name": "CAS Number", "slug": "cas-number", "input_type": "PLAIN_TEXT"},
    {"name": "Sequence", "slug": "sequence", "input_type": "PLAIN_TEXT"},
    {"name": "Origin", "slug": "origin", "input_type": "PLAIN_TEXT"},
    {"name": "Solubility", "slug": "solubility", "input_type": "PLAIN_TEXT"},
    {"name": "Research Category", "slug": "research-category", "input_type": "PLAIN_TEXT"},
]

# Map CSV column names to attribute slugs
CSV_TO_ATTR_SLUG = {
    "purity": "purity",
    "form": "form",
    "storage": "storage",
    "molecular_weight": "molecular-weight",
    "cas_number": "cas-number",
    "sequence": "sequence",
    "origin": "origin",
    "solubility": "solubility",
    "research_category": "research-category",
}

# Metadata keys to import from CSV
FAQ_KEYS = [
    "faq_1_q", "faq_1_a",
    "faq_2_q", "faq_2_a",
    "faq_3_q", "faq_3_a",
    "faq_4_q", "faq_4_a",
    "faq_5_q", "faq_5_a",
]

REF_KEYS = ["ref_1", "ref_2", "ref_3"]


# =============================================================================
# Helpers
# =============================================================================

def random_block_id(length=10):
    """Generate a random alphanumeric block ID for EditorJS."""
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=length))


def make_description_json(paragraphs):
    """Convert a list of paragraph strings to EditorJS JSON format."""
    blocks = []
    for p in paragraphs:
        if p and p.strip():
            blocks.append({
                "id": random_block_id(),
                "data": {"text": p.strip()},
                "type": "paragraph",
            })
    if not blocks:
        return ""
    return json.dumps({
        "time": int(time.time() * 1000),
        "blocks": blocks,
        "version": "2.22.2",
    })


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
# Step 1: Create attributes and assign to product types
# =============================================================================

def create_attributes(client):
    """Create all SEO attributes. Returns dict: slug -> ID."""
    print("\n" + "=" * 60)
    print("STEP 1: Creating product attributes...")
    print("=" * 60)

    attr_map = {}  # slug -> id

    for attr_def in SEO_ATTRIBUTES:
        name = attr_def["name"]
        slug = attr_def["slug"]
        input_type = attr_def["input_type"]

        result = client.execute(
            """
            mutation AttributeCreate($input: AttributeCreateInput!) {
                attributeCreate(input: $input) {
                    attribute {
                        id
                        slug
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
                    "name": name,
                    "slug": slug,
                    "type": "PRODUCT_TYPE",
                    "inputType": input_type,
                }
            },
        )

        data = result.get("attributeCreate", {})
        errors = data.get("errors", [])
        if errors:
            # Attribute might already exist - try to find it
            print(f"  WARNING creating '{name}': {errors}")
            print(f"  Attempting to find existing attribute '{slug}'...")
            existing_id = find_attribute_by_slug(client, slug)
            if existing_id:
                attr_map[slug] = existing_id
                print(f"  Found existing '{name}' -> {existing_id}")
            else:
                print(f"  FAILED to create or find attribute '{name}'")
        else:
            attr = data.get("attribute", {})
            attr_map[slug] = attr["id"]
            print(f"  Created '{name}' (slug: {slug}) -> {attr['id']}")

    return attr_map


def find_attribute_by_slug(client, slug):
    """Find an attribute by slug. Returns ID or None."""
    result = client.execute(
        """
        query AttributeSearch($filter: AttributeFilterInput!) {
            attributes(filter: $filter, first: 1) {
                edges {
                    node {
                        id
                        slug
                    }
                }
            }
        }
        """,
        {"filter": {"slugs": [slug]}},
    )
    edges = result.get("attributes", {}).get("edges", [])
    if edges:
        return edges[0]["node"]["id"]
    return None


def get_product_type_ids(client):
    """Fetch all product types and return dict: name -> ID."""
    print("\n" + "=" * 60)
    print("STEP 2: Fetching product types...")
    print("=" * 60)

    pt_map = {}
    has_next = True
    cursor = None

    while has_next:
        after_clause = f', after: "{cursor}"' if cursor else ""
        result = client.execute(f"""
            query {{
                productTypes(first: 100{after_clause}) {{
                    edges {{
                        node {{
                            id
                            name
                            productAttributes {{
                                id
                                slug
                            }}
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
            node = edge["node"]
            pt_map[node["name"]] = {
                "id": node["id"],
                "existing_attr_ids": [a["id"] for a in node.get("productAttributes", [])],
            }
            cursor = edge["cursor"]
        has_next = pt.get("pageInfo", {}).get("hasNextPage", False)

    for name, info in pt_map.items():
        print(f"  Found '{name}' -> {info['id']} ({len(info['existing_attr_ids'])} existing attrs)")

    return pt_map


def assign_attributes_to_product_types(client, pt_map, attr_map):
    """Assign all SEO attributes to each product type."""
    print("\n" + "=" * 60)
    print("STEP 3: Assigning attributes to product types...")
    print("=" * 60)

    new_attr_ids = list(attr_map.values())

    for pt_name in PRODUCT_TYPE_NAMES:
        pt_info = pt_map.get(pt_name)
        if not pt_info:
            print(f"  WARNING: Product type '{pt_name}' not found, skipping.")
            continue

        pt_id = pt_info["id"]
        existing_ids = pt_info["existing_attr_ids"]

        # Merge existing + new attribute IDs (avoid duplicates)
        all_attr_ids = list(set(existing_ids + new_attr_ids))

        result = client.execute(
            """
            mutation ProductTypeUpdate($id: ID!, $input: ProductTypeInput!) {
                productTypeUpdate(id: $id, input: $input) {
                    productType {
                        id
                        name
                        productAttributes {
                            id
                            slug
                        }
                    }
                    errors {
                        field
                        message
                    }
                }
            }
            """,
            {
                "id": pt_id,
                "input": {
                    "productAttributes": all_attr_ids,
                },
            },
        )

        data = result.get("productTypeUpdate", {})
        errors = data.get("errors", [])
        if errors:
            print(f"  FAILED to update '{pt_name}': {errors}")
        else:
            pt_data = data.get("productType", {})
            attr_count = len(pt_data.get("productAttributes", []))
            print(f"  Updated '{pt_name}' -> {attr_count} attributes assigned")


# =============================================================================
# Step 2: Process products from CSV
# =============================================================================

def read_csv():
    """Read the SEO CSV file. Returns list of row dicts."""
    rows = []
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def find_product_by_slug(client, slug):
    """Find a product by slug. Returns (product_id, product_name) or (None, None)."""
    result = client.execute(
        """
        query FindProduct($slugs: [String!]) {
            products(filter: {slugs: $slugs}, first: 1) {
                edges {
                    node {
                        id
                        name
                        slug
                    }
                }
            }
        }
        """,
        {"slugs": [slug]},
    )
    edges = result.get("products", {}).get("edges", [])
    if edges:
        node = edges[0]["node"]
        return node["id"], node["name"]
    return None, None


def update_product_description(client, product_id, product_name, paragraphs):
    """Update product description with 3 EditorJS paragraphs."""
    description_json = make_description_json(paragraphs)
    if not description_json:
        print(f"    [DESCRIPTION] No description paragraphs, skipping.")
        return True

    result = client.execute(
        """
        mutation ProductUpdate($id: ID!, $input: ProductInput!) {
            productUpdate(id: $id, input: $input) {
                product {
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
            "id": product_id,
            "input": {
                "description": description_json,
            },
        },
    )

    data = result.get("productUpdate", {})
    errors = data.get("errors", [])
    if errors:
        print(f"    [DESCRIPTION] FAILED for '{product_name}': {errors}")
        return False
    print(f"    [DESCRIPTION] Updated ({len(paragraphs)} paragraphs)")
    return True


def update_product_attributes(client, product_id, product_name, row, attr_map):
    """Update product attributes (purity, form, storage, etc.)."""
    attributes = []
    for csv_col, attr_slug in CSV_TO_ATTR_SLUG.items():
        value = row.get(csv_col, "").strip()
        if not value:
            continue
        attr_id = attr_map.get(attr_slug)
        if not attr_id:
            print(f"    [ATTRIBUTES] WARNING: No ID for attribute '{attr_slug}', skipping.")
            continue
        attributes.append({
            "id": attr_id,
            "plainText": value,
        })

    if not attributes:
        print(f"    [ATTRIBUTES] No attribute values to set, skipping.")
        return True

    result = client.execute(
        """
        mutation ProductUpdate($id: ID!, $input: ProductInput!) {
            productUpdate(id: $id, input: $input) {
                product {
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
            "id": product_id,
            "input": {
                "attributes": attributes,
            },
        },
    )

    data = result.get("productUpdate", {})
    errors = data.get("errors", [])
    if errors:
        print(f"    [ATTRIBUTES] FAILED for '{product_name}': {errors}")
        return False
    print(f"    [ATTRIBUTES] Updated ({len(attributes)} attributes set)")
    return True


def update_product_seo(client, product_id, product_name, row):
    """Update product SEO title and description."""
    seo_title = row.get("seo_title", "").strip()
    seo_description = row.get("seo_description", "").strip()

    if not seo_title and not seo_description:
        print(f"    [SEO] No SEO data, skipping.")
        return True

    seo_input = {}
    if seo_title:
        seo_input["title"] = seo_title
    if seo_description:
        seo_input["description"] = seo_description

    result = client.execute(
        """
        mutation ProductUpdate($id: ID!, $input: ProductInput!) {
            productUpdate(id: $id, input: $input) {
                product {
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
            "id": product_id,
            "input": {
                "seo": seo_input,
            },
        },
    )

    data = result.get("productUpdate", {})
    errors = data.get("errors", [])
    if errors:
        print(f"    [SEO] FAILED for '{product_name}': {errors}")
        return False
    print(f"    [SEO] Updated (title: {'yes' if seo_title else 'no'}, desc: {'yes' if seo_description else 'no'})")
    return True


def update_product_metadata(client, product_id, product_name, row):
    """Update product FAQ and reference metadata."""
    metadata = []

    for key in FAQ_KEYS + REF_KEYS:
        value = row.get(key, "").strip()
        if value:
            metadata.append({"key": key, "value": value})

    if not metadata:
        print(f"    [METADATA] No metadata to set, skipping.")
        return True

    result = client.execute(
        """
        mutation UpdateMetadata($id: ID!, $input: [MetadataInput!]!) {
            updateMetadata(id: $id, input: $input) {
                item {
                    metadata {
                        key
                        value
                    }
                }
                errors {
                    field
                    message
                }
            }
        }
        """,
        {
            "id": product_id,
            "input": metadata,
        },
    )

    data = result.get("updateMetadata", {})
    errors = data.get("errors", [])
    if errors:
        print(f"    [METADATA] FAILED for '{product_name}': {errors}")
        return False
    print(f"    [METADATA] Updated ({len(metadata)} keys set)")
    return True


def process_product(client, row, attr_map):
    """Process a single product row: description, attributes, SEO, metadata."""
    slug = row.get("product_slug", "").strip()
    if not slug:
        print("  WARNING: Empty slug, skipping row.")
        return False

    # Find product by slug
    product_id, product_name = find_product_by_slug(client, slug)
    if not product_id:
        print(f"  WARNING: Product with slug '{slug}' not found, skipping.")
        return False

    print(f"  Found product '{product_name}' (ID: {product_id})")

    # a. Update description (3 paragraphs)
    paragraphs = [
        row.get("description_p1", "").strip(),
        row.get("description_p2", "").strip(),
        row.get("description_p3", "").strip(),
    ]
    # Filter out empty paragraphs
    paragraphs = [p for p in paragraphs if p]
    update_product_description(client, product_id, product_name, paragraphs)

    # b. Update product attributes
    update_product_attributes(client, product_id, product_name, row, attr_map)

    # c. Update SEO
    update_product_seo(client, product_id, product_name, row)

    # d. Update metadata (FAQs + references)
    update_product_metadata(client, product_id, product_name, row)

    return True


# =============================================================================
# Main
# =============================================================================

def main():
    print("=" * 60)
    print("InfinityBio Saleor SEO Import Script")
    print("=" * 60)
    print(f"API:  {SALEOR_URL}")
    print(f"CSV:  {CSV_PATH}")

    client = SaleorClient(SALEOR_URL)
    client.authenticate()

    # Phase 1: Create attributes and assign to product types
    attr_map = create_attributes(client)
    print(f"\n  Attribute map: {len(attr_map)} attributes ready")
    for slug, attr_id in attr_map.items():
        print(f"    {slug} -> {attr_id}")

    pt_map = get_product_type_ids(client)
    assign_attributes_to_product_types(client, pt_map, attr_map)

    # Phase 2: Process each product from CSV
    print("\n" + "=" * 60)
    print("STEP 4: Processing products from CSV...")
    print("=" * 60)

    rows = read_csv()
    total = len(rows)
    success = 0
    failed = 0

    for i, row in enumerate(rows, 1):
        # Re-auth check every 5 products
        if i % 5 == 1:
            client.ensure_auth()

        slug = row.get("product_slug", "").strip()
        print(f"\n  [{i}/{total}] Processing slug: '{slug}'")

        try:
            ok = process_product(client, row, attr_map)
            if ok:
                success += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  ERROR processing '{slug}': {e}")
            failed += 1

    # Summary
    print("\n" + "=" * 60)
    print("SEO IMPORT COMPLETE")
    print("=" * 60)
    print(f"  Attributes created: {len(attr_map)}")
    print(f"  Product types updated: {len([n for n in PRODUCT_TYPE_NAMES if n in pt_map])}")
    print(f"  Products processed: {success} success, {failed} failed (out of {total})")
    print("=" * 60)


if __name__ == "__main__":
    main()
