import { expect, test } from "@playwright/test";
import {
	addCurrentProductToCart,
	clickOnNthProductElement,
	openCart,
	selectRandomAvailableVariant,
} from "./utils";

test("STF_05: Checkout as a unlogged user", async ({ page }) => {
	await page.goto("/");

	const product = await clickOnNthProductElement({ page, nth: 0 });
	await selectRandomAvailableVariant({ page });
	await addCurrentProductToCart({ page });
	await openCart({ page });

	await page.getByTestId("CheckoutLink").click();
	await page.getByTestId("shippingAddressSection").waitFor();

	await page.getByLabel("Email").pressSequentially("example@saleor.io", { delay: 50 });
	await page.getByLabel("Country").selectOption("Poland");

	await page.getByTestId("shippingAddressSection").waitFor();
	await page.getByLabel("First name").pressSequentially("Jan", { delay: 50 });
	await page.getByLabel("Last name").pressSequentially("Kowalski", { delay: 50 });
	await page.getByLabel("Street address").first().pressSequentially("Ojcowska 23", { delay: 50 });
	await page.getByRole("textbox", { name: "City" }).pressSequentially("Gdańsk", { delay: 50 });
	await page.getByLabel("Postal code").pressSequentially("80-146", { delay: 50 });
	await page.getByLabel("Postal code").blur();

	await page.getByTestId("deliveryMethods").waitFor();
	await page.getByLabel("DHL").click();
	await page.getByLabel("DHL").blur();

	await page.getByTestId("paymentMethods").waitFor();
	// The test assumes dummy payment gateway usage
	await page.getByRole("button", { name: "Make payment and create order" }).click();

	await page.getByText("Thank you for placing your order.", { exact: false }).waitFor();

	const summaryProductList = page.getByTestId("SummaryProductList");
	await expect(summaryProductList.getByTestId("SummaryItem")).toHaveCount(1);
	await expect(summaryProductList).toContainText(product.name);
});
