import { useCheckoutEmailUpdateMutation } from "@/checkout/graphql";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { useValidationResolver } from "@/checkout/lib/utils";
import React, { useEffect, useState } from "react";
import { PasswordInput } from "@/checkout/components/PasswordInput";
import {
  SignInFormContainer,
  SignInFormContainerProps,
} from "./SignInFormContainer";
import { object, string } from "yup";
import { useForm, useFormContext } from "react-hook-form";
import { useGetInputProps } from "@/checkout/hooks/useGetInputProps";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { Checkbox } from "@/checkout/components/Checkbox";
import { TextInput } from "@/checkout/components/TextInput";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useSetFormErrors } from "@/checkout/providers/ErrorsProvider/useSetFormErrors";

type AnonymousCustomerFormProps = Pick<
  SignInFormContainerProps,
  "onSectionChange"
>;

interface FormData {
  email: string;
}

export const GuestUserForm: React.FC<AnonymousCustomerFormProps> = ({
  onSectionChange,
}) => {
  const { checkout } = useCheckout();
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const [createAccountSelected, setCreateAccountSelected] = useState(false);
  const {
    getValues: getContextValues,
    setValue: setContextValue,
    setError: setContextError,
    ...contextPropsRest
  } = useFormContext();

  useSetFormErrors({ errorScope: "userRegister", setError: setContextError });

  const schema = object({
    email: string()
      .email(errorMessages.invalidValue)
      .required(errorMessages.requiredValue),
  });

  const resolver = useValidationResolver(schema);
  const { handleSubmit, watch, getValues, ...rest } = useForm<FormData>({
    resolver,
    mode: "onBlur",
    defaultValues: { email: getContextValues("email") },
  });

  const getInputProps = useGetInputProps(rest);
  const getContextInputProps = useGetInputProps(contextPropsRest);

  const [, updateEmail] = useCheckoutEmailUpdateMutation();

  const onSubmit = ({ email }: FormData) =>
    updateEmail({ id: checkout.id, email });

  const emailValue = watch("email");

  useEffect(() => setContextValue("email", emailValue), [emailValue]);

  useEffect(
    () => setContextValue("createAccount", createAccountSelected),
    [createAccountSelected]
  );

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
          onBlur: () => onSubmit(getValues()),
        })}
      />
      <Checkbox
        value="createAccount"
        label={formatMessage("wantToCreateAccountLabel")}
        checked={createAccountSelected}
        onChange={setCreateAccountSelected}
      />
      {createAccountSelected && (
        <PasswordInput
          label={formatMessage("passwordLabel")}
          {...getContextInputProps("password")}
        />
      )}
    </SignInFormContainer>
  );
};
