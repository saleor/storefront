import { Button } from "@/checkout-storefront/components/Button";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useCheckoutAddPromoCodeMutation } from "@/checkout-storefront/graphql";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { Classes } from "@/checkout-storefront/lib/globalTypes";
import {
  extractMutationErrors,
  localeToLanguageCode,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import { summaryLabels, summaryMessages } from "./messages";
import clsx from "clsx";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";

interface FormData {
  promoCode: string;
}

export const PromoCodeAdd: FC<Classes> = ({ className }) => {
  const { locale } = useLocale();
  const { checkout } = useCheckout();
  const formatMessage = useFormattedMessages();
  const { setApiErrors, errors } = useErrors<FormData>();
  const { showErrors } = useAlerts("checkoutAddPromoCode");

  const schema = object({
    code: string(),
  });
  const resolver = useValidationResolver(schema);

  const [, checkoutAddPromoCode] = useCheckoutAddPromoCodeMutation();

  const formProps = useForm<FormData>({ resolver, defaultValues: { promoCode: "" } });
  const { handleSubmit, watch, setError, reset } = formProps;
  const getInputProps = useGetInputProps(formProps);

  const showApplyButton = !!watch("promoCode");

  const onSubmit = async ({ promoCode }: FormData) => {
    const result = await checkoutAddPromoCode({
      languageCode: localeToLanguageCode(locale),
      promoCode,
      checkoutId: checkout.id,
    });
    const [hasErrors, apiErrors] = extractMutationErrors(result);

    if (hasErrors) {
      setApiErrors(apiErrors);
      showErrors(apiErrors);
      return;
    }

    reset();
  };

  useSetFormErrors<FormData>({
    setError,
    errors,
  });

  return (
    <div className={clsx("relative px-4 pt-4", className)}>
      <TextInput
        label={formatMessage(summaryMessages.addDiscount)}
        {...getInputProps("promoCode")}
        optional
      />
      {showApplyButton && (
        <Button
          className="absolute right-7 top-7"
          variant="tertiary"
          ariaLabel={formatMessage(summaryLabels.apply)}
          label={formatMessage(summaryMessages.apply)}
          onClick={handleSubmit(onSubmit)}
        />
      )}
    </div>
  );
};
