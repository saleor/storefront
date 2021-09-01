import { formatAsMoney } from "@/lib/util";
import {
  Checkout,
  CheckoutDetailsFragment,
  useCheckoutEmailUpdateMutation,
} from "@/saleor/api";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Button";

export const EmailSection = ({
  checkout,
}: {
  checkout?: CheckoutDetailsFragment;
}) => {
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
    <div className="col-span-full">
      {!modifyEmail ? (
        <div className="flex justify-between items-center">
          <div>
            <label
              htmlFor="email-address"
              className="block text-sm font-medium text-gray-800"
            >
              Email address
            </label>
            <p>{checkout?.email}</p>
          </div>
          <Button
            onClick={() => setModifyEmail(true)}
          >
            Change
          </Button>
        </div>
      ) : (
        <>
          <form onSubmit={onEmailFormSubmit}>
            <label
              htmlFor="email-address"
              className="block text-sm font-medium text-gray-800"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                type="text"
                autoComplete="email"
                className="w-full border-gray-300 rounded-lg shadow-sm"
                {...register("email", {
                  required: true,
                  pattern: /^\S+\S+$/i,
                })}
              />
              <p>{errors.email?.message}</p>
            </div>
            <Button
              onClick={() => onEmailFormSubmit}
            >
              Save
            </Button>
          </form>
        </>
      )}
    </div>
  );
};
