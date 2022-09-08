# Payment gateways configuration

Saleor App Checkout supports two configurable payment gateways:

<a href="https://www.mollie.com/en">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../logos/mollie_light.svg">
    <source media="(prefers-color-scheme: light)" srcset="../logos/mollie_dark.svg">
    <img alt="Mollie" src="../logos/mollie_dark.svg">
  </picture>
</a>

Read setup guide in [docs/payment/mollie.md](../payment/mollie.md)

<br>

[![Adyen](../logos/adyen.svg)](https://www.adyen.com/)

Read setup guide in [docs/payment/adyen.md](../payment/adyen.md)

<br>

[![Stripe](./../logos/stripe_blurple.svg)](https://stripe.com/)

Read setup guide in [docs/payment/stripe.md](../payment/stripe.md)

---

You can configure the payment gateways in the Saleor App Checkout inside the Saleor dashboard.
Go to **Apps > Third party apps > Checkout**.

You can toggle, which payment gateway handles each different payment options per channel:

![Configuration options: Credit Card, Apple Pay, PayPal that are available in Saleor App Checkout dashboard](../screenshots/config-dashboard-1.png)

To use a payment gateway, you need to provide its credentials. You can do that by clicking the settings icon on the channel configuration page.

![Payment gateway configuration in Saleor dashboard](../screenshots/config-dashboard-2.png)
