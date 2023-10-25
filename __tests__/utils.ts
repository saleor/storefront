import { expect, type Page } from "@playwright/test";

export async function clickOnRandomProductElement({ page }: { page: Page }) {
	const productLinks = page.getByTestId("ProductElement");
	await productLinks.first().waitFor();
	const count = await productLinks.count();
	const randomProductLink = productLinks.nth(Math.floor(Math.random() * count));

	const name = await randomProductLink.getByRole("heading").textContent();
	const priceRange = await randomProductLink.getByTestId("ProductElement_PriceRange").textContent();
	const category = await randomProductLink.getByTestId("ProductElement_Category").textContent();

	await randomProductLink.click();

	await page.waitForURL("**/products/*");

	expect(name, "Missing product name").toBeTruthy();
	expect(priceRange, "Missing product priceRange").toBeTruthy();
	expect(category, "Missing product category").toBeTruthy();
	return { name: name!, priceRange: priceRange!, category: category! };
}

export async function getCurrentProductPrice({ page }: { page: Page }) {
	const price = await page.getByTestId("ProductElement_Price").textContent();
	expect(price, "Missing product price").toBeTruthy();
	return Number.parseFloat(price!.replace(/[^0-9\.]/g, ""));
}

export async function selectRandomAvailableVariant({ page }: { page: Page }) {
	// some products only have a single variant so this block can throw and it's expected
	try {
		await page.getByTestId("VariantSelector").waitFor({ timeout: 1000 });
		const variant = page.getByTestId("VariantSelector").getByRole("radio", { disabled: false });
		const count = await variant.count();
		if (count > 0) {
			await variant.nth(Math.floor(Math.random() * count)).click();
		}
	} catch {}

	await page.waitForURL(/\?variant=.+/);
}

export async function addCurrentProductToCart({ page }: { page: Page }) {
	expect(page.url()).toContain("/products/");
	expect(page.url()).toContain("?variant=");
	await page.getByRole("button", { name: "Add to cart" }).click();
}

export async function openCart({ page }: { page: Page }) {
	await page.getByTestId("CartNavItem").click();
	await page.getByText("Your Shopping Cart").waitFor();
}
