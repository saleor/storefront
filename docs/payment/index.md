# Payment gateways configuration

Saleor App Checkout supports two payment gateways that you can configure:

<a href="https://www.mollie.com/en">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/logos/mollie_light.svg">
    <source media="(prefers-color-scheme: light)" srcset="./docs/logos/mollie_dark.svg">
    <img alt="Mollie" src="./docs/logos/mollie_dark.svg">
  </picture>
</a>

<br>

[![Adyen](./docs/logos/adyen.svg)](https://www.adyen.com/)

You can configure the payment gateways in the Saleor App Checkout inside the Saleor dashboard.
Go to **Apps > Third party apps > Checkout**.

You can toggle, which payment gateway handles each different payment options per channel:

![Configuration options: Credit Card, Apple Pay, PayPal that are available in Saleor App Checkout dashboard](./docs/screenshots/config-dashboard-1.png)

To use a payment gateway, you need to provide its credentials. You can do that by clicking the settings icon on the channel configuration page.

![Payment gateway configuration in Saleor dashboard](./docs/screenshots/config-dashboard-2.png)

## Mollie

Read setup guide in [docs/payment/mollie.md](./docs/payment/mollie.md)

## Adyen

Read setup guide in [docs/payment/adyen.md](./docs/payment/adyen.md)
