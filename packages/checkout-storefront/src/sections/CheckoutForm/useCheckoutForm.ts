import { AddressFragment, AddressTypeEnum, CountryCode } from "@/checkout-storefront/graphql";
import {
  Errors,
  MessageKey,
  useAlerts,
  useCheckout,
  useErrorMessages,
  useFormattedMessages,
} from "@/checkout-storefront/hooks";
import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { useAddressFormUtils } from "@/checkout-storefront/sections/Addresses/useAddressFormUtils";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { usePaymentMethods } from "@/checkout-storefront/sections/PaymentSection";
import { ErrorCode } from "@/checkout-storefront/lib/globalTypes";
import { PaymentMethodID, PaymentProviderID } from "checkout-common";
import { defaultCountry } from "@/checkout-storefront/sections/Addresses/countries";
import { useEffect } from "react";
import { useAuthState } from "@saleor/sdk";

export interface FormData {
  email: string;
  password: string;
  createAccount: boolean;
  paymentProviderId: PaymentProviderID;
  paymentMethodId: PaymentMethodID;
  validating: boolean;
}

export type UseCheckoutFormProps = { userRegisterErrors: Errors<FormData> };

export const useCheckoutForm = ({ userRegisterErrors }: UseCheckoutFormProps) => {
  const formatMessage = useFormattedMessages();
  const { showCustomErrors } = useAlerts("checkoutFinalize");
  const { errorMessages } = useErrorMessages();
  const { checkout } = useCheckout();
  const { billingAddress, shippingAddress } = checkout;
  const usePaymentProvidersProps = usePaymentMethods(checkout?.channel?.id);
  const { isValidProviderSelected, selectedPaymentProvider } = usePaymentProvidersProps;
  const { authenticated } = useAuthState();

  const { hasAllRequiredFields: shippingHasAllRequiredFields, getMissingFieldsFromAddress } =
    useAddressFormUtils((shippingAddress?.country?.code as CountryCode) || defaultCountry.code);
  const { hasAllRequiredFields: billingHasAllRequiredFields } = useAddressFormUtils(
    (billingAddress?.country?.code as CountryCode) || defaultCountry.code
  );

  const schema = object({
    password: string().required(errorMessages.required),
    email: string().email(errorMessages.invalid).required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);
  // will be used for e.g. account creation at checkout finalization
  const methods = useForm<FormData>({
    resolver,
    mode: "onBlur",
    defaultValues: {
      createAccount: false,
      email: checkout?.email || "",
      password: "",
      validating: false,
    },
  });

  useSetFormErrors<FormData>({
    setError: methods.setError,
    errors: userRegisterErrors,
  });

  const { getValues, setValue, watch } = methods;

  const getFormData = () => ({
    ...getValues(),
    paymentProviderId: selectedPaymentProvider as PaymentProviderID,
  });

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
    const { email, password, createAccount } = getValues();

    try {
      // console.log("EMAIL", { email });
      const isLoggedIn = authenticated && checkout?.email;

      if (!isLoggedIn) {
        schema.validateSyncAt("email", email);
      }
    } catch (e) {
      console.log({ ...e });
      const { path, type } = e;
      // console.log({ email, path, type });
      showCustomErrors([{ field: path as string, code: type as ErrorCode }]);
      isValid = false;
    }

    if (createAccount) {
      try {
        schema.validateSyncAt("password", password);
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
        { message: getAddressMissingFieldsErrorMessage(checkout.shippingAddress, "SHIPPING") },
      ]);
      isValid = false;
    }

    if (!checkout.billingAddress) {
      showCustomErrors([{ field: "billingAddress", code: "required" }]);
      isValid = false;
    }

    if (!billingHasAllRequiredFields(checkout.billingAddress)) {
      showCustomErrors([
        { message: getAddressMissingFieldsErrorMessage(checkout.billingAddress, "BILLING") },
      ]);
      isValid = false;
    }

    if (!isValidProviderSelected) {
      showCustomErrors([{ field: "paymentProvider", code: "required" }]);
      isValid = false;
    }

    console.log({ checkout });
    return isValid;
  };

  const validating = watch("validating");

  // needs to be a hook so react doesn't batch this
  useEffect(() => {
    if (validating) {
      setValue("validating", false);
    }
  }, [validating]);

  return { ensureValidCheckout, getFormData, methods, usePaymentProvidersProps };
};
