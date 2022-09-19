import { CATEGORY } from "../../elements/category";
import { MAIN_PAGE } from "../../elements/main-page";
import { NAVIGATION } from "../../elements/navigation";
import { SHARED_ELEMENTS } from "../../elements/shared-elements";

export function selectNotEmptyCategory() {
  cy.get(MAIN_PAGE.categorySection)
    .find(SHARED_ELEMENTS.productsList)
    .first()
    .parents(MAIN_PAGE.categorySection)
    .children(MAIN_PAGE.categoryName)
    .invoke("text")
    .then((categoryTitle) => {
      cy.get(NAVIGATION.categoriesListButtons).contains(categoryTitle).click();
    });
}
