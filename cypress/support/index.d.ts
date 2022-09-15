/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  interface Chainable<Subject> {
    addAliasToGraphRequest(alias: string): Chainable<any>;
    addAliasForSearchQuery(alias: string, searchQuery: string): Chainable<any>;
  }
}
