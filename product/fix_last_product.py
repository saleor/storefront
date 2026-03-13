#!/usr/bin/env python3
"""Fix the one failed product: AOD-9604 + Tesamorelin + MOTS-c Blend (SEO title too long)."""
import json
import time
import urllib.request
import ssl

SALEOR_URL = "http://localhost:8000/graphql/"
CHANNEL_ID = "Q2hhbm5lbDox"
WAREHOUSE_ID = "V2FyZWhvdXNlOjNiMjY5ZjU4LTg2MDYtNGJjOC04ZmFmLTE3ZTA5OWQwNzU2ZQ=="

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def gql(query, variables=None, token=None):
    payload = json.dumps({"query": query, "variables": variables or {}}).encode()
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(SALEOR_URL, data=payload, headers=headers, method="POST")
    with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
        result = json.loads(resp.read())
        if "errors" in result:
            print(f"  GQL errors: {result['errors']}")
        return result.get("data", {})

# Auth
data = gql("""mutation { tokenCreate(email: "admin@example.com", password: "admin") { token } }""")
token = data["tokenCreate"]["token"]
print("Authenticated")

# Get Peptide Blend type ID
types = gql("{ productTypes(first: 50) { edges { node { id name } } } }", token=token)
pt_id = None
for e in types["productTypes"]["edges"]:
    if e["node"]["name"] == "Peptide Blend":
        pt_id = e["node"]["id"]
        break
print(f"Peptide Blend type: {pt_id}")

# Get Peptide Blends category ID
cats = gql("{ categories(first: 50) { edges { node { id name } } } }", token=token)
cat_id = None
for e in cats["categories"]["edges"]:
    if e["node"]["name"] == "Peptide Blends":
        cat_id = e["node"]["id"]
        break
print(f"Peptide Blends category: {cat_id}")

# Create product
desc_json = json.dumps({
    "time": int(time.time() * 1000),
    "blocks": [{"id": "fix001", "data": {"text": "A research blend combining AOD-9604, Tesamorelin, and MOTS-c peptides, studied for synergistic effects on metabolism and body composition. Each vial contains lyophilized powder."}, "type": "paragraph"}],
    "version": "2.22.2"
})

result = gql("""
    mutation ProductCreate($input: ProductCreateInput!) {
        productCreate(input: $input) {
            product { id name }
            errors { field message }
        }
    }
""", {
    "input": {
        "name": "AOD-9604 + Tesamorelin + MOTS-c Blend",
        "slug": "aod-9604-tesamorelin-mots-c-blend",
        "productType": pt_id,
        "category": cat_id,
        "description": desc_json,
        "seo": {
            "title": "AOD-9604 + Tesamorelin + MOTS-c Blend | Research",
            "description": "Purchase AOD-9604 + Tesamorelin + MOTS-c Blend for research. High purity, lab-tested. Fast shipping."
        }
    }
}, token=token)

product = result.get("productCreate", {}).get("product")
if not product:
    print(f"FAILED: {result}")
    exit(1)
pid = product["id"]
print(f"Product created: {pid}")

# Channel listing
gql("""
    mutation ProductChannelListingUpdate($id: ID!, $input: ProductChannelListingUpdateInput!) {
        productChannelListingUpdate(id: $id, input: $input) {
            errors { field message }
        }
    }
""", {
    "id": pid,
    "input": {
        "updateChannels": [{
            "channelId": CHANNEL_ID,
            "isPublished": True,
            "isAvailableForPurchase": True,
            "visibleInListings": True,
        }]
    }
}, token=token)
print("Channel listing set")

# Variant
result2 = gql("""
    mutation ProductVariantBulkCreate($id: ID!, $inputs: [ProductVariantBulkCreateInput!]!) {
        productVariantBulkCreate(product: $id, variants: $inputs) {
            productVariants { id name }
            errors { field message index }
        }
    }
""", {
    "id": pid,
    "inputs": [{
        "name": "15mg (AOD 5mg + Tesa 5mg + MOTS-c 5mg) Vial",
        "sku": "ATM15",
        "attributes": [],
        "channelListings": [{"channelId": CHANNEL_ID, "price": "294.00", "costPrice": "98.00"}],
        "stocks": [{"warehouse": WAREHOUSE_ID, "quantity": 100}],
        "weight": 0.05,
    }]
}, token=token)
print(f"Variant result: {result2}")

# Add to Weight Management collection
cols = gql('{ collections(first: 50, channel: "default-channel") { edges { node { id name } } } }', token=token)
wm_id = None
for e in cols["collections"]["edges"]:
    if e["node"]["name"] == "Weight Management":
        wm_id = e["node"]["id"]
        break

gql("""
    mutation CollectionAddProducts($id: ID!, $products: [ID!]!) {
        collectionAddProducts(collectionId: $id, products: $products) {
            errors { field message }
        }
    }
""", {"id": wm_id, "products": [pid]}, token=token)
print("Added to Weight Management collection")
print("\nDONE - 73/73 products complete!")
