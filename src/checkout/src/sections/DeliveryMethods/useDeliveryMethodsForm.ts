import {
  type CountryCode,
  type ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/checkout/src/graphql";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { useDebouncedSubmit } from "@/checkout/src/hooks/useDebouncedSubmit";
import { type ChangeHandler, useForm, type UseFormReturn } from "@/checkout/src/hooks/useForm";
import { useFormSubmit } from "@/checkout/src/hooks/useFormSubmit";
import { type MightNotExist } from "@/checkout/src/lib/globalTypes";
import { getById } from "@/checkout/src/lib/utils/common";
import { useCheckoutUpdateStateChange } from "@/checkout/src/state/updateStateStore";
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
