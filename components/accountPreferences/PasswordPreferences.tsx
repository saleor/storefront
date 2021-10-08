import React from "react";
import { useForm } from "react-hook-form";

export const PasswordPreferences: React.VFC<any> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onPasswordPreferenceSubmit = handleSubmit(async (formData) => {
    // const result = await requestEmailChange({
    //   variables: {
    //     channel: "default-channel",
    //     newEmail: formData.email,
    //     password: "IrgenKini98!",
    //     redirectUrl: "/",
    //   },
    // });
    // const errors = result.data?.errors || [];
    // if (errors.length > 0) {
    //   errors.forEach((e) => setError("email", { message: e.message || "" }));
    //   return;
    // }
  });
  return (
    <div className="mt-4 mb-4">
      <h2 className="checkout-section-header-active mb-2">Change password</h2>
      <form
        onSubmit={() => {
          console.log("whatever");
        }}
      >
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-full">
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="password"
              placeholder="Old password"
              {...register("oldPassword", {
                required: true,
              })}
            />
            <p>{errors.email?.message}</p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 w-full mt-2">
          <div className="col-span-full">
            <input
              className="px-4 py-2 rounded-md text-sm outline-none w-full"
              type="password"
              placeholder="New Password"
              {...register("newPassword", {
                required: true,
              })}
            />
            <p>{errors.email?.message}</p>
          </div>
        </div>
        <div>
          <button
            className="mt-4 w-40 bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
            onClick={() => console.log("whatever")}
          >
            Submit changes
          </button>
        </div>
      </form>
    </div>
  );
};
