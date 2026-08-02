import { expect, type Page } from "@playwright/test";

const browsePath = "/fr/default-channel";
/** Apparel SKU with size variant — shipping required. */
const checkoutProductPath = `${browsePath}/products/ascii-tee?size=s&variant=UHJvZHVjdFZhcmlhbnQ6MzQ4`;
const checkoutLocale = "fr";

type CheckoutStepSlug = "contact" | "shipping" | "payment";

/** Mirrors `updateCheckoutQuery({ step })` + `recordCheckoutStepIntent` for e2e setup. */
export async function simulateCheckoutStep(page: Page, step: CheckoutStepSlug): Promise<void> {
	await page.evaluate((stepSlug) => {
		const key = "__checkoutQueryState";
		const holder = globalThis;
		if (!holder[key]) {
			holder[key] = { historyEventsPatched: false, intendedStepSlug: null };
		}
		holder[key].intendedStepSlug = stepSlug;

		const params = new URLSearchParams(window.location.search);
		params.set("step", stepSlug);
		const url = `${window.location.pathname}?${params}`;
		window.history.pushState(window.history.state, "", url);
		window.dispatchEvent(new Event("checkout:query-change"));
	}, step);
}

export async function addFirstProductAndOpenCheckout(page: Page): Promise<void> {
	await page.goto(checkoutProductPath);
	await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });

	const addToCart = page.locator("button:not([disabled])", { hasText: /ajouter|add to (cart|bag)/i }).first();
	await expect(addToCart).toBeVisible({ timeout: 15_000 });
	await addToCart.click();

	await expect
		.poll(
			async () => {
				const cookies = await page.context().cookies();
				return cookies.find((c) => c.name.startsWith("checkoutId-") && c.value)?.value ?? null;
			},
			{ timeout: 15_000 },
		)
		.not.toBeNull();

	const cookies = await page.context().cookies();
	const checkoutId = cookies.find((c) => c.name.startsWith("checkoutId-") && c.value)?.value;
	if (!checkoutId) {
		throw new Error("checkoutId cookie missing after add-to-cart");
	}

	await page.goto(`/checkout?checkout=${checkoutId}&step=contact&locale=${checkoutLocale}`);
	await expect(page).toHaveURL(/\/checkout\?.*checkout=/, { timeout: 30_000 });
	await expect(page.getByRole("textbox", { name: /adresse e-mail|email address/i })).toBeVisible({
		timeout: 30_000,
	});
}

/** Assert `?step=` and that it stays stable — catches guard/heal fighting browser Back. */
export async function expectStep(
	page: Page,
	step: string,
	stableMs = 2_000,
	pollTimeout = 10_000,
): Promise<void> {
	await expect.poll(() => readCheckoutStep(page), { timeout: pollTimeout }).toBe(step);
	await page.waitForTimeout(stableMs);
	await expect.poll(() => readCheckoutStep(page), { timeout: 1_000 }).toBe(step);
}

export function readCheckoutStep(page: Page): Promise<string | null> {
	return page.evaluate(() => new URLSearchParams(window.location.search).get("step"));
}

export async function advanceToShipping(page: Page): Promise<void> {
	await simulateCheckoutStep(page, "shipping");
	await expectStep(page, "shipping");
}

export async function advanceToPayment(page: Page): Promise<void> {
	await simulateCheckoutStep(page, "payment");
	await expectStep(page, "payment");
}
