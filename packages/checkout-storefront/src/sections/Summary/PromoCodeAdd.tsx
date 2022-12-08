import { Button } from "@/checkout-storefront/components/Button";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useCheckoutAddPromoCodeMutation } from "@/checkout-storefront/graphql";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors/useSetFormErrors";
import { Classes } from "@/checkout-storefront/lib/globalTypes";
import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { summaryLabels, summaryMessages } from "./messages";
import clsx from "clsx";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";

interface PromoCodeAddFormData {
  promoCode: string;
}

export const PromoCodeAdd: FC<Classes> = ({ className }) => {
  const formatMessage = useFormattedMessages();
  const { setApiErrors, errors } = useErrors<PromoCodeAddFormData>();

  const schema = object({
    code: string(),
  });
  const resolver = useValidationResolver(schema);

  const [, checkoutAddPromoCode] = useCheckoutAddPromoCodeMutation();

  const formProps = useForm<PromoCodeAddFormData>({ resolver, defaultValues: { promoCode: "" } });
  const { handleSubmit, watch, setError, reset } = formProps;
  const getInputProps = useGetInputProps(formProps);

  const showApplyButton = !!watch("promoCode");

  const onSubmit = useSubmit<PromoCodeAddFormData, typeof checkoutAddPromoCode>({
    scope: "checkoutAddPromoCode",
    onSubmit: checkoutAddPromoCode,
    formDataParse: ({ promoCode, languageCode, checkoutId }) => ({
      promoCode,
      checkoutId,
      languageCode,
    }),
    onError: (errors) => setApiErrors(errors),
    onSuccess: () => reset(),
  });

  useSetFormErrors<PromoCodeAddFormData>({
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
