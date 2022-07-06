/* eslint-disable no-param-reassign */
import { CATEGORY } from "cypress/elements/category";
import { SHARED } from "cypress/elements/shared";

export function filterProducts(filterProductsBy, selectedFilter) {
  cy.get(filterProductsBy)
    .first()
    .invoke("text")
    .then((elementName) => {
      cy.get(filterProductsBy)
        .first()
        .click()
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

  getListOfProducts(listOfProductsNames);
  cy.get(CATEGORY.sorting.sortByButton)
    .click()
    .get(CATEGORY.sorting.sortingOption)
    .contains(sortOrder)
    .click()
    .wait(1000); // it will be changed when we will add function for waiting for request
  getListOfProducts(sortedListOfProducts);
  cy.then(() => {
    if (sortOrder === "Name descending") {
      listOfProductsNames = listOfProductsNames.sort().reverse();
    }
    if (sortOrder === "Name ascending") {
      listOfProductsNames = listOfProductsNames.sort();
    }
    expect(
      JSON.stringify(listOfProductsNames) === JSON.stringify(sortedListOfProducts)
    ).to.be.equal(true);
  });
}
