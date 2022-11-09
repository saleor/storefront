import { NAVIGATION } from "../../elements/navigation";
import { SEARCH_PAGE_SELECTORS } from "../../elements/search-page";
import { waitForProgressBarToNotBeVisible } from "../shared-operations";

export function navigateAndSearch(typedText) {
  cy.addAliasForSearchQuery("ProductCollection", typedText)
    .get(NAVIGATION.searchIcon)
    .invoke("attr", "href")
    .then((href) => {
      cy.visit(href);
    });
  waitForProgressBarToNotBeVisible();
  cy.get(SEARCH_PAGE_SELECTORS.searchInput)
    .type(typedText, { delay: 500 })
    .should("have.value", typedText)
    .wait("@ProductCollection");
}
