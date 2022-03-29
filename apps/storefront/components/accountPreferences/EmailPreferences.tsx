import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { useRequestEmailChangeMutation } from "@/saleor/api";

import { messages } from "../translations";

interface EmailChangeFormData {
  newEmail: string;
  password: string;
  redirectUrl: string;
}

export function EmailPreferences() {
  const t = useIntl();
  const [requestEmailChange] = useRequestEmailChangeMutation({});
  const [successMessage, setSuccessMessage] = React.useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<EmailChangeFormData>();

  const onEmailPreferenceSubmit = handleSubmit(async (formData) => {
    const result = await requestEmailChange({
      variables: {
        newEmail: formData.newEmail,
        password: formData.password,
        redirectUrl: `https://${window.location.host}/account/preferences`,
      },
    });
    const mutationErrors = result?.data?.requestEmailChange?.errors || [];
    if (mutationErrors.length > 0) {
      mutationErrors.forEach((e) =>
        setError(e.field as keyof EmailChangeFormData, {
          message: e.message || "",
        })
      );
    } else if (result.data?.requestEmailChange?.user) {
      setSuccessMessage("Email changed successfully. Check your mailbox for confirmation email.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  });

  return (
    <div className="mt-4 mb-4">
      <h2 className="checkout-section-header-active mb-2">Change email</h2>
      <form onSubmit={onEmailPreferenceSubmit}>
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-full">
            <label htmlFor="newEmail" className="block pl-1 text-sm font-medium text-gray-700">
              {t.formatMessage(messages.loginEmailFieldLabel)}
            </label>
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="email"
              id="newEmail"
              {...register("newEmail", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
            />
            {!!errors.newEmail && (
              <p className="mt-2 text-sm text-red-600">{errors.newEmail.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 w-full mt-2">
          <div className="col-span-full">
            <label htmlFor="password" className="block pl-1 text-sm font-medium text-gray-700">
              {t.formatMessage(messages.loginPasswordFieldLabel)}
            </label>
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="password"
              id="password"
              {...register("password", {
                required: true,
              })}
            />
            {!!errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>
        {!!successMessage && <p className="mt-2 text-sm text-green-600">{successMessage}</p>}
        <div>
          <button
            className="mt-2 w-40 bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
            onClick={() => onEmailPreferenceSubmit()}
            type="submit"
          >
            {t.formatMessage(messages.saveButton)}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailPreferences;
