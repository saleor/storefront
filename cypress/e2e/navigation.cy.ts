import { SHARED_ELEMENTS } from "../elements/shared-elements";

import {
  clickOnTheFooterExternalLink,
  clickOnTheFooterInternalLink,
} from "../support/shared-operations";

describe("Navigation - checking links", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should open internal links SRS_0402", () => {
    clickOnTheFooterInternalLink(SHARED_ELEMENTS.footer.internalLinks);
  });

  it("should open external links SRS_0403", () => {
    clickOnTheFooterExternalLink(SHARED_ELEMENTS.footer.externalLinks);
  });
});
