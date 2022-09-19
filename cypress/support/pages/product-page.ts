import { CART } from "../../elements/cart";
import { PRODUCT_ELEMENTS } from "../../elements/product-page";
import { SHARED_ELEMENTS } from "../../elements/shared-elements";
import { navigateAndSearch } from "./search";

export function openProductPage(product) {
  navigateAndSearch(product);
  cy.get(SHARED_ELEMENTS.productName)
    .first()
    .click()
    .get(PRODUCT_ELEMENTS.addToCartButton)
    .should("be.visible");
}

export function addItemToCart(selectedItem) {
  cy.get(PRODUCT_ELEMENTS.addToCartButton).then((addToCartButton) => {
    if (addToCartButton.is(":disabled")) {
      cy.get(PRODUCT_ELEMENTS.soldOut)
        .should("not.exist")
        .get(selectedItem)
        .invoke("text")
        .then((selectedProductName) => {
          cy.get(PRODUCT_ELEMENTS.variant)
            .first()
            .invoke("text")
            .then((selectedVariantName) => {
              cy.get(PRODUCT_ELEMENTS.variant)
                .first()
                .click()
                .get(PRODUCT_ELEMENTS.addToCartButton)
                .click()
                .url()
                .should("include", "/cart")
                .get(CART.cartVariant)
                .first()
                .should("contain.text", selectedVariantName);
            })
            .get(CART.cartProduct)
            .first()
            .should("contain.text", selectedProductName);
        });
    } else {
      cy.get(PRODUCT_ELEMENTS.soldOut)
        .should("not.exist")
        .get(selectedItem)
        .invoke("text")
        .then((selectedProductName) => {
          cy.get(PRODUCT_ELEMENTS.addToCartButton)
            .click()
            .url()
            .should("include", "/cart")
            .get(CART.cartProduct)
            .first()
            .should("contain.text", selectedProductName);
        });
    }
  });
}
