import { expect, test, type Page } from "@playwright/test";

/**
 * Cart chrome freshness after the cost-model change (paper-vercel-cost rule):
 * server actions call `refresh()` instead of sitewide `revalidatePath`, and other
 * tabs sync via the localStorage chrome version (`HeaderChromeSync`).
 *
 * These specs cover the regression surface of that change: the badge/drawer must
 * update in the acting tab purely from the action response, and a second tab must
 * pick the change up without navigating.
 */

const browsePath = "/fr/default-channel";
/** Apparel SKU with size variant preselected — add-to-cart enabled on load. */
const productPath = `${browsePath}/products/ascii-tee?size=s&variant=UHJvZHVjdFZhcmlhbnQ6MzQ4`;

const badgeSelector = '[data-testid="CartNavItem"] span:not(.sr-only)';

async function addToCart(page: Page): Promise<void> {
	const button = page.locator("button:not([disabled])", { hasText: /ajouter|add to (cart|bag)/i }).first();
	await expect(button).toBeVisible({ timeout: 15_000 });
	await button.click();
}

test("add to cart updates badge and drawer in the acting tab without reload", async ({ page }) => {
	await page.goto(productPath);
	const heading = page.locator("h1").first();
	await expect(heading).toBeVisible({ timeout: 30_000 });
	const productName = (await heading.textContent())?.trim();
	expect(productName).toBeTruthy();

	// No navigation follows the click — the badge can only appear if the server
	// action's refresh() re-rendered the header chrome for this user.
	await addToCart(page);
	await expect(page.locator(badgeSelector)).toHaveText("1", { timeout: 20_000 });

	// Second mutation must re-render again (no one-shot invalidation artifact).
	await addToCart(page);
	await expect(page.locator(badgeSelector)).toHaveText("2", { timeout: 20_000 });

	// Drawer content comes from the same re-rendered chrome.
	await page.locator('[data-testid="CartNavItem"]').click();
	await expect(page.getByRole("dialog")).toContainText(productName as string, { timeout: 10_000 });
});

test("cart change in another tab updates this tab without navigation", async ({ page, context }) => {
	await page.goto(browsePath, { waitUntil: "networkidle" });
	await expect(page.locator('[data-testid="CartNavItem"]')).toBeVisible({ timeout: 30_000 });
	await expect(page.locator(badgeSelector)).toHaveCount(0);

	const otherTab = await context.newPage();
	await otherTab.goto(productPath);
	await expect(otherTab.locator("h1").first()).toBeVisible({ timeout: 30_000 });
	await addToCart(otherTab);
	await expect(otherTab.locator(badgeSelector)).toHaveText("1", { timeout: 20_000 });

	// First tab: bumpChromeVersion() in the other tab fires a storage event here;
	// HeaderChromeSync must router.refresh() and surface the shared cart cookie.
	await expect(page.locator(badgeSelector)).toHaveText("1", { timeout: 20_000 });
	await otherTab.close();
});
