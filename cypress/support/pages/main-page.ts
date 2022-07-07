import { CATEGORY } from "../../elements/category";
import { MAIN_PAGE } from "../../elements/main-page";
import { NAVIGATION } from "../../elements/navigation";
import { SHARED } from "../../elements/shared";

export function selectNotEmptyCategory() {
  cy.get(MAIN_PAGE.categorySection)
    .find(SHARED.productsList)
    .first()
    .parents(MAIN_PAGE.categorySection)
    .children(MAIN_PAGE.categoryName)
    .invoke("text")
    .then((categoryTitle) => {
      cy.get(NAVIGATION.categoriesListButtons)
        .contains(categoryTitle)
        .click()
        .get(CATEGORY.categoryTitle)
        .should("contain.text", categoryTitle);
    });
}
