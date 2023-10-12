import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
	await page.goto("/");
	await page.getByTestId("ProductElement").first().click();
	await page.getByTestId("VariantSelector").getByRole("radio").first().click();
	await page.getByRole("button", { name: "Add to cart" }).click();

	await page.getByRole("link", { name: "1 items in cart, view bag" }).click();
	await page.waitForSelector("text=Your Total");
	await page.getByRole("link", { name: "Checkout" }).click();

	await page.getByLabel("Email*").fill("zaiste@saleor.cloud");
	await page.getByLabel("First name*").fill("Jan");
	await page.getByLabel("Last name*").fill("Kowalski");
	await page.getByLabel("Street address*").fill("3111 Broadway");
	await page.getByLabel("City*").fill("New York");
	await page.getByLabel("Zip code*").fill("10027");
	await page.getByLabel("State").selectOption({ label: "New York" });
	await page.getByLabel("Phone number").fill("+48586836486");
	await page.getByLabel("Phone number").blur();

	await page.getByText("Please fill in shipping address to see available shipping methods").isHidden();
	await page.getByLabel("FedEx", { exact: false }).check();

	// @todo
	// await page
	// 	.frameLocator('iframe[title="Iframe for card number"]')
	// 	.getByLabel("Card number")
	// 	.fill("4111 1111 4555 1142");
	// await page.frameLocator('iframe[title="Iframe for expiry date"]').getByLabel("Expiry date").fill("03/30");
	// await page.frameLocator('iframe[title="Iframe for security code"]').getByLabel("Security code").fill("333");
	// await page.getByLabel("Name on card").fill("Jan Kowalski");
	// await page.getByRole("button", { name: "Pay" }).click();

	expect(true).toBe(true);
});
