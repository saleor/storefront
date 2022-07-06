import { CATEGORY } from "cypress/elements/category";
import { MAIN_PAGE } from "cypress/elements/main-page";
import { NAVIGATION } from "cypress/elements/navigation";
import { SHARED } from "cypress/elements/shared";
import { filterProducts, sortingProductsByName } from "cypress/support/pages/category";
import { waitForProgressBarToNotBeVisible } from "cypress/support/shared";

describe("Using filters and sorting on products list", () => {
  const sortByList = ["Name descending", "Name ascending"];

  beforeEach(() => {
    cy.visit("/");
  });

  sortByList.forEach((sortBy) => {
    it(`Should be able to sort products by ${sortBy} SRS_0303`, () => {
      waitForProgressBarToNotBeVisible();
      cy.get(MAIN_PAGE.categorySection)
        .find(SHARED.collection)
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
      sortingProductsByName(`${sortBy}`);
    });
  });

  it("should filter products by variant attribute SRS_0306", () => {
    waitForProgressBarToNotBeVisible();
    filterProducts(NAVIGATION.categoriesListButtons, CATEGORY.categoryTitle);
    cy.get(CATEGORY.filters.filtersMenuButtons).first().click();
    filterProducts(CATEGORY.filters.filterList, CATEGORY.filters.filterPill);
  });

  it("should clear selected filters SRS_0308", () => {
    waitForProgressBarToNotBeVisible();
    filterProducts(NAVIGATION.categoriesListButtons, CATEGORY.categoryTitle);
    cy.get(CATEGORY.filters.filtersMenuButtons).first().click();
    filterProducts(CATEGORY.filters.filterList, CATEGORY.filters.filterPill);
    cy.get(CATEGORY.filters.clearAllFiltersButton)
      .click()
      .get(CATEGORY.filters.filterPill)
      .should("not.exist")
      .get(CATEGORY.filters.clearAllFiltersButton)
      .should("not.exist");
  });
});
