import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  CheckoutDetailsFragment,
  useCheckoutAddPromoCodeMutation,
} from "@/saleor/api";

import { useRegions } from "./RegionsProvider";

export interface PromoCodeFormData {
  promoCode: string;
}

export interface CartSummaryProps {
  checkout: CheckoutDetailsFragment;
}

export const CartSummary = ({ checkout }: CartSummaryProps) => {
  const router = useRouter();
  const [editPromoCode, setEditPromoCode] = useState(false);
  const [checkoutAddPromoCodeMutation] = useCheckoutAddPromoCodeMutation();
  const { subtotalPrice, shippingPrice, totalPrice, discount, discountName } =
    checkout;
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
    getValues,
  } = useForm<PromoCodeFormData>({});
  const { query } = useRegions();

  const onAddPromoCode = handleSubmitForm(
    async (formData: PromoCodeFormData) => {
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
    }
  );
  return (
    <section>
      <div className="bg-gray-50 rounded p-8 border">
        {(editPromoCode || !discount?.amount) && (
          <form className="pb-4" onSubmit={onAddPromoCode}>
            <label
              htmlFor="discount-code"
              className="block text-sm font-medium text-gray-700"
            >
              Discount code
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
                Apply
              </button>
            </div>
            {!!errorsForm.promoCode && (
              <p className="text-sm text-red-500 pt-2">
                {errorsForm.promoCode?.message}
              </p>
            )}
          </form>
        )}
        <div className="flow-root">
          <dl className="text-sm">
            {!!discount?.amount && (
              <div className="py-2 flex items-center justify-between">
                <dt className="text-gray-600">Discount</dt>
                <dd className="font-medium text-gray-900">
                  {discount?.localizedAmount}
                </dd>
              </div>
            )}
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="font-medium text-gray-900">
                {subtotalPrice?.net.localizedAmount}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">Shipping</dt>
              <dd className="font-medium text-gray-900">
                {shippingPrice?.gross.localizedAmount}
              </dd>
            </div>
            <div className="py-2 flex items-center justify-between">
              <dt className="text-gray-600">Tax</dt>
              <dd className="font-medium text-gray-900">
                {subtotalPrice?.tax.localizedAmount}
              </dd>
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-gray-300">
              <dt className="text-lg font-bold text-gray-900">Total</dt>
              <dd className="text-lg font-bold text-gray-900">
                {totalPrice?.gross.localizedAmount}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};
