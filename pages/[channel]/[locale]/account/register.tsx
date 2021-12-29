import { useAuth } from "@saleor/sdk";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

import { usePaths } from "@/lib/paths";

export interface RegisterFormData {
  email: string;
  password: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const paths = usePaths();

  const { register } = useAuth();
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<RegisterFormData>({});

  const handleRegister = handleSubmitForm(
    async (formData: RegisterFormData) => {
      const { data } = await register({
        email: formData.email,
        password: formData.password,
        redirectUrl: `${window.location.origin}/account/confirm`,
      });

      if (data?.accountRegister?.errors.length) {
        // Unable to sign in.
        data?.accountRegister?.errors.forEach((e) => {
          if (e.field === "email") {
            setErrorForm("email", { message: e.message! });
          } else if (e.field === "password") {
            setErrorForm("password", { message: e.message! });
          } else {
            console.error("Registration error:", e);
          }
        });
        return;
      }
      // User signed in successfully.
      router.push(paths.$url());
      return null;
    }
  );

  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center bg-gradient-to-r from-blue-100 to-blue-500">
      <div className="flex justify-end">
        <div className="bg-white min-h-screen w-1/2 flex justify-center items-center">
          <div>
            <form onSubmit={handleRegister}>
              <div>
                <h1 className="text-2xl font-bold">Create a new account</h1>
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
                {!!errorsForm.email && (
                  <p className="text-sm text-red-500 pt-2">
                    {errorsForm.email?.message}
                  </p>
                )}
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
                {!!errorsForm.password && (
                  <p className="text-sm text-red-500 pt-2">
                    {errorsForm.password?.message}
                  </p>
                )}
              </div>

              <div className="">
                <button className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100">
                  Register
                </button>
              </div>
            </form>
            <p className="mt-8">
              {" "}
              Already have an account?{" "}
              <Link href={paths.account.login.$url()}>
                <a> Log in!</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
