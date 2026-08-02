import { expect, test } from "@playwright/test";

test("guest user icon navigates to login", async ({ page }) => {
	await page.goto("/fr/default-channel", { waitUntil: "networkidle" });

	const loginLink = page.locator('#storefront-header a[href*="/login"]');
	await expect(loginLink).toBeVisible({ timeout: 15_000 });

	await loginLink.click();
	await page.waitForURL(/\/login/, { timeout: 10_000 });
	await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible({
		timeout: 10_000,
	});
});
