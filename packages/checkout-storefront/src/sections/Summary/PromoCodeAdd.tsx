import { Button } from "@/checkout-storefront/components/Button";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useCheckoutAddPromoCodeMutation } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Classes } from "@/checkout-storefront/lib/globalTypes";
import { summaryLabels, summaryMessages } from "./messages";
import clsx from "clsx";
import React, { FC } from "react";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";
import { useForm } from "@/checkout-storefront/hooks/useForm";

interface PromoCodeFormData {
  promoCode: string;
}

export const PromoCodeAdd: FC<Classes> = ({ className }) => {
  const formatMessage = useFormattedMessages();
  const [, checkoutAddPromoCode] = useCheckoutAddPromoCodeMutation();

  const onSubmit = useFormSubmit<PromoCodeFormData, typeof checkoutAddPromoCode>({
    scope: "checkoutAddPromoCode",
    onSubmit: checkoutAddPromoCode,
    parse: ({ promoCode, languageCode, checkoutId }) => ({
      promoCode,
      checkoutId,
      languageCode,
    }),
    onSuccess: ({ formHelpers: { resetForm } }) => resetForm(),
  });

  const form = useForm<PromoCodeFormData>({
    onSubmit,
    initialValues: { promoCode: "" },
  });
  const {
    values: { promoCode },
  } = form;

  const showApplyButton = promoCode.length > 0;

  return (
    <FormProvider form={form}>
      <div className={clsx("relative px-4 pt-4", className)}>
        <TextInput optional name="promoCode" label={formatMessage(summaryMessages.addDiscount)} />
        {showApplyButton && (
          <Button
            className="absolute right-7 top-7"
            variant="tertiary"
            ariaLabel={formatMessage(summaryLabels.apply)}
            label={formatMessage(summaryMessages.apply)}
            type="submit"
          />
        )}
      </div>
    </FormProvider>
  );
};
