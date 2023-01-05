import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { CheckoutDetailsFragment, useCheckoutEmailUpdateMutation } from "@/saleor/api";

import { Button } from "../Button";
import { useRegions } from "../RegionsProvider";
import { messages } from "../translations";

export interface EmailSectionProps {
  checkout: CheckoutDetailsFragment;
}

export function EmailSection({ checkout }: EmailSectionProps) {
  const t = useIntl();
  const { query } = useRegions();
  const [modifyEmail, setModifyEmail] = useState(!checkout?.email);

  const [checkoutEmailUpdate] = useCheckoutEmailUpdateMutation({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: checkout?.email || "",
    },
  });
  const onEmailFormSubmit = handleSubmit(async (formData) => {
    const result = await checkoutEmailUpdate({
      variables: {
        email: formData.email,
        token: checkout?.token,
        locale: query.locale,
      },
    });
    const mutationErrors = result.data?.checkoutEmailUpdate?.errors || [];
    if (mutationErrors.length > 0) {
      mutationErrors.forEach((e) => setError("email", { message: e.message || "" }));
      return;
    }
    setModifyEmail(false);
  });

  return (
    <>
      <div className="mt-4 mb-4">
        <h2 className="checkout-section-header-active">
          {t.formatMessage(messages.emailAddressCardHeader)}
        </h2>
      </div>
      {!modifyEmail ? (
        <div className="flex justify-between items-center">
          <p className="text-base">{checkout?.email}</p>
          <Button onClick={() => setModifyEmail(true)}>
            {t.formatMessage(messages.changeButton)}
          </Button>
        </div>
      ) : (
        <form method="post" onSubmit={onEmailFormSubmit}>
          <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-full">
              <input
                type="text"
                autoComplete="email"
                className="w-full border-gray-300 rounded-lg shadow-sm text-base"
                spellCheck={false}
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
              />
              <p>{errors.email?.message}</p>
            </div>
            <div className="col-span-full">
              <button type="submit" className="btn-checkout-section">
                {t.formatMessage(messages.saveButton)}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default EmailSection;
