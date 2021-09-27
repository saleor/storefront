import { useAuth, useAuthState } from "@saleor/sdk";
import Link from "next/link";

import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

export interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.VFC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { authenticated } = useAuthState();
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
    getValues,
  } = useForm<LoginFormData>({});

  const redirectURL = router.query.next?.toString() || "/";

  const handleLogin = handleSubmitForm(async (formData: LoginFormData) => {
    const { data } = await login({
      email: formData.email,
      password: formData.password,
    });

    if (data?.tokenCreate?.errors[0]) {
      // Unable to sign in.
      console.log(data?.tokenCreate?.errors);
      setErrorForm("email", { message: "Invalid credentials" });
    }
  });
  if (authenticated) {
    // User signed in successfully.
    router.push(redirectURL);
    return null;
  }

  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center bg-gradient-to-r from-blue-100 to-blue-500">
      <div className="flex justify-end">
        <div className="bg-white min-h-screen w-1/2 flex justify-center items-center">
          <div>
            <form onSubmit={handleLogin}>
              <div>
                <span className="text-sm text-gray-900">Welcome back</span>
                <h1 className="text-2xl font-bold">Login to your account</h1>
              </div>

              <div className="my-3">
                <label className="block text-md mb-2">Email</label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="email"
                  placeholder="email"
                  {...registerForm("email", {
                    required: true,
                  })}
                />
              </div>
              <div className="mt-5">
                <label className="block text-md mb-2">Password</label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="password"
                  placeholder="password"
                  {...registerForm("password", {
                    required: true,
                  })}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700 hover:underline cursor-pointer pt-2">
                  Forgot password?
                </span>
              </div>
              <div className="">
                <button className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100">
                  Login now
                </button>
                {!!errorsForm.email && (
                  <p className="text-sm text-red-500 pt-2">
                    {errorsForm.email?.message}
                  </p>
                )}
              </div>
            </form>
            <p className="mt-8">
              {" "}
              Dont have an account?{" "}
              <Link href="/account/register">
                <a> Register!</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
