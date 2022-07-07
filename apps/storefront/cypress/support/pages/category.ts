/* eslint-disable no-param-reassign */
import { CATEGORY } from "../../elements/category";
import { SHARED } from "../../elements/shared";

export function filterProducts(filterProductsBy, selectedFilter) {
  cy.addAliasToGraphRequest("ProductCollection");
  cy.get(filterProductsBy)
    .first()
    .invoke("text")
    .then((elementName) => {
      cy.get(filterProductsBy)
        .first()
        .click()
        .wait("@ProductCollection")
        .get(selectedFilter)
        .should("contain.text", elementName);
    });
}

export function getListOfProducts(productsArray) {
  cy.get(SHARED.productName).each(($listOfProducts) => {
    cy.wrap($listOfProducts)
      .invoke("text")
      .then((productsNames) => {
        productsArray = productsArray.concat([productsNames]);
      });
  });
}

export function sortingProductsByName(sortOrder: string) {
  const sortedListOfProducts: string[] = [];
  let listOfProductsNames: string[] = [];

  cy.addAliasToGraphRequest("ProductCollection");
  getListOfProducts(listOfProductsNames);
  cy.get(CATEGORY.sorting.sortByButton)
    .click()
    .get(CATEGORY.sorting.sortingOption)
    .contains(sortOrder)
    .click()
    .wait("@ProductCollection");
  getListOfProducts(sortedListOfProducts);
  cy.then(() => {
    listOfProductsNames = listOfProductsNames.sort();
    if (sortOrder === "Name descending") {
      listOfProductsNames = listOfProductsNames.sort().reverse();
    }
    expect(
      JSON.stringify(listOfProductsNames) === JSON.stringify(sortedListOfProducts)
    ).to.be.equal(true);
  });
}
