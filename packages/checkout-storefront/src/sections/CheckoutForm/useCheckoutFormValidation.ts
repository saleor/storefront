import { CountryCode } from "@/checkout-storefront/graphql";
import {
  MessageKey,
  useAddressFormUtils,
  useAlerts,
  useCheckout,
  useFormattedMessages,
} from "@/checkout-storefront/hooks";
import { AddressField, ErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { CheckoutFormData } from "@/checkout-storefront/sections/CheckoutForm/types";
import { useAuthState } from "@saleor/sdk";
import { flushSync } from "react-dom";
import { UseFormReturn } from "react-hook-form";
import { ValidationError } from "yup";
import { isMatchingAddress } from "@/checkout-storefront/lib/utils";

interface UseCheckoutFormValidation extends UseFormReturn<CheckoutFormData> {
  schema: { validateSyncAt: (key: keyof CheckoutFormData, data: CheckoutFormData) => void };
}

export const useCheckoutFormValidation = ({
  setValue,
  getValues,
  schema,
}: UseCheckoutFormValidation) => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();
  const { shippingAddress, billingAddress } = checkout;
  const { showCustomErrors } = useAlerts("checkoutFinalize");
  const { authenticated } = useAuthState();

  const {
    hasAllRequiredFields: shippingHasAllRequiredFields,
    getMissingFieldsFromAddress: getMissingFieldsFromShipping,
  } = useAddressFormUtils(shippingAddress?.country?.code as CountryCode);

  const {
    hasAllRequiredFields: billingHasAllRequiredFields,
    getMissingFieldsFromAddress: getMissingFieldsFromBilling,
  } = useAddressFormUtils(billingAddress?.country?.code as CountryCode);

  const getShippingMissingFieldsErrorMessage = () =>
    getAddressMissingFieldsErrorMessage(
      "missingFieldsInShippingAddress",
      getMissingFieldsFromShipping(shippingAddress)
    );

  const getBillingMissingFieldsErrorMessage = () =>
    getAddressMissingFieldsErrorMessage(
      "missingFieldsInBillingAddress",
      getMissingFieldsFromBilling(billingAddress)
    );

  const getAddressMissingFieldsErrorMessage = (messageKey: MessageKey, fields: AddressField[]) =>
    `${formatMessage(messageKey)}: ${fields
      .map((field) => formatMessage(field as MessageKey))
      .join(", ")}`;

  const ensureValidCheckout = (): boolean => {
    let isValid = true;
    setValue("validating", true);
    const formData = getValues();
    const { createAccount } = formData;

    try {
      const isLoggedIn = authenticated && checkout?.email;

      if (!isLoggedIn) {
        schema.validateSyncAt("email", formData);
      }
    } catch (e) {
      const { path, type } = e as ValidationError;
      showCustomErrors([
        { field: path as string, code: type === "email" ? "invalid" : (type as ErrorCode) },
      ]);
      isValid = false;
    }

    if (createAccount) {
      try {
        schema.validateSyncAt("password", formData);
      } catch ({ path, type }) {
        showCustomErrors([{ field: path as string, code: type as ErrorCode }]);
        isValid = false;
      }
    }

    if (!checkout.shippingAddress) {
      showCustomErrors([{ field: "shippingAddress", code: "required" }]);
    }

    if (!shippingHasAllRequiredFields(checkout.shippingAddress)) {
      showCustomErrors([
        {
          message: getShippingMissingFieldsErrorMessage(),
          code: "invalid",
        },
      ]);
      isValid = false;
    }

    if (!checkout.billingAddress) {
      showCustomErrors([{ field: "billingAddress", code: "required" }]);
      isValid = false;
    }

    if (
      !isMatchingAddress(checkout.shippingAddress, checkout.billingAddress) &&
      !billingHasAllRequiredFields(checkout.billingAddress)
    ) {
      showCustomErrors([
        {
          message: getBillingMissingFieldsErrorMessage(),
          code: "invalid",
        },
      ]);
      isValid = false;
    }

    flushSync(() => {
      setValue("validating", false);
    });

    return isValid;
  };

  return ensureValidCheckout;
};
