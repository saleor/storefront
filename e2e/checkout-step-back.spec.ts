import { expect, test } from "@playwright/test";

import {
	addFirstProductAndOpenCheckout,
	advanceToPayment,
	advanceToShipping,
	expectStep,
} from "./helpers/checkout-flow";

/**
 * Regression: browser Back must adopt popstate intent before CheckoutStepUrlGuard
 * re-heals the pre-Back step. Without the macrotask heal, `?step=` snaps back to
 * shipping and the shopper stays trapped on the old step.
 *
 * Step advances use shallow history (same mechanism as Continue) without Saleor
 * form submission — this isolates popstate ordering from address-validation noise.
 */
test.describe("checkout shallow step URL — browser Back", () => {
	test.describe.configure({ mode: "serial", timeout: 120_000 });

	test("Back from shipping lands on contact and stays there", async ({ page }) => {
		await addFirstProductAndOpenCheckout(page);
		await expectStep(page, "contact");

		await advanceToShipping(page);

		await page.goBack();
		await expectStep(page, "contact");
	});

	test("Back from payment walks shipping then contact", async ({ page }) => {
		await addFirstProductAndOpenCheckout(page);
		await advanceToShipping(page);
		await advanceToPayment(page);

		await page.goBack();
		await expectStep(page, "shipping");

		await page.goBack();
		await expectStep(page, "contact");
	});
});
