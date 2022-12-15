import { AccountErrorCode } from "@/checkout-storefront/graphql";
import { useErrorMessages } from "@/checkout-storefront/hooks";
import { errorMessages } from "@/checkout-storefront/hooks/useAlerts/messages";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { useAuth } from "@saleor/sdk";
import { object, string } from "yup";

interface SignInFormData {
  email: string;
  password: string;
}

export const useSignInForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { login } = useAuth();
  const { getFormErrorsFromApiErrors } = useGetParsedApiErrors<SignInFormData>();
  const { errorMessages } = useErrorMessages();

  const schema = object({
    password: string().required(errorMessages.required),
  });

  const defaultFormData: SignInFormData = {
    email: "",
    password: "",
  };

  // @ts-ignore because login comes from the sdk which is no longer
  // maintained so we'll eventually have to implement our own auth flow
  const { onSubmit } = useSubmit<SignInFormData, typeof login>({
    onSubmit: login,
    onSuccess,
    onError: ({ errors, setErrors }) => {
      //  api will attribute invalid credentials error to
      // email but we'd rather highlight both fields
      const fieldsErrors = errors.some(
        ({ code }) => (code as AccountErrorCode) === "INVALID_CREDENTIALS"
      )
        ? [...errors, { code: "", message: "", field: "password" } as ApiError<SignInFormData>]
        : errors;

      setErrors(getFormErrorsFromApiErrors(fieldsErrors));
    },
  });

  const form = useForm<SignInFormData>({
    initialValues: defaultFormData,
    onSubmit,
  });

  return form;
};
