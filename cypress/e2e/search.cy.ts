import { NAVIGATION } from "../elements/navigation";
import { SEARCH_PAGE_SELECTORS } from "../elements/search-page";

describe("Search for products", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("should search for products SRS_0405", () => {
    const typedText = "polo";
    cy.get(NAVIGATION.searchIcon)
      .click()
      .get(SEARCH_PAGE_SELECTORS.searchInput)
      .type(typedText, { delay: 100 })
      .should("have.value", typedText)
      .url()
      .should("include", `/search?q=${typedText}`);
  });

  it("should see no errors on search page SRS_0404", () => {
    cy.get(NAVIGATION.searchIcon)
      .click()
      .url()
      .should("include", "/search")
      .get(SEARCH_PAGE_SELECTORS.productCollection)
      .should("be.visible");
  });

  it("should see no results message SRS_0405", () => {
    const typedText = "!@#$";
    cy.get(NAVIGATION.searchIcon)
      .click()
      .get(SEARCH_PAGE_SELECTORS.searchInput)
      .type(typedText, { delay: 100 })
      .should("have.value", typedText)
      .get(SEARCH_PAGE_SELECTORS.noResultsText)
      .should("contain", "Search query didn't return any viable results")
      .get(SEARCH_PAGE_SELECTORS.productCollection)
      .should("not.exist");
  });
});
