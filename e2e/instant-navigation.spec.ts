import { expect, test } from "@playwright/test";
import { instant } from "@next/playwright";

const browsePath = "/en/default-channel";

test.describe("instant navigations (Next.js 16.3)", () => {
	test("PLP → PDP shows product title immediately after click", async ({ page }) => {
		await page.goto(`${browsePath}/products`);

		const firstProductLink = page.locator('article a[href*="/products/"]').first();
		await expect(firstProductLink).toBeVisible({ timeout: 30_000 });

		await instant(page, async () => {
			await firstProductLink.click();
			await expect(page.locator("h1").first()).toBeVisible();
		});
	});

	test("homepage category tile → category shows hero immediately", async ({ page }) => {
		await page.goto(browsePath);

		const categoryTile = page.locator('a[href*="/categories/"]').first();
		await expect(categoryTile).toBeVisible({ timeout: 30_000 });

		await instant(page, async () => {
			await categoryTile.click();
			await expect(page.locator("h1").first()).toBeVisible();
		});
	});

	test("homepage featured product → PDP shows title immediately", async ({ page }) => {
		await page.goto(browsePath);

		const featuredProduct = page.locator('a[href*="/products/"]').first();
		await expect(featuredProduct).toBeVisible({ timeout: 30_000 });

		await instant(page, async () => {
			await featuredProduct.click();
			await expect(page.locator("h1").first()).toBeVisible();
		});
	});
});

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

		// Bring a below-the-fold product into view and click it *in place*. Clicking an
		// off-screen item would make Playwright auto-scroll the list (changing — and saving —
		// a different offset), which doesn't reflect a real user clicking a visible product.
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

		// Forward again must land at the true top (the breadcrumb-tuck regression).
		await target.click();
		await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
		await expect.poll(() => scrollY(page), { timeout: 5_000 }).toBeLessThan(5);
	});
});
