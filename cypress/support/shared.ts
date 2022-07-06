import { SHARED } from "cypress/elements/shared";

export function waitForProgressBarToNotBeVisible() {
  cy.get(SHARED.spinner).should("not.exist");
}
