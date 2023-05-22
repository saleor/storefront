import { LOGIN } from "../../elements/login-page";
import { NAVIGATION } from "../../elements/navigation";
import { SHARED_ELEMENTS } from "../../elements/shared-elements";

describe("Demo page test", () => {
  it("should be able to navigate to storefront main demo page", () => {
    cy.addAliasToGraphRequest("ProductCollection");
    cy.visit("/")
      .wait("@ProductCollection")
      .then(() => {
        cy.checkNumberOfElements(SHARED_ELEMENTS.productsList, 3).each((row) => {
          cy.wrap(row).find("img").should("have.length", 8).should("be.visible");
        });
        cy.get(NAVIGATION.userIcon).should("be.visible");
        cy.get(SHARED_ELEMENTS.footer.externalLinks).should("be.visible");
      });
  });
  it("should be able to log in to demo profile", () => {
    cy.visit("/").get(NAVIGATION.userIcon).should("be.visible").click();
    cy.get(LOGIN.submitButton)
      .click()
      .then(() => {
        cy.checkNumberOfElements(SHARED_ELEMENTS.productsList, 3).each((row) => {
          cy.wrap(row).find("img").should("have.length", 8).should("be.visible");
        });
      });
  });
});
