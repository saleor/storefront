import { AccountErrorCode } from "@/checkout-storefront/graphql";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { ApiError } from "@/checkout-storefront/hooks/useGetParsedErrors/types";
import { useGetParsedErrors } from "@/checkout-storefront/hooks/useGetParsedErrors";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { useAuth } from "@saleor/sdk";
import { object, string } from "yup";

interface SignInFormData {
  email: string;
  password: string;
}

export const useSignInForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { login } = useAuth();
  const { getFormErrorsFromApiErrors } = useGetParsedErrors<SignInFormData>();
  const { errorMessages } = useErrorMessages();

  const validationSchema = object({
    password: string().required(errorMessages.required),
  });

  const defaultFormData: SignInFormData = {
    email: "",
    password: "",
  };

  // @ts-expect-error because login comes from the sdk which is no longer
  // maintained so we'll eventually have to implement our own auth flow
  const onSubmit = useFormSubmit<SignInFormData, typeof login>({
    onSubmit: login,
    onSuccess,
    parse: (formData) => formData,
    onError: ({ errors, formHelpers: { setErrors } }) => {
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
    validationSchema,
  });

  return form;
};
