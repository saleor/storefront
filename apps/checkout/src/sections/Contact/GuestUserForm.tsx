import { useCheckoutEmailUpdateMutation } from "@/graphql";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { getDataWithToken, useValidationResolver } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/Checkbox";
import { TextInput } from "@/components/TextInput";
import { PasswordInput } from "@/components/PasswordInput";
import {
  SignInFormContainer,
  SignInFormContainerProps,
} from "./SignInFormContainer";
import { object, string } from "yup";
import { useForm, useFormContext } from "react-hook-form";
import { useGetInputProps } from "@/hooks/useGetInputProps";
import { useErrorMessages } from "@/hooks/useErrorMessages";

interface AnonymousCustomerFormProps
  extends Pick<SignInFormContainerProps, "onSectionChange"> {
  onEmailChange: (value: string) => void;
  defaultValues: Partial<FormData>;
}

interface FormData {
  email: string;
}

export const GuestUserForm: React.FC<AnonymousCustomerFormProps> = ({
  onSectionChange,
  onEmailChange,
  defaultValues,
}) => {
  const formatMessage = useFormattedMessages();
  const errorMessages = useErrorMessages();
  const [createAccountSelected, setCreateAccountSelected] = useState(false);

  const schema = object({
    email: string()
      .email(errorMessages.invalidValue)
      .required(errorMessages.requiredField),
  });

  const resolver = useValidationResolver(schema);
  const contextFormProps = useFormContext();
  const { handleSubmit, watch, getValues, ...rest } = useForm<FormData>({
    resolver,
    mode: "onBlur",
    defaultValues,
  });
  const getInputProps = useGetInputProps(rest);
  const getContextInputProps = useGetInputProps(contextFormProps);

  const [, updateEmail] = useCheckoutEmailUpdateMutation();

  const onSubmit = ({ email }: FormData) =>
    updateEmail(getDataWithToken({ email }));

  const emailValue = watch("email");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onEmailChange(emailValue), [emailValue]);

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
