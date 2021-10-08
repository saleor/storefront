import React from "react";
import { useRequestEmailChangeMutation } from "@/saleor/api";
import { useForm } from "react-hook-form";
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
  } = useForm();
  const onEmailPreferenceSubmit = handleSubmit(async (formData) => {
    const result = await requestEmailChange({
      variables: {
        channel: "default-channel",
        newEmail: formData.email,
        password: formData.password,
        redirectUrl: `https://localhost:3001/account`,
      },
    });
    const errors = result?.data?.requestEmailChange?.errors || [];
    if (errors.length > 0) {
      errors.forEach((e) => setError("error", { message: e.message || "" }));
      return;
    } else if (result.data?.requestEmailChange?.user) {
      setSuccessMessage(
        "Email changed succesfully. Check your mailbox for confirmation email."
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  });

  return (
    <div className="mt-4 mb-4">
      <h2 className="checkout-section-header-active mb-2">Change email</h2>
      <form onSubmit={onEmailPreferenceSubmit}>
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-full">
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 w-full mt-2">
          <div className="col-span-full">
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: true,
              })}
            />
            <p className="mt-2 text-sm text-red-600">{errors.error?.message}</p>
          </div>
        </div>
        {successMessage !== null ? (
          <p className="mt-2 text-sm text-green-600">{successMessage}</p>
        ) : null}
        <div>
          <button
            className="mt-2 w-40 bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
            onClick={() => onEmailPreferenceSubmit()}
          >
            Submit changes
          </button>
        </div>
      </form>
    </div>
  );
};
