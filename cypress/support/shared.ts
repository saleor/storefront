import { SHARED } from "cypress/elements/shared";

export function waitForProgressBarToNotBeVisible() {
  cy.get(SHARED.spinner).should("not.exist");
}

export function filterProducts(filterProductsBy, selectedFilter) {
  cy.get(filterProductsBy)
    .first()
    .invoke("text")
    .then((elementName) => {
      cy.get(filterProductsBy)
        .first()
        .click()
        .get(selectedFilter)
        .should("contain.text", elementName);
    });
}
