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
