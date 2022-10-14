import { Title } from "@/checkout-storefront/components/Title";
import { Text } from "@saleor/ui-kit";
import {
  CountryCode,
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import React, { useCallback, useEffect, useRef } from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import {
  extractMutationErrors,
  getById,
  getFormattedMoney,
  localeToLanguageCode,
} from "@/checkout-storefront/lib/utils";
import { Divider } from "@/checkout-storefront/components/Divider";
import { CommonSectionProps } from "@/checkout-storefront/lib/globalTypes";
import { deliveryMethodsLabels, deliveryMethodsMessages } from "./messages";
import { useCheckoutUpdateStateTrigger, useFormDebouncedSubmit } from "@/checkout-storefront/hooks";
import { Controller, useForm } from "react-hook-form";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";

interface FormData {
  selectedMethodId: string | undefined;
}

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
  const formatMessage = useFormattedMessages();
  const { locale } = useLocale();
  const { checkout } = useCheckout();
  const { shippingMethods, shippingAddress, deliveryMethod } = checkout;
  const { showErrors } = useAlerts("checkoutDeliveryMethodUpdate");

  const previousShippingCountry = useRef<CountryCode | undefined | null>(
    shippingAddress?.country?.code as CountryCode | undefined
  );

  const [{ fetching }, updateDeliveryMethod] = useCheckoutDeliveryMethodUpdateMutation();

  useCheckoutUpdateStateTrigger("checkoutDeliveryMethodUpdate", fetching);

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

  const defaultFormData: FormData = {
    selectedMethodId: deliveryMethod?.id || getAutoSetMethod()?.id,
  };

  const formProps = useForm<FormData>({ defaultValues: defaultFormData });
  const { watch, getValues, setValue, control } = formProps;

  const selectedMethodId = watch("selectedMethodId");

  useCheckoutUpdateStateTrigger("checkoutDeliveryMethodUpdate", fetching);

  const hasValidMethodSelected =
    selectedMethodId && shippingMethods.some(getById(selectedMethodId));

  useEffect(() => {
    const hasShippingCountryChanged =
      shippingAddress?.country?.code !== previousShippingCountry.current;

    const hasValidMethodSelected =
      selectedMethodId && shippingMethods.some(getById(selectedMethodId));

    if (hasValidMethodSelected) {
      return;
    }

    setValue("selectedMethodId", getAutoSetMethod()?.id);

    if (hasShippingCountryChanged) {
      previousShippingCountry.current = shippingAddress?.country?.code as CountryCode;
    }
  }, [
    shippingAddress,
    shippingMethods,
    getAutoSetMethod,
    selectedMethodId,
    hasValidMethodSelected,
    setValue,
  ]);

  const handleSubmit = useCallback(
    async ({ selectedMethodId }: FormData) => {
      if (!selectedMethodId) {
        return;
      }

      const result = await updateDeliveryMethod({
        languageCode: localeToLanguageCode(locale),
        deliveryMethodId: selectedMethodId,
        checkoutId: checkout.id,
      });

      const [hasErrors, errors] = extractMutationErrors(result);

      if (!hasErrors) {
        return;
      }
      setValue("selectedMethodId", selectedMethodId);
      showErrors(errors);
    },
    [updateDeliveryMethod, locale, checkout.id, setValue, showErrors]
  );

  const debouncedSubmit = useFormDebouncedSubmit<FormData>({
    onSubmit: handleSubmit,
    getValues,
    defaultFormData,
  });

  const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
    if (!min || !max) {
      return undefined;
    }

    return formatMessage(deliveryMethodsMessages.businessDays, {
      min: min.toString(),
      max: max.toString(),
    });
  };

  useEffect(() => {
    void debouncedSubmit();
  }, [selectedMethodId, debouncedSubmit]);

  if (!checkout?.isShippingRequired || collapsed) {
    return null;
  }

  return (
    <>
      <Divider />
      <div className="section" data-testid="deliveryMethods">
        <Title className="mb-2">{formatMessage(deliveryMethodsMessages.deliveryMethods)}</Title>
        {!shippingAddress && (
          <Text>{formatMessage(deliveryMethodsMessages.noShippingAddressMessage)}</Text>
        )}
        <Controller
          control={control}
          name="selectedMethodId"
          render={({ field: { onChange } }) => (
            <SelectBoxGroup label={formatMessage(deliveryMethodsLabels.deliveryMethods)}>
              {shippingMethods?.map(
                ({ id, name, price, minimumDeliveryDays: min, maximumDeliveryDays: max }) => (
                  <SelectBox value={id} selectedValue={selectedMethodId} onChange={onChange}>
                    <div className="min-h-12 grow flex flex-col justify-center pointer-events-none">
                      <div className="flex flex-row justify-between self-stretch items-center">
                        <Text>{name}</Text>
                        <Text>{getFormattedMoney(price)}</Text>
                      </div>
                      <Text size="xs" color="secondary">
                        {getSubtitle({ min, max })}
                      </Text>
                    </div>
                  </SelectBox>
                )
              )}
            </SelectBoxGroup>
          )}
        />
      </div>
    </>
  );
};
