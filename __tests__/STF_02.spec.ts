import { expect, test } from "@playwright/test";
import {
	addCurrentProductToCart,
	clickOnRandomProductElement,
	openCart,
	selectRandomAvailableVariant,
} from "./utils";

test("STF_02: Remove items from the basket", async ({ page }) => {
	await page.goto("/");

	const product = await clickOnRandomProductElement({ page });
	await selectRandomAvailableVariant({ page });

	await expect(page.getByTestId("CartNavItem")).toContainText("0 items");
	await addCurrentProductToCart({ page });
	await expect(page.getByTestId("CartNavItem")).toContainText("1 item");

	await openCart({ page });

	const productInCart = page.getByTestId("CartProductList").getByRole("listitem");
	await expect(productInCart).toHaveCount(1);
	await expect(productInCart).toContainText(product.name);

	await productInCart.getByRole("button", { name: "Remove" }).click();
	await expect(page.getByTestId("CartNavItem")).toContainText("0 items");
	await expect(productInCart).toHaveCount(0);
});
