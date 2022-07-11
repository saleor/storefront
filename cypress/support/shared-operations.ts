import { SHARED_ELEMENTS } from "../elements/shared-elements";

export function waitForProgressBarToNotBeVisible() {
  cy.get(SHARED_ELEMENTS.spinner).should("not.exist");
}
