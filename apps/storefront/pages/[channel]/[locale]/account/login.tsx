import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "@/components/translations";
import { DEMO_MODE } from "@/lib/const";
import { usePaths } from "@/lib/paths";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";

export type OptionalQuery = {
  next?: string;
};

export interface LoginFormData {
  email: string;
  password: string;
}

function LoginPage() {
  const router = useRouter();
  const paths = usePaths();
  const t = useIntl();

  const { signIn } = useSaleorAuthContext();

  const defaultValues = DEMO_MODE
    ? {
        email: "admin@example.com",
        password: "admin",
      }
    : {};

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<LoginFormData>({ defaultValues });

  const routerQueryNext = router.query.next?.toString() || "";
  const isExternalUrl = /^\w+:\/\//.test(routerQueryNext);
  const redirectURL = !routerQueryNext || isExternalUrl ? paths.$url() : routerQueryNext;

  const handleLogin = handleSubmitForm(async (formData: LoginFormData) => {
    const { data } = await signIn({
      email: formData.email,
      password: formData.password,
    });

    if (data?.tokenCreate?.errors?.length) {
      setErrorForm("email", { message: "Invalid credentials" });
      return;
    }

    void router.push(redirectURL);
  });

  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center bg-gradient-to-r from-blue-100 to-blue-500">
      <div className="flex justify-end">
        <div className="bg-white min-h-screen w-1/2 flex justify-center items-center">
          <div>
            <form method="post" onSubmit={handleLogin}>
              <div>
                <span className="text-sm text-gray-900">
                  {t.formatMessage(messages.loginWelcomeMessage)}
                </span>
                <h1 className="text-2xl font-bold">{t.formatMessage(messages.loginHeader)}</h1>
              </div>

              <div className="my-3">
                <label htmlFor="email" className="block text-md mb-2">
                  {t.formatMessage(messages.loginEmailFieldLabel)}
                </label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="email"
                  id="email"
                  spellCheck={false}
                  {...registerForm("email", {
                    required: true,
                  })}
                />
              </div>
              <div className="mt-5">
                <label htmlFor="password" className="block text-md mb-2">
                  {t.formatMessage(messages.loginPasswordFieldLabel)}
                </label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="password"
                  id="password"
                  spellCheck={false}
                  {...registerForm("password", {
                    required: true,
                  })}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700 hover:underline cursor-pointer pt-2">
                  {t.formatMessage(messages.loginRemindPasswordButtonLabel)}
                </span>
              </div>
              <div className="">
                <button
                  type="submit"
                  className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
                >
                  {t.formatMessage(messages.logIn)}
                </button>
                {!!errorsForm.email && (
                  <p className="text-sm text-red-500 pt-2">{errorsForm.email?.message}</p>
                )}
              </div>
            </form>
            <p className="mt-8">
              <Link href={paths.account.register.$url()}>
                {t.formatMessage(messages.createAccount)}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
