import { CHECKOUT_ELEMENTS } from "../elements/checkout/checkout-page";
import { NAVIGATION } from "../elements/navigation";
import { SHARED_ELEMENTS } from "../elements/shared-elements";
import { productsToSearch } from "../fixtures/search";
import { addItemToCart, openProductPage } from "../support/pages/product-page";
import { waitForProgressBarToNotBeVisible } from "../support/shared-operations";
import { payByAdyenPayment } from "../support/pages/checkout-page";
import { checkIfOrderNumberAndPaymentStatusAreCorrect } from "../support/pages/order-confirmation-page";

describe("Buy product as anonymous user", () => {
  let address;
  let paymentDetails;

  before(() => {
    cy.fixture("addresses").then(({ usAddress }) => {
      address = usAddress;
    });
    cy.fixture("payment-details").then(({ adyenCard }) => {
      paymentDetails = adyenCard;
    });
  });

  beforeEach(() => {
    cy.visit("/").clearLocalStorage();
    waitForProgressBarToNotBeVisible();
  });

  it("should buy a product as anonymous SRS_1001", () => {
    cy.addAliasToGraphRequest("checkoutEmailUpdate")
      .addAliasToGraphRequest("checkoutShippingAddressUpdate")
      .addAliasToGraphRequest("checkoutBillingAddressUpdate")
      .addAliasToGraphRequest("checkoutDeliveryMethodUpdate")
      .addAliasToGraphRequest("order")
      .get(SHARED_ELEMENTS.productsList)
      .children()
      .first()
      .click();
    addItemToCart();
    cy.get(NAVIGATION.cartIcon)
      .click()
      .get(CHECKOUT_ELEMENTS.emailInput)
      .type("user@examle.com")
      .wait("@checkoutEmailUpdate")
      .fillUpBasicAddress(address)
      .clickOutside()
      .wait("@checkoutShippingAddressUpdate")
      .wait("@checkoutBillingAddressUpdate")
      .its("response.body.data.checkoutBillingAddressUpdate.checkout.billingAddress")
      .should("not.be.null")
      .get(CHECKOUT_ELEMENTS.deliveryMethods)
      .children()
      .should("be.visible")
      .first()
      .click()
      .clickOutside()
      .wait("@checkoutDeliveryMethodUpdate")
      .its("response.body.data.checkoutDeliveryMethodUpdate.checkout.totalPrice.gross.amount")
      .then((totalPrice) => {
        cy.get(CHECKOUT_ELEMENTS.totalOrderPrice).should("contain", totalPrice);
      });
    payByAdyenPayment(paymentDetails);
    checkIfOrderNumberAndPaymentStatusAreCorrect();
  });

  it("should buy a digital product as anonymous SRS_1002", () => {
    const product = productsToSearch.digitalProduct;

    cy.addAliasToGraphRequest("checkoutEmailUpdate").addAliasToGraphRequest(
      "checkoutBillingAddressUpdate"
    );
    openProductPage(product);
    addItemToCart();
    cy.get(NAVIGATION.cartIcon).click();
    cy.get(CHECKOUT_ELEMENTS.deliveryMethods)
      .should("not.exist")
      .get(CHECKOUT_ELEMENTS.emailInput)
      .type("user@examle.com")
      .wait("@checkoutEmailUpdate")
      .fillUpBasicAddress(address)
      .clickOutside()
      .wait("@checkoutBillingAddressUpdate")
      .its("response.body.data.checkoutBillingAddressUpdate.checkout.totalPrice.gross.amount")
      .then((totalPrice) => {
        cy.get(CHECKOUT_ELEMENTS.totalOrderPrice).should("contain", totalPrice);
      });
    payByAdyenPayment(paymentDetails);
    checkIfOrderNumberAndPaymentStatusAreCorrect();
  });
});
