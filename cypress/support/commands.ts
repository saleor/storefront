/// <reference types="cypress" />

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
