import { CHECKOUT_ELEMENTS } from "../elements/checkout/checkout-page";
import { NAVIGATION } from "../elements/navigation";
import { SHARED_ELEMENTS } from "../elements/shared-elements";
import { productsToSearch } from "../fixtures/search";
import { addItemToCart, openProductPage } from "../support/pages/product-page";
import { waitForProgressBarToNotBeVisible } from "../support/shared-operations";
import { payByDummyPayment } from "../support/pages/checkout-page";
import { checkIfOrderNumberAndPaymentStatusAreCorrect } from "../support/pages/order-confirmation-page";

describe("Buy product as existing user", () => {
  beforeEach(() => {
    cy.clearLocalStorage().loginUserViaRequest().visit("/");
    waitForProgressBarToNotBeVisible();
  });

  it("should buy a product as logged in user SRS_1003", () => {
    cy.addAliasToGraphRequest("user")
      .addAliasToGraphRequest("checkoutShippingAddressUpdate")
      .addAliasToGraphRequest("checkoutBillingAddressUpdate")
      .addAliasToGraphRequest("checkoutDeliveryMethodUpdate")
      .get(SHARED_ELEMENTS.productsList)
      .children()
      .first()
      .click();
    addItemToCart();
    cy.get(NAVIGATION.cartIcon)
      .click()
      .wait("@user")
      .wait("@checkoutShippingAddressUpdate")
      .wait("@checkoutBillingAddressUpdate")
      .its("response.body.data.checkoutBillingAddressUpdate.checkout.billingAddress")
      .should("not.be.null")
      .get(CHECKOUT_ELEMENTS.deliveryMethods)
      .children()
      .should("be.visible")
      .first()
      .click()
      .wait("@checkoutDeliveryMethodUpdate")
      .its("response.body.data.checkoutDeliveryMethodUpdate.checkout.totalPrice.gross.amount")
      .then((totalPrice) => {
        cy.get(CHECKOUT_ELEMENTS.totalOrderPrice).should("contain", totalPrice);
      });
    payByDummyPayment();
    checkIfOrderNumberAndPaymentStatusAreCorrect();
  });

  it("should buy a digital product as logged in user SRS_1004", () => {
    const product = productsToSearch.digitalProduct;

    cy.addAliasToGraphRequest("user")
      .addAliasToGraphRequest("checkoutEmailUpdate")
      .addAliasToGraphRequest("checkoutBillingAddressUpdate");
    openProductPage(product);
    addItemToCart();
    cy.get(NAVIGATION.cartIcon).click().wait("@user");
    cy.get(CHECKOUT_ELEMENTS.deliveryMethods)
      .should("not.exist")
      .wait("@checkoutBillingAddressUpdate")
      .its("response.body.data.checkoutBillingAddressUpdate.checkout.totalPrice.gross.amount")
      .then((totalPrice) => {
        cy.get(CHECKOUT_ELEMENTS.totalOrderPrice).should("contain", totalPrice);
      });
    payByDummyPayment();
    checkIfOrderNumberAndPaymentStatusAreCorrect();
  });
});
