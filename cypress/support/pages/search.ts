import { NAVIGATION } from "../../elements/navigation";
import { SEARCH_PAGE_SELECTORS } from "../../elements/search-page";

export function navigateAndSearch(typedText) {
  cy.get(NAVIGATION.searchIcon)
    .click()
    .get(SEARCH_PAGE_SELECTORS.searchInput)
    .type(typedText, { delay: 500 })
    .should("have.value", typedText);
}
