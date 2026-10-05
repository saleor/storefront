import { expect, test } from "@playwright/test";

const productsPath = "/en/default-channel/products";

test.describe("PLP filters", () => {
	test("a color filter updates the URL and the grid", async ({ page }) => {
		await page.goto(productsPath);
		await expect(page.getByTestId("ProductList")).toBeVisible({ timeout: 30_000 });
		const firstHref = await page.locator('[data-testid="ProductList"] a').first().getAttribute("href");

		await page.getByRole("button", { name: "Color" }).click();
		const option = page.getByRole("menuitemcheckbox").first();
		await expect(option).toBeVisible();
		await option.click();

		await expect(page).toHaveURL(/colors=/);
		await expect(page.getByTestId("ProductList")).toBeVisible();
		const filteredHref = await page.locator('[data-testid="ProductList"] a').first().getAttribute("href");
		expect(filteredHref).toBeTruthy();
		expect(firstHref).toBeTruthy();
	});

	test("next then previous returns the first page", async ({ page }) => {
		await page.goto(productsPath);
		const first = page.locator('[data-testid="ProductList"] a').first();
		await expect(first).toBeVisible({ timeout: 30_000 });
		const firstHref = await first.getAttribute("href");

		const next = page.getByRole("link", { name: "Next" });
		await expect(next).toBeVisible();
		await next.click();
		await expect(page).toHaveURL(/cursor=/);
		await expect(page.locator('[data-testid="ProductList"] a').first()).toBeVisible();

		await page.getByRole("link", { name: "Previous" }).click();
		await expect(page.locator('[data-testid="ProductList"] a').first()).toHaveAttribute(
			"href",
			firstHref ?? "",
		);
	});
});
