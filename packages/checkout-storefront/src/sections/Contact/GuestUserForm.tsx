import { useCheckoutEmailUpdateMutation } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { extractMutationErrors, useValidationResolver } from "@/checkout-storefront/lib/utils";
import React, { useEffect, useState } from "react";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { SignInFormContainer, SignInFormContainerProps } from "./SignInFormContainer";
import { object, string } from "yup";
import { useForm, useFormContext } from "react-hook-form";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { Checkbox } from "@/checkout-storefront/components/Checkbox";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useCheckoutUpdateStateTrigger } from "@/checkout-storefront/hooks";

type AnonymousCustomerFormProps = Pick<SignInFormContainerProps, "onSectionChange">;

interface FormData {
  email: string;
}

export const GuestUserForm: React.FC<AnonymousCustomerFormProps> = ({ onSectionChange }) => {
  const { checkout } = useCheckout();
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const { showErrors } = useAlerts("checkoutEmailUpdate");
  const [createAccountSelected, setCreateAccountSelected] = useState(false);
  const formContext = useFormContext();
  const {
    getValues: getContextValues,
    setValue: setContextValue,
    formState: contextFormState,
  } = formContext;

  const schema = object({
    email: string().email(errorMessages.invalid).required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);
  const formProps = useForm<FormData>({
    resolver,
    mode: "onBlur",
    defaultValues: { email: getContextValues("email") },
  });

  const { watch, getValues, setError, trigger } = formProps;

  useCheckoutFormValidationTrigger(trigger);

  const getInputProps = useGetInputProps(formProps);
  const getContextInputProps = useGetInputProps(formContext);

  useSetFormErrors({
    setError: setError,
    errors: contextFormState.errors,
  });

  const [{ fetching: updatingEmail }, updateEmail] = useCheckoutEmailUpdateMutation();

  useCheckoutUpdateStateTrigger("checkoutEmailUpdate", updatingEmail);

  const onSubmit = async ({ email }: FormData) => {
    if (!email || updatingEmail || email === checkout.email) {
      return;
    }

    const result = await updateEmail({
      email,
      checkoutId: checkout.id,
    });

    const [hasErrors, errors] = extractMutationErrors<FormData>(result);

    if (hasErrors) {
      showErrors(errors);
    }
  };

  const emailValue = watch("email");

  useEffect(() => setContextValue("email", emailValue), [emailValue]);

  useEffect(() => setContextValue("createAccount", createAccountSelected), [createAccountSelected]);

  return (
    <SignInFormContainer
      title={formatMessage("contact")}
      redirectSubtitle={formatMessage("haveAccount")}
      redirectButtonLabel={formatMessage("signIn")}
      onSectionChange={onSectionChange}
    >
      <TextInput
        label={formatMessage("emailLabel")}
        {...getInputProps("email", {
          // for some reason using handleSubmit here
          // disallows password input to focus
          onBlur: () => {
            void onSubmit(getValues());
          },
        })}
      />
      <Checkbox
        classNames={{ container: "!mb-0" }}
        value="createAccount"
        label={formatMessage("wantToCreateAccountLabel")}
        checked={createAccountSelected}
        onChange={setCreateAccountSelected}
      />
      {createAccountSelected && (
        <div className="mt-2">
          <PasswordInput
            label={formatMessage("passwordLabel")}
            {...getContextInputProps("password")}
          />
        </div>
      )}
    </SignInFormContainer>
  );
};
