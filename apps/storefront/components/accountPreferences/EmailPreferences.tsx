import React from "react";
import { useRequestEmailChangeMutation } from "@/saleor/api";
import { useForm } from "react-hook-form";
interface EmailChangeFormData {
  newEmail: string;
  password: string;
  redirectUrl: string;
}

export const EmailPreferences: React.VFC<any> = ({}) => {
  const [requestEmailChange] = useRequestEmailChangeMutation({});
  const [successMessage, setSuccessMessage] = React.useState<String | null>(
    null
  );
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
        redirectUrl: `https://localhost:3001/account`,
      },
    });
    const errors = result?.data?.requestEmailChange?.errors || [];
    if (errors.length > 0) {
      errors.forEach((e) =>
        setError(e.field as keyof EmailChangeFormData, {
          message: e.message || "",
        })
      );
      return;
    } else if (result.data?.requestEmailChange?.user) {
      setSuccessMessage(
        "Email changed successfully. Check your mailbox for confirmation email."
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  });

  return (
    <div className="mt-4 mb-4">
      <h2 className="checkout-section-header-active mb-2">Change email</h2>
      <form onSubmit={onEmailPreferenceSubmit}>
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-full">
            <label className="block pl-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="email"
              placeholder="Email"
              {...register("newEmail", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
            />
            {!!errors.newEmail && (
              <p className="mt-2 text-sm text-red-600">
                {errors.newEmail.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 w-full mt-2">
          <div className="col-span-full">
            <label className="block pl-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: true,
              })}
            />
            {!!errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        {!!successMessage && (
          <p className="mt-2 text-sm text-green-600">{successMessage}</p>
        )}
        <div>
          <button
            className="mt-2 w-40 bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
            onClick={() => onEmailPreferenceSubmit()}
            type="submit"
          >
            Submit changes
          </button>
        </div>
      </form>
    </div>
  );
};
