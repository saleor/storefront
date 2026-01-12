# Reference Code

This folder contains reference implementations that are **excluded from the build** but kept for documentation purposes.

## Contents

### `checkout-sections/PaymentSection/`

Payment gateway integrations for:

- **Adyen** (`AdyenDropIn/`) - Drop-in payment component
- **Stripe** (`StripeV2DropIn/`) - Stripe Elements integration
- **Dummy** (`DummyDropIn/`) - Test/development payment flow

These were part of an older checkout implementation. Refer to them when implementing payment integrations in the current checkout flow.

## Note

Files in this folder:

- Are **not** compiled by TypeScript (excluded in `tsconfig.json`)
- Are **not** analyzed by knip (excluded in `knip.config.ts`)
- May have broken imports (dependencies were removed)

To use this code, copy relevant parts to the main source tree and fix imports.
