/* eslint-disable no-loop-func */
import { SHARED_ELEMENTS } from "../elements/shared-elements";

export function waitForProgressBarToNotBeVisible() {
  cy.get(SHARED_ELEMENTS.spinner).should("not.exist");
}

export function clickOnTheFooterInternalLink(listOfInternalLinks) {
  let pageName;

  cy.get(listOfInternalLinks).each(($el) => {
    cy.wrap($el)
      .invoke("attr", "href")
      .then((newPageName) => {
        pageName = newPageName;

        cy.wrap($el).click().url().should("contain", pageName);
      });
  });
}

export function clickOnTheFooterExternalLink(listOfExternalLinks) {
  cy.get(listOfExternalLinks)
    .its("length")
    .then((length) => {
      for (let i = 0; i < length; i += 1) {
        cy.get(listOfExternalLinks)
          .eq(i)
          .then(($el) => {
            cy.wrap($el)
              .invoke("attr", "href")
              .then((pageName) => {
                cy.wrap($el)
                  .invoke("removeAttr", "target")
                  .click()
                  .url()
                  .should("contain", pageName)
                  .visit("/");
              });
          });
      }
    });
}
