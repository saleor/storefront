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
