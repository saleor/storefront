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

export function addItemToCart() {
  cy.addAliasToGraphRequest("CreateCheckout");
  cy.get(PRODUCT_ELEMENTS.soldOut)
    .should("not.exist")
    .get(PRODUCT_ELEMENTS.addToCartButton)
    .then((addToCartButton) => {
      if (addToCartButton.is(":disabled")) {
        cy.get(PRODUCT_ELEMENTS.variant)
          .first()
          .click()
          .get(PRODUCT_ELEMENTS.addToCartButton)
          .click();
      } else {
        cy.get(PRODUCT_ELEMENTS.addToCartButton).click();
      }
      cy.wait("@CreateCheckout").its("response.body.data.checkoutCreate.errors").should("be.empty");
    });
}
