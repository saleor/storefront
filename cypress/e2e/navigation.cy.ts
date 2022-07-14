/* eslint-disable no-loop-func */
import { SHARED_ELEMENTS } from "cypress/elements/shared-elements";

import { clickOnTheFooterInternalLink } from "../support/shared-operations";

describe("Navigation - checking links", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should open internal links SRS_0402", () => {
    clickOnTheFooterInternalLink(SHARED_ELEMENTS.footer.internalLinks);
  });

  it("should open external links SRS_0403", () => {
    cy.get(SHARED_ELEMENTS.footer.externalLinks)
      .its("length")
      .then((length) => {
        for (let i = 0; i < length; i += 1) {
          cy.get(SHARED_ELEMENTS.footer.externalLinks)
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
  });
});
