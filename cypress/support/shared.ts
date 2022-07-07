import { SHARED } from "../elements/shared";

export function waitForProgressBarToNotBeVisible() {
  cy.get(SHARED.spinner).should("not.exist");
}
