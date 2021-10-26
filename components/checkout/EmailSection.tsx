import {
  CheckoutDetailsFragment,
  useCheckoutEmailUpdateMutation,
} from "@/saleor/api";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Button";

export interface EmailSectionProps {
  checkout: CheckoutDetailsFragment;
}

export const EmailSection = ({ checkout }: EmailSectionProps) => {
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
      variables: { email: formData.email, token: checkout?.token },
    });
    const errors = result.data?.checkoutEmailUpdate?.errors || [];
    if (errors.length > 0) {
      errors.forEach((e) => setError("email", { message: e.message || "" }));
      return;
    }
    setModifyEmail(false);
  });

  return (
    <>
      <div className="mt-4 mb-4">
        <h2 className="checkout-section-header-active">Email Address</h2>
      </div>
      {!modifyEmail ? (
        <div className="flex justify-between items-center">
          <p>{checkout?.email}</p>
          <Button onClick={() => setModifyEmail(true)}>Change</Button>
        </div>
      ) : (
        <>
          <form onSubmit={onEmailFormSubmit}>
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-full">
                <input
                  type="text"
                  autoComplete="email"
                  className="w-full border-gray-300 rounded-lg shadow-sm"
                  {...register("email", {
                    required: true,
                    pattern: /^\S+@\S+$/i,
                  })}
                />
                <p>{errors.email?.message}</p>
              </div>
              <div className="col-span-full">
                <button
                  className="btn-checkout-section"
                  onClick={() => onEmailFormSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default EmailSection;
