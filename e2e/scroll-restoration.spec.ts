import { expect, test } from "@playwright/test";

const browsePath = "/en/default-channel";

test.describe("scroll restoration (forward → top, Back → restore)", () => {
	const scrollTo = (page: import("@playwright/test").Page, y: number) =>
		page.evaluate((top) => window.scrollTo({ top, left: 0, behavior: "instant" }), y);
	const scrollY = (page: import("@playwright/test").Page) => page.evaluate(() => window.scrollY);

	test("PLP scroll → PDP (top) → Back (restored) → PDP (top)", async ({ page }) => {
		await page.goto(`${browsePath}/products`);

		const products = page.locator('article a[href*="/products/"]');
		await expect(products.first()).toBeVisible({ timeout: 30_000 });
		const count = await products.count();
		expect(count).toBeGreaterThan(3);

		// Bring a below-the-fold product into view and click it in place.
		const target = products.nth(Math.min(5, count - 1));
		await target.scrollIntoViewIfNeeded();
		const plpOffset = await scrollY(page);
		expect(plpOffset).toBeGreaterThan(50);

		// Forward to a PDP: must land at the true top (breadcrumbs visible, not tucked).
		await target.click();
		await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
		await expect.poll(() => scrollY(page), { timeout: 5_000 }).toBeLessThan(5);

		// Scroll the PDP, then go Back to the PLP.
		await scrollTo(page, 800);
		await page.goBack();
		await expect(products.first()).toBeVisible({ timeout: 30_000 });

		// Back must restore the PLP offset (the regression: it reset to top).
		await expect.poll(() => scrollY(page), { timeout: 5_000 }).toBeGreaterThan(plpOffset - 50);

		// Forward again must land at the true top.
		await target.click();
		await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
		await expect.poll(() => scrollY(page), { timeout: 5_000 }).toBeLessThan(5);
	});
});
