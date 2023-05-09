import {
  CountryCode,
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useDebouncedSubmit } from "@/checkout-storefront/hooks/useDebouncedSubmit";
import { ChangeHandler, useForm, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { MightNotExist } from "@/checkout-storefront/lib/globalTypes";
import { getById } from "@/checkout-storefront/lib/utils/common";
import { useCheckoutUpdateStateChange } from "@/checkout-storefront/state/updateStateStore";
import { useCallback, useEffect, useMemo, useRef } from "react";

interface DeliveryMethodsFormData {
  selectedMethodId: string | undefined;
}

export const useDeliveryMethodsForm = (): UseFormReturn<DeliveryMethodsFormData> => {
  const { checkout } = useCheckout();
  const { shippingMethods, shippingAddress, deliveryMethod } = checkout;
  const [, updateDeliveryMethod] = useCheckoutDeliveryMethodUpdateMutation();
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange("checkoutDeliveryMethodUpdate");

  const previousShippingCountry = useRef<MightNotExist<CountryCode>>(
    shippingAddress?.country?.code as CountryCode | undefined
  );

  const getAutoSetMethod = useCallback(() => {
    if (!shippingMethods.length) {
      return;
    }

    const cheapestMethod = shippingMethods.reduce(
      (resultMethod, currentMethod) =>
        currentMethod.price.amount < resultMethod.price.amount ? currentMethod : resultMethod,
      shippingMethods[0] as ShippingMethod
    );

    return cheapestMethod;
  }, [shippingMethods]);

  const defaultFormData: DeliveryMethodsFormData = {
    selectedMethodId: deliveryMethod?.id || getAutoSetMethod()?.id,
  };

  const onSubmit = useFormSubmit<DeliveryMethodsFormData, typeof updateDeliveryMethod>(
    useMemo(
      () => ({
        scope: "checkoutDeliveryMethodUpdate",
        onSubmit: updateDeliveryMethod,
        shouldAbort: ({ formData: { selectedMethodId } }) =>
          !selectedMethodId || selectedMethodId === checkout.deliveryMethod?.id,
        parse: ({ selectedMethodId, languageCode, checkoutId }) => ({
          deliveryMethodId: selectedMethodId as string,
          languageCode,
          checkoutId,
        }),
        onError: ({ formData: { selectedMethodId }, formHelpers: { setValues } }) => {
          setValues({ selectedMethodId });
        },
      }),
      [checkout.deliveryMethod?.id, updateDeliveryMethod]
    )
  );

  const debouncedSubmit = useDebouncedSubmit(onSubmit);

  const form = useForm<DeliveryMethodsFormData>({
    initialValues: defaultFormData,
    onSubmit: debouncedSubmit,
    initialDirty: true,
  });

  const {
    setFieldValue,
    values: { selectedMethodId },
    handleSubmit,
    handleChange,
  } = form;

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit, selectedMethodId]);

  useEffect(() => {
    const hasShippingCountryChanged =
      shippingAddress?.country?.code !== previousShippingCountry.current;

    const hasValidMethodSelected =
      selectedMethodId && shippingMethods.some(getById(selectedMethodId));

    if (hasValidMethodSelected) {
      return;
    }

    void setFieldValue("selectedMethodId", getAutoSetMethod()?.id);

    if (hasShippingCountryChanged) {
      previousShippingCountry.current = shippingAddress?.country?.code as CountryCode;
    }
  }, [
    shippingAddress,
    shippingMethods,
    getAutoSetMethod,
    selectedMethodId,
    setFieldValue,
    form.values.selectedMethodId,
  ]);

  const onChange: ChangeHandler = (event) => {
    setCheckoutUpdateState("loading");
    handleChange(event);
  };

  return { ...form, handleChange: onChange };
};
