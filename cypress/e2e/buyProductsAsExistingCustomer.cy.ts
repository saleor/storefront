import { CHECKOUT_ELEMENTS } from "../elements/checkout/checkout-page";
import { NAVIGATION } from "../elements/navigation";
import { SHARED_ELEMENTS } from "../elements/shared-elements";
import { productsToSearch } from "../fixtures/search";
import { addItemToCart, openProductPage } from "../support/pages/product-page";
import { waitForProgressBarToNotBeVisible } from "../support/shared-operations";
import { payByAdyenPayment } from "../support/pages/checkout-page";
import { checkIfOrderNumberAndPaymentStatusAreCorrect } from "../support/pages/order-confirmation-page";

describe("Buy product as existing user", () => {
  let paymentDetails;

  before(() => {
    cy.fixture("payment-details").then(({ adyenCard }) => {
      paymentDetails = adyenCard;
    });
  });

  beforeEach(() => {
    cy.clearLocalStorage().loginUserViaRequest().visit("/");
    waitForProgressBarToNotBeVisible();
  });

  it("should buy a product as logged in user SRS_1003", () => {
    cy.addAliasToGraphRequest("user")
      .addAliasToGraphRequest("checkoutShippingAddressUpdate")
      .addAliasToGraphRequest("checkoutBillingAddressUpdate")
      .addAliasToGraphRequest("checkoutDeliveryMethodUpdate");
    cy.get(SHARED_ELEMENTS.productsList).children().first().click();
    addItemToCart();
    cy.get(NAVIGATION.cartIcon)
      .click()
      .wait("@user")
      .its("response.body.data.user")
      .should("not.be.null");
    cy.wait("@checkoutShippingAddressUpdate")
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
    payByAdyenPayment(paymentDetails);
    checkIfOrderNumberAndPaymentStatusAreCorrect();
  });

  it("should buy a digital product as logged in user SRS_1004", () => {
    const product = productsToSearch.digitalProduct;

    cy.addAliasToGraphRequest("user")
      .addAliasToGraphRequest("checkoutEmailUpdate")
      .addAliasToGraphRequest("checkoutBillingAddressUpdate");
    openProductPage(product);
    addItemToCart();
    cy.get(NAVIGATION.cartIcon)
      .click()
      .wait("@user")
      .its("response.body.data.user")
      .should("not.be.null");
    cy.get(CHECKOUT_ELEMENTS.deliveryMethods)
      .should("not.exist")
      .wait("@checkoutBillingAddressUpdate")
      .its("response.body.data.checkoutBillingAddressUpdate.checkout.totalPrice.gross.amount")
      .then((totalPrice) => {
        cy.get(CHECKOUT_ELEMENTS.totalOrderPrice).should("contain", totalPrice);
      });
    payByAdyenPayment(paymentDetails);
    checkIfOrderNumberAndPaymentStatusAreCorrect();
  });
});
