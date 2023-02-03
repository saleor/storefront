import { AccountErrorCode } from "@/checkout-storefront/graphql";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { useGetParsedErrors } from "@/checkout-storefront/hooks/useGetParsedErrors";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { useAuth } from "@saleor/sdk";
import { object, string } from "yup";

interface SignInFormData {
  email: string;
  password: string;
}

interface SignInFormProps {
  onSuccess: () => void;
  // shared between sign in form and guest user form
  initialEmail: string;
}

export const useSignInForm = ({ onSuccess, initialEmail }: SignInFormProps) => {
  const { login } = useAuth();
  const { getParsedApiError } = useGetParsedErrors<SignInFormData, AccountErrorCode>();
  const { errorMessages } = useErrorMessages();

  const validationSchema = object({
    password: string().required(errorMessages.required),
    email: string().email(errorMessages.emailInvalid).required(errorMessages.required),
  });

  const defaultFormData: SignInFormData = {
    email: initialEmail,
    password: "",
  };

  // @ts-expect-error because login comes from the sdk which is no longer
  // maintained so we'll eventually have to implement our own auth flow
  const onSubmit = useFormSubmit<SignInFormData, typeof login, AccountErrorCode>({
    onSubmit: login,
    scope: "signIn",
    onSuccess,
    parse: (formData) => formData,
    onError: ({ errors, formHelpers: { setErrors } }) => {
      const parsedErrors = errors.reduce((result, error) => {
        const { code, field } = error;
        const parsedError = getParsedApiError(error);

        if (code === "INVALID_CREDENTIALS" && field === "email") {
          //  api will attribute invalid credentials error to
          // email but we'd rather highlight both fields
          return { ...result, email: parsedError.message, password: "" };
        }

        if (code === "INACTIVE") {
          // we don't really want to show anything here
          return result;
        }

        return { ...result, [field]: parsedError.message };
      }, {});

      setErrors(parsedErrors);
    },
  });

  const form = useForm<SignInFormData>({
    initialValues: defaultFormData,
    onSubmit,
    validationSchema,
  });

  return form;
};
