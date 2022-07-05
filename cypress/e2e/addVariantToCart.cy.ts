import { CART } from "cypress/elements/cart";
import { PRODUCT } from "cypress/elements/product";
import { SHARED } from "cypress/elements/shared";
import { productsToSearch } from "cypress/fixtures/search";
import { navigateAndSearch, waitForSearchedProducts } from "cypress/support/pages/search";
import { addItemToCart } from "cypress/support/shared";

describe("Select variant and add to cart", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  it("should select a variant and add to the cart SRS_0202", () => {
    const product = productsToSearch.productWithVariants;
    navigateAndSearch(product);
    waitForSearchedProducts(product);
    cy.get(SHARED.productCard)
      .first()
      .click()
      .get(PRODUCT.addToCartButton)
      .should("be.disabled")
      .get(PRODUCT.productName)
      .invoke("text")
      .then((selectedProductName) => {
        cy.get(PRODUCT.variant)
          .first()
          .invoke("text")
          .then((selectedVariantName) => {
            cy.get(PRODUCT.variant).first().click();
            addItemToCart(PRODUCT.variant, selectedVariantName);
          })
          .get(CART.cartProduct)
          .first()
          .should("contain.text", selectedProductName);
      });
  });

  it("should add product without variants to the cart SRS_0203", () => {
    const product = productsToSearch.productWithoutVariants;
    navigateAndSearch(product);
    waitForSearchedProducts(product);
    cy.get(SHARED.productCard)
      .first()
      .click()
      .get(PRODUCT.productName)
      .invoke("text")
      .then((selectedProductName) => {
        addItemToCart(PRODUCT.productName, selectedProductName);
      });
  });
});
