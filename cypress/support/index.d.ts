/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  interface Chainable<Subject> {
    addAliasToGraphRequest(alias: string): Chainable<any>;
    addAliasForSearchQuery(alias: string, searchQuery: string): Chainable<any>;
    fillUpBasicAddress(address: {}): Chainable<any>;
    loginUserViaRequest(authorization?: string, user?: {}): Chainable<any>;
    sendRequestWithQuery(query: string): Chainable<any>;
    checkNumberOfElements(selector: string, numberOfElements: number): Chainable<any>;
  }
}
