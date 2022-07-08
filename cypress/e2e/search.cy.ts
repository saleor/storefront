import { NAVIGATION } from "../elements/navigation";
import { SEARCH_PAGE_SELECTORS } from "../elements/search-page";
import { SHARED_ELEMENTS } from "../elements/shared-elements";
import { productsToSearch } from "../fixtures/search";
import { navigateAndSearch } from "../support/pages/search";

describe("Search for products", () => {
  let typedText;

  beforeEach(() => {
    cy.visit("/");
  });

  it("should search for products SRS_0405", () => {
    typedText = productsToSearch.polo;
    navigateAndSearch(typedText);
    cy.url().should("include", `/search?q=${typedText}`);
  });

  it("should see no errors on search page SRS_0404", () => {
    cy.get(NAVIGATION.searchIcon)
      .click()
      .url()
      .should("include", "/search")
      .get(SHARED_ELEMENTS.productsList)
      .should("be.visible");
  });

  it("should see no results message SRS_0405", () => {
    typedText = productsToSearch.nonExistingProduct;
    navigateAndSearch(typedText);
    cy.get(SEARCH_PAGE_SELECTORS.noResultsText)
      .should("contain", productsToSearch.noProductsInfo)
      .get(SHARED_ELEMENTS.productsList)
      .should("not.exist");
  });
});
