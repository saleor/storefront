/// <reference types="cypress" />
import { CHECKOUT_ELEMENTS } from "../elements/checkout/checkout-page";
import { TEST_USER } from "../fixtures/users";

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

Cypress.Commands.add("sendRequestWithQuery", (query, authorization = "auth", variables = "") => {
  cy.request({
    body: {
      variables,
      query,
    },
    headers: {
      Authorization: `Bearer ${authorization}`,
    },
    method: "POST",
    url: Cypress.env("API_URL"),
    log: true,
  }).then((response) => {
    const respInSting = JSON.stringify(response.body);
    if (respInSting.includes(`"errors":[{`)) {
      cy.log(query).log(JSON.stringify(response.body));
    }
  });
});

Cypress.Commands.add("loginUserViaRequest", (authorization = "auth", user = TEST_USER) => {
  const mutation = `mutation TokenAuth{
    tokenCreate(email: "${user.email}", password: "${user.password}") {
      token
      csrfToken
      refreshToken
      errors: errors {
        code
        field
        message
      }
      user {
        id
        email
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).then((resp) => {
    window.localStorage.setItem("_saleorCSRFToken", resp.body.data.tokenCreate.csrfToken);
    window.sessionStorage.setItem(authorization, resp.body.data.tokenCreate.token);
  });
});
