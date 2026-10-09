import { expect, test } from "@playwright/test";
import { browsePath } from "./helpers/browse-path";

const productsPath = `${browsePath}/products`;

test.describe("PLP filters", () => {
	test("a value facet updates the URL and the grid", async ({ page }) => {
		await page.goto(productsPath);
		const grid = page.getByTestId("ProductList");
		// The static first-page grid (Suspense fallback) and the interactive one coexist while
		// the island streams in, and the static filter bar ignores clicks. Wait for the swap.
		await expect(grid).toHaveCount(1, { timeout: 30_000 });
		await expect(grid).toBeVisible();
		const firstHref = await grid.locator("a").first().getAttribute("href");

		// Saleor facets come from the cards on the page, so use whichever value facet this store has.
		await page
			.getByRole("button", { name: /^(Color|Size)$/ })
			.first()
			.click();
		const option = page.getByRole("menuitemcheckbox").first();
		await expect(option).toBeVisible();
		await option.click();

		await expect(page).toHaveURL(/(colors|sizes)=/);
		await expect(grid).toBeVisible();
		const filteredHref = await grid.locator("a").first().getAttribute("href");
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
