#!/usr/bin/env python3
"""Upload glp-1.png to all 73 products in Saleor."""
import json
import urllib.request
import ssl
import uuid
import os

SALEOR_URL = "http://localhost:8000/graphql/"
IMAGE_PATH = "/Users/damienlarquey/storefront/product/glp-1.png"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def get_token():
    payload = json.dumps({
        "query": 'mutation { tokenCreate(email: "admin@example.com", password: "admin") { token } }'
    }).encode()
    req = urllib.request.Request(SALEOR_URL, data=payload,
                                 headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
        return json.loads(resp.read())["data"]["tokenCreate"]["token"]


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


def multipart_upload(token, product_id, image_path):
    """Upload image via multipart/form-data GraphQL mutation."""
    boundary = f"----FormBoundary{uuid.uuid4().hex}"

    # The GraphQL mutation
    operations = json.dumps({
        "query": """
            mutation ProductMediaCreate($product: ID!, $image: Upload!, $alt: String) {
                productMediaCreate(input: { product: $product, image: $image, alt: $alt }) {
                    media { id url }
                    errors { field message }
                }
            }
        """,
        "variables": {
            "product": product_id,
            "image": None,
            "alt": "Product image"
        }
    })

    # The map tells which variable maps to which file
    file_map = json.dumps({"0": ["variables.image"]})

    # Read image
    with open(image_path, "rb") as f:
        image_data = f.read()

    filename = os.path.basename(image_path)

    # Build multipart body
    parts = []

    # Part 1: operations
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(b'Content-Disposition: form-data; name="operations"\r\n\r\n')
    parts.append(operations.encode())
    parts.append(b"\r\n")

    # Part 2: map
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(b'Content-Disposition: form-data; name="map"\r\n\r\n')
    parts.append(file_map.encode())
    parts.append(b"\r\n")

    # Part 3: file
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(f'Content-Disposition: form-data; name="0"; filename="{filename}"\r\n'.encode())
    parts.append(b"Content-Type: image/png\r\n\r\n")
    parts.append(image_data)
    parts.append(b"\r\n")

    # End boundary
    parts.append(f"--{boundary}--\r\n".encode())

    body = b"".join(parts)

    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Authorization": f"Bearer {token}",
    }

    req = urllib.request.Request(SALEOR_URL, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
            result = json.loads(resp.read())
            if "errors" in result:
                return False, result["errors"]
            data = result.get("data", {}).get("productMediaCreate", {})
            errs = data.get("errors", [])
            if errs:
                return False, errs
            return True, data.get("media", {})
    except Exception as e:
        return False, str(e)


def main():
    print("Uploading glp-1.png to all products...")
    print(f"Image: {IMAGE_PATH} ({os.path.getsize(IMAGE_PATH) // 1024}KB)")

    token = get_token()
    print("Authenticated\n")

    # Get all product IDs
    all_products = []
    has_next = True
    cursor = None

    while has_next:
        after = f', after: "{cursor}"' if cursor else ""
        result = gql(f"""
            query {{
                products(first: 100{after}) {{
                    edges {{
                        node {{ id name }}
                        cursor
                    }}
                    pageInfo {{ hasNextPage }}
                }}
            }}
        """, token=token)
        edges = result.get("products", {}).get("edges", [])
        for e in edges:
            all_products.append((e["node"]["id"], e["node"]["name"]))
            cursor = e["cursor"]
        has_next = result.get("products", {}).get("pageInfo", {}).get("hasNextPage", False)

    print(f"Found {len(all_products)} products\n")

    success = 0
    failed = 0

    for i, (pid, pname) in enumerate(all_products, 1):
        # Refresh token every 20 uploads
        if i % 20 == 1 and i > 1:
            token = get_token()
            print("  [Token refreshed]")

        ok, result = multipart_upload(token, pid, IMAGE_PATH)
        if ok:
            success += 1
            print(f"  [{i}/{len(all_products)}] {pname} - OK")
        else:
            failed += 1
            print(f"  [{i}/{len(all_products)}] {pname} - FAILED: {result}")

    print(f"\nDone: {success} uploaded, {failed} failed")


if __name__ == "__main__":
    main()
