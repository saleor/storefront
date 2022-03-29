import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { CheckoutDetailsFragment, useCheckoutAddPromoCodeMutation } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";
import { messages } from "../translations";

export interface PromoCodeFormData {
  promoCode: string;
}

export interface CartSummaryProps {
  checkout: CheckoutDetailsFragment;
}

export function CartSummary({ checkout }: CartSummaryProps) {
  const t = useIntl();
  const [editPromoCode] = useState(false);
  const [checkoutAddPromoCodeMutation] = useCheckoutAddPromoCodeMutation();
  const { subtotalPrice, shippingPrice, totalPrice, discount } = checkout;
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<PromoCodeFormData>({});
  const { query, formatPrice } = useRegions();

  const onAddPromoCode = handleSubmitForm(async (formData: PromoCodeFormData) => {
    const { data: promoMutationData } = await checkoutAddPromoCodeMutation({
      variables: {
        promoCode: formData.promoCode,
        token: checkout.token,
        locale: query.locale,
      },
    });
    const errors = promoMutationData?.checkoutAddPromoCode?.errors;
    if (!!errors && errors.length > 0) {
      setErrorForm("promoCode", { message: errors[0].message || "Error" });
    }
  });
  return (
    <section>
      <div className="bg-gray-50 rounded p-8 border">
        {(editPromoCode || !discount?.amount) && (
          <form className="pb-4" onSubmit={onAddPromoCode}>
            <label htmlFor="discount-code" className="block text-sm font-medium text-gray-700">
              {t.formatMessage(messages.discountCodeFieldLabel)}
            </label>
            <div className="flex space-x-4 mt-1">
              <input
                type="text"
                id="discount-code"
                className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                {...registerForm("promoCode", {
                  required: true,
                })}
              />
              <button
                type="submit"
                className="bg-gray-200 text-sm font-medium text-gray-600 rounded-md px-4 hover:bg-blue-300"
              >
                {t.formatMessage(messages.activateButton)}
              </button>
            </div>
            {!!errorsForm.promoCode && (
              <p className="text-sm text-red-500 pt-2">{errorsForm.promoCode?.message}</p>
            )}
          </form>
        )}
        <div className="flow-root">
          <dl className="text-sm">
            {!!discount?.amount && (
              <div className="py-2 flex items-center justify-between">
                <dt className="text-gray-600">{t.formatMessage(messages.discount)}</dt>
                <dd className="font-medium text-gray-900">{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">{t.formatMessage(messages.subtotal)}</dt>
              <dd className="font-medium text-gray-900">{formatPrice(subtotalPrice?.net)}</dd>
            </div>
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">{t.formatMessage(messages.shipping)}</dt>
              <dd className="font-medium text-gray-900">{formatPrice(shippingPrice?.gross)}</dd>
            </div>
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">{t.formatMessage(messages.tax)}</dt>
              <dd className="font-medium text-gray-900">{formatPrice(subtotalPrice?.tax)}</dd>
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-gray-300">
              <dt className="text-lg font-bold text-gray-900">{t.formatMessage(messages.total)}</dt>
              <dd className="text-lg font-bold text-gray-900">{formatPrice(totalPrice?.gross)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
