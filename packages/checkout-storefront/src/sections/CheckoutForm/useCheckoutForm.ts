<<<<<<< HEAD
import { Errors, useCheckout, useErrorMessages } from "@/checkout-storefront/hooks";
=======
import { AddressFragment, AddressTypeEnum, CountryCode } from "@/checkout-storefront/graphql";
import {
  CheckoutScope,
  Errors,
  MessageKey,
  useAlerts,
  useCheckout,
  useErrorMessages,
  useFormattedMessages,
} from "@/checkout-storefront/hooks";
>>>>>>> wip
import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { usePaymentMethods } from "@/checkout-storefront/sections/PaymentSection";
import { PaymentMethodID, PaymentProviderID } from "checkout-common";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useCheckoutFormValidation } from "@/checkout-storefront/sections/CheckoutForm/useCheckoutFormValidation";
import { CheckoutFormData } from "@/checkout-storefront/sections/CheckoutForm/types";

const defaultUpdateState = {
  checkoutShippingUpdate: false,
  checkoutCustomerAttach: false,
  checkoutBillingUpdate: false,
  checkoutAddPromoCode: false,
  checkoutDeliveryMethodUpdate: false,
  checkoutLinesUpdate: false,
  checkoutEmailUpdate: false,
};

export type UseCheckoutFormProps = {
  userRegisterErrors: Errors<CheckoutFormData>;
  checkoutFinalize: (formData: CheckoutFormData) => void;
};

export const useCheckoutForm = ({ userRegisterErrors, checkoutFinalize }: UseCheckoutFormProps) => {
=======
import { defaultCountry } from "@/checkout-storefront/sections/Addresses/countries";
import { useEffect } from "react";
import { useAuthState } from "@saleor/sdk";
import { isMatchingAddress } from "@/checkout-storefront/sections/Addresses/utils";

type UpdateState = Record<CheckoutScope, boolean>;

const defaultUpdateState: UpdateState = [
  "checkoutShippingUpdate",
  "checkoutCustomerAttach",
  "checkoutBillingUpdate",
  "checkoutAddPromoCode",
  "checkoutDeliveryMethodUpdate",
  "userAddressCreate",
  "userAddressUpdate",
  "userAddressDelete",
  "checkoutPay",
  "userRegister",
  "requestPasswordReset",
  "checkoutLinesUpdate",
  "checkoutEmailUpdate",
  "resetPassword",
  "login",
].reduce((result, checkoutScope) => ({ ...result, [checkoutScope]: false }), {} as UpdateState);

export interface CheckoutFormData {
  email: string;
  password: string;
  createAccount: boolean;
  paymentProviderId: PaymentProviderID;
  paymentMethodId: PaymentMethodID;
  validating: boolean;
  updateState: UpdateState;
}

export type UseCheckoutFormProps = { userRegisterErrors: Errors<CheckoutFormData> };

export const useCheckoutForm = ({ userRegisterErrors }: UseCheckoutFormProps) => {
  const formatMessage = useFormattedMessages();
  const { showCustomErrors } = useAlerts("checkoutFinalize");
>>>>>>> wip
  const { errorMessages } = useErrorMessages();
  const { checkout, loading: loadingCheckout } = useCheckout();
  const usePaymentProvidersProps = usePaymentMethods(checkout?.channel?.id);
  const { isValidProviderSelected, selectedPaymentProvider, selectedPaymentMethod } =
    usePaymentProvidersProps;

  const [isProcessingApiChanges, setIsProcessingApiChanges] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const schema = object({
    password: string().required(errorMessages.required),
    email: string().email(errorMessages.invalid).required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);
  // will be used for e.g. account creation at checkout finalization
  const methods = useForm<CheckoutFormData>({
    resolver,
    mode: "onBlur",
    defaultValues: {
      createAccount: false,
      email: checkout?.email || "",
      password: "",
      validating: false,
      updateState: defaultUpdateState,
    },
  });

  useSetFormErrors<CheckoutFormData>({
    setError: methods.setError,
    errors: userRegisterErrors,
  });

  const { getValues } = methods;

  const ensureValidCheckout = useCheckoutFormValidation({
    isValidProviderSelected,
    ...methods,
    schema,
  });

  const getFormData = (): CheckoutFormData => ({
    ...getValues(),
    paymentProviderId: selectedPaymentProvider as PaymentProviderID,
    paymentMethodId: selectedPaymentMethod as PaymentMethodID,
  });

<<<<<<< HEAD
  console.log({ loadingCheckout });
  const hasFinishedApiChanges =
    !Object.values(methods.watch("updateState")).some((value) => value) && !loadingCheckout;
=======
  const getAddressMissingFieldsErrorMessage = (address: AddressFragment, type: AddressTypeEnum) => {
    const messageKey =
      type === "SHIPPING" ? "missingFieldsInShippingAddress" : "missingFieldsInBillingAddress";

    return `${formatMessage(messageKey)}: ${getMissingFieldsFromAddress(address)
      .map((field) => formatMessage(field as MessageKey))
      .join(", ")}`;
  };

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
>>>>>>> wip

  // not using form handleSubmit because it wouldn't allow us to have
  // a flow with steps and errors in between
  const handleSubmit = () => {
    if (!hasFinishedApiChanges) {
      setIsProcessingApiChanges(true);
      setSubmitInProgress(true);
      return;
    }

    setSubmitInProgress(false);
    if (!ensureValidCheckout()) {
      return;
    }

<<<<<<< HEAD
    checkoutFinalize(getFormData());
  };
=======
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
          message: getAddressMissingFieldsErrorMessage(
            checkout.billingAddress as AddressFragment,
            "BILLING"
          ),
          code: "invalid",
        },
      ]);
      isValid = false;
    }
>>>>>>> wip

  useEffect(() => {
    if (!hasFinishedApiChanges) {
      return;
    }

    setIsProcessingApiChanges(false);

    if (submitInProgress) {
      handleSubmit();
    }
  }, [hasFinishedApiChanges]);

  return { methods, usePaymentProvidersProps, handleSubmit, isProcessingApiChanges };
};
