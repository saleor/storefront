/// <reference types="cypress" />
import { CHECKOUT_ELEMENTS } from "../elements/checkout/checkout-page";

Cypress.Commands.add("addAliasToGraphRequest", (operationName) => {
  cy.intercept("POST", Cypress.env("API_URL"), (req) => {
    const requestBody = req.body;

    if (Array.isArray(requestBody)) {
      requestBody.forEach((element) => {
        if (element.operationName === operationName) {
          req.alias = operationName;
        }
      });
    } else if (requestBody.operationName === operationName) {
      req.alias = operationName;
    }
  });
});

Cypress.Commands.add("addAliasForSearchQuery", (operationName, searchQuery) => {
  cy.intercept("POST", Cypress.env("API_URL"), (req) => {
    const requestBody = req.body;

    if (Array.isArray(requestBody)) {
      requestBody.forEach((element) => {
        if (
          element.operationName === operationName &&
          req.body.variables.filter.search === searchQuery
        ) {
          req.alias = operationName;
          req.continue();
        }
      });
    } else if (
      requestBody.operationName === operationName &&
      req.body.variables.filter.search === searchQuery
    ) {
      req.alias = operationName;
      req.continue();
    }
  });
});

Cypress.Commands.add("fillUpBasicAddress", (address) => {
  return cy
    .get(CHECKOUT_ELEMENTS.countrySelect)
    .select(address.countryFullName)
    .get(CHECKOUT_ELEMENTS.firstNameInput)
    .type(address.firstName)
    .get(CHECKOUT_ELEMENTS.lastNameInput)
    .type(address.lastName)
    .get(CHECKOUT_ELEMENTS.companyNameInput)
    .type(address.companyName)
    .get(CHECKOUT_ELEMENTS.streetAddress1Input)
    .type(address.streetAddress1)
    .get(CHECKOUT_ELEMENTS.streetAddress2Input)
    .type(address.streetAddress2)
    .get(CHECKOUT_ELEMENTS.cityInput)
    .type(address.city)
    .get(CHECKOUT_ELEMENTS.postalCodeInput)
    .type(address.postalCode)
    .get(CHECKOUT_ELEMENTS.areaSelect)
    .select(address.countryArea);
});
