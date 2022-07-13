import { SHARED_ELEMENTS } from "cypress/elements/shared-elements";

import { clickOnTheFooterInternalLink } from "../support/shared-operations";

describe("Navigation - checking links", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should open internal links SRS_0402", () => {
    clickOnTheFooterInternalLink(SHARED_ELEMENTS.footer.internalLinks);
  });

  it("should open external link SRS_0403", () => {
    let pageName;

    cy.get(SHARED_ELEMENTS.footer.externalLinks)
      .first()
      .invoke("attr", "href")
      .then((newPageName) => {
        pageName = newPageName;

        cy.get(SHARED_ELEMENTS.footer.externalLinks)
          .first()
          .invoke("removeAttr", "target")
          .click()
          .url()
          .should("contain", pageName);
      });
  });
});
