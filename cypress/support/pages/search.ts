import { NAVIGATION } from "../../elements/navigation";
import { SEARCH } from "../../elements/search-page";

export function navigateAndSearch(typedText) {
  cy.get(NAVIGATION.searchIcon)
    .click()
    .get(SEARCH.searchInput)
    .type(typedText, { delay: 500 })
    .should("have.value", typedText);
}

export function waitForSearchedProducts(typedText) {
  cy.intercept("POST", Cypress.env("API_URI"), (req) => {
    if (
      req.body.operationName === "ProductCollection" &&
      req.body.variables.filter.search === typedText
    )
      req.alias = "SearchResult";
    req.continue();
  });
  cy.wait("@SearchResult");
}
