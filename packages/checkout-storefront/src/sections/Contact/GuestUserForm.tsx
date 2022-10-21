import { useCheckoutEmailUpdateMutation } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import {
  extractMutationErrors,
  localeToLanguageCode,
  useValidationResolver,
} from "@/checkout-storefront/lib/utils";
import React, { useCallback, useEffect, useState } from "react";
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
import { useFormDebouncedSubmit } from "@/checkout-storefront/hooks/useFormDebouncedSubmit";
import { contactMessages } from "./messages";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";

type AnonymousCustomerFormProps = Pick<SignInFormContainerProps, "onSectionChange">;

interface FormData {
  email: string;
}

export const GuestUserForm: React.FC<AnonymousCustomerFormProps> = ({ onSectionChange }) => {
  const { checkout } = useCheckout();
  const { locale } = useLocale();
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const { showErrors } = useAlerts("checkoutEmailUpdate");
  const [createAccountSelected, setCreateAccountSelected] = useState(false);
  const formContext = useFormContext();
  const {
    getValues: getContextValues,
    setValue: setContextValue,
    formState: contextFormState,
    trigger: triggerContext,
  } = formContext;

  const [{ fetching: updatingEmail }, updateEmail] = useCheckoutEmailUpdateMutation();

  const schema = object({
    email: string().email(errorMessages.invalid).required(errorMessages.required),
  });

  const defaultValues = { email: getContextValues("email") };

  const resolver = useValidationResolver(schema);
  const formProps = useForm<FormData>({
    resolver,
    mode: "onChange",
    defaultValues,
  });

  const { watch, setError, trigger, getValues } = formProps;

  useCheckoutFormValidationTrigger(trigger);
  useCheckoutFormValidationTrigger(triggerContext);

  const getInputProps = useGetInputProps(formProps);
  const getContextInputProps = useGetInputProps(formContext);

  useSetFormErrors({
    setError: setError,
    errors: contextFormState.errors,
  });

  useCheckoutUpdateStateTrigger("checkoutEmailUpdate", updatingEmail);

  const emailValue = watch("email");

  useEffect(() => setContextValue("email", emailValue), [emailValue, setContextValue]);

  useEffect(
    () => setContextValue("createAccount", createAccountSelected),
    [createAccountSelected, setContextValue]
  );

  const onSubmit = useCallback(
    async ({ email }: FormData) => {
      const isValid = await trigger();

      if (!email || !isValid) {
        return;
      }

      const result = await updateEmail({
        languageCode: localeToLanguageCode(locale),
        email,
        checkoutId: checkout.id,
      });

      const [hasErrors, errors] = extractMutationErrors<FormData>(result);

      if (hasErrors) {
        showErrors(errors);
      }
    },
    [trigger, updateEmail, locale, checkout.id, showErrors]
  );

  const debouncedSubmit = useFormDebouncedSubmit<FormData>({
    onSubmit,
    getValues,
    defaultFormData: defaultValues,
  });

  return (
    <SignInFormContainer
      title={formatMessage(contactMessages.contact)}
      redirectSubtitle={formatMessage(contactMessages.haveAccount)}
      redirectButtonLabel={formatMessage(contactMessages.signIn)}
      onSectionChange={onSectionChange}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <TextInput
          label={formatMessage(contactMessages.email)}
          {...getInputProps("email", {
            onChange: debouncedSubmit,
          })}
        />
        <Checkbox
          classNames={{ container: "!mb-0" }}
          value="createAccount"
          label={formatMessage(contactMessages.wantToCreateAccount)}
          checked={createAccountSelected}
          onChange={setCreateAccountSelected}
        />
        {createAccountSelected && (
          <div className="mt-2">
            <PasswordInput
              label={formatMessage(contactMessages.password)}
              {...getContextInputProps("password")}
            />
          </div>
        )}
      </form>
    </SignInFormContainer>
  );
};
