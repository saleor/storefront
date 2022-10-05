import { productsToSearch } from "../fixtures/search";
import { addItemToCart, openProductPage } from "../support/pages/product-page";

describe("Select variant and add to cart", () => {
  beforeEach(() => {
    cy.visit("/").clearLocalStorage();
  });

  it("should select a variant and add to the cart SRS_0202", () => {
    const product = productsToSearch.productWithVariants;

    openProductPage(product);
    addItemToCart();
  });

  it("should add product without variants to the cart SRS_0203", () => {
    const product = productsToSearch.productWithoutVariants;

    openProductPage(product);
    addItemToCart();
  });
});
