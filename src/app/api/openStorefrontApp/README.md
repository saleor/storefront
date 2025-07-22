# Open Storefront App

This directory provides an example of integrating the Saleor Dashboard with the Storefront. After installing this app, the product editing view in the dashboard will display a convenient link that opens the corresponding product page in the Storefront.

## Requirements

- Saleor version >=3.22.0-a.0
- `NEXT_PUBLIC_STOREFRONT_URL` and `NEXT_PUBLIC_DEFAULT_CHANNEL` environment variables configured

## Installation

- deploy Storefront or [tunnel it](https://docs.saleor.io/developer/extending/apps/developing-with-tunnels)
- go to the Saleor Dashboard, open section `Extensions`
- click on `Add Extension` and choose `Install from manifest`
- enter the manifest address: `https://[public address of the storefront]/api/openStorefrontApp/manifest` and install it
