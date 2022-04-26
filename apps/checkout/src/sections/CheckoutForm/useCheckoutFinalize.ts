import { pay as payRequest } from "@/fetch";
import { useCheckout } from "@/hooks/useCheckout";
import { useFetch } from "@/hooks/useFetch";
import { extractMutationErrors } from "@/lib/utils";
import { useErrors } from "@/providers/ErrorsProvider";
import { useAuth, useAuthState } from "@saleor/sdk";
import { omit } from "lodash-es";
import { FormData } from "./types";

export const useCheckoutFinalize = () => {
  const { checkout } = useCheckout();
  const { register } = useAuth();
  const { user } = useAuthState();
  const [, pay] = useFetch(payRequest, { skip: true });
  const { setApiErrors, hasErrors } = useErrors<FormData>("userRegister");

  const checkoutPay = async () => {
    const result = await pay({
      provider: "mollie",
      checkoutId: checkout?.id,
      totalAmount: checkout?.totalPrice?.gross?.amount as number,
    });

    if (result?.data?.checkoutUrl) {
      window.location.replace(result?.data?.checkoutUrl);
    }
  };

  const handleUserRegister = async (formData: FormData) => {
    const registerFormData = omit(formData, "createAccount");
    // adding redirect url becuase api is broken and requires it
    // despite te types saying otherwise
    const result = await register({ ...registerFormData, redirectUrl: "" });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      setApiErrors(errors);
    }
  };

  const checkoutFinalize = async (formData: FormData) => {
    if (!user && formData.createAccount) {
      await handleUserRegister(formData);
    }

    if (!hasErrors) {
      checkoutPay();
    }
  };

  return { checkoutFinalize };
};
