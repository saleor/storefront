import { CART } from "cypress/elements/cart";

import { PRODUCT } from "../elements/product";
import { SHARED } from "../elements/shared";
import { productsToSearch } from "../fixtures/search";
import { navigateAndSearch, waitForSearchedProducts } from "../support/pages/search";

describe("Select variant and add to cart", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should select a variant and add to the cart SRS_0202", () => {
    cy.clearLocalStorage();
    const product = productsToSearch.productWithVariants;
    navigateAndSearch(product);
    cy.url().should("include", `/search?q=${product}`);
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
            cy.get(PRODUCT.variant)
              .first()
              .click()
              .get(PRODUCT.addToCartButton)
              .should("be.enabled")
              .click()
              .url()
              .should("include", "/cart")
              .get(CART.cartVariant)
              .first()
              .should("contain", selectedVariantName);
          })
          .get(CART.cartProduct)
          .first()
          .should("contain.text", selectedProductName);
      });
  });
});
