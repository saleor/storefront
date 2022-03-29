import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { usePasswordChangeMutation } from "@/saleor/api";

import { messages } from "../translations";

interface PasswordChangeFormData {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

export function PasswordPreferences() {
  const t = useIntl();
  const [passwordChangeMutation] = usePasswordChangeMutation({});
  const [successMessage, setSuccessMessage] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<PasswordChangeFormData>();

  const onPasswordPreferenceSubmit = handleSubmit(async (formData) => {
    if (formData.newPassword !== formData.newPasswordRepeat) {
      setError("newPasswordRepeat", { message: "Passwords have to match." });
    } else {
      const result = await passwordChangeMutation({
        variables: {
          newPassword: formData.newPassword,
          oldPassword: formData.oldPassword,
        },
      });
      const mutationErrors = result.data?.passwordChange?.errors || [];
      if (mutationErrors.length > 0) {
        mutationErrors.forEach((e) =>
          setError(e.field as keyof PasswordChangeFormData, {
            message: e.message || "",
          })
        );
      } else if (result.data?.passwordChange?.user) {
        setSuccessMessage("Password changed successfully.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    }
  });
  return (
    <div className="mt-4 mb-4">
      <h2 className="checkout-section-header-active mb-2">
        {t.formatMessage(messages.changePasswordHeader)}
      </h2>
      <form onSubmit={onPasswordPreferenceSubmit}>
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-full">
            <label htmlFor="oldPassword" className="block pl-1 text-sm font-medium text-gray-700">
              {t.formatMessage(messages.oldPasswordFieldLabel)}
            </label>
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="password"
              placeholder="Old password"
              id="oldPassword"
              {...register("oldPassword", {
                required: true,
              })}
            />
            {!!errors.oldPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.oldPassword.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 w-full mt-2">
          <div className="col-span-full">
            <label htmlFor="newPassword" className="block pl-1 text-sm font-medium text-gray-700">
              {t.formatMessage(messages.newPasswordFieldLabel)}
            </label>
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="password"
              placeholder="New password"
              id="newPassword"
              {...register("newPassword", {
                required: true,
              })}
            />
            {!!errors.newPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 w-full mt-2">
          <div className="col-span-full">
            <label htmlFor="password" className="block pl-1 text-sm font-medium text-gray-700">
              {t.formatMessage(messages.newPasswordRepeatedFieldLabel)}
            </label>
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="password"
              placeholder="Repeat new password"
              id="password"
              {...register("newPasswordRepeat", {
                required: true,
              })}
            />
            {!!errors.newPasswordRepeat && (
              <p className="mt-2 text-sm text-red-600">{errors.newPasswordRepeat.message}</p>
            )}
          </div>
        </div>
        {!!successMessage && <p className="mt-2 text-sm text-green-600">{successMessage}</p>}
        <div>
          <button
            className="mt-2 w-40 bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
            onClick={() => onPasswordPreferenceSubmit()}
            type="submit"
          >
            {t.formatMessage(messages.saveButton)}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PasswordPreferences;
