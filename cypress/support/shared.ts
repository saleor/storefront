import { SHARED } from "cypress/elements/shared";

export function waitForProgressBarToNotBeVisible() {
  cy.get(SHARED.spinner).should("not.exist");
}

export function filterProducts(firstElement, secondElement) {
  cy.get(firstElement)
    .first()
    .invoke("text")
    .then((elementName) => {
      cy.get(firstElement).first().click().get(secondElement).should("contain.text", elementName);
    });
}
