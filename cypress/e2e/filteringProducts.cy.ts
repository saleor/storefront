import { CATEGORY } from "../elements/category";
import { NAVIGATION } from "../elements/navigation";
import { filterProducts, sortingProductsByName } from "../support/pages/category";
import { selectNotEmptyCategory } from "../support/pages/main-page";
import { waitForProgressBarToNotBeVisible } from "../support/shared-operations";

describe("Using filters and sorting on products list", () => {
  const sortByList = ["Name descending", "Name ascending"];

  beforeEach(() => {
    cy.visit("/");
  });

  sortByList.forEach((sortBy) => {
    it(`should be able to sort products by ${sortBy} SRS_0303`, () => {
      waitForProgressBarToNotBeVisible();
      selectNotEmptyCategory();
      sortingProductsByName(`${sortBy}`);
    });
  });

  it("should be able to sort products by in stock SRS_0305", () => {
    waitForProgressBarToNotBeVisible();
    selectNotEmptyCategory();
    cy.get(CATEGORY.sorting.sortByInStock).click().url().should("contain", "?inStock=true");
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
