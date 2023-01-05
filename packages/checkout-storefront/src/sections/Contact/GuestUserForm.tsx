import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { SignInFormContainer, SignInFormContainerProps } from "./SignInFormContainer";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { Checkbox } from "@/checkout-storefront/components/Checkbox";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useFormDebouncedSubmit } from "@/checkout-storefront/hooks/useFormDebouncedSubmit";
import { contactMessages } from "./messages";
import {
  GuestUserFormData,
  useGuestUserForm,
} from "@/checkout-storefront/sections/Contact/useGuestUserForm";
import { useState } from "react";

type AnonymousCustomerFormProps = Pick<SignInFormContainerProps, "onSectionChange">;

export const GuestUserForm: React.FC<AnonymousCustomerFormProps> = ({ onSectionChange }) => {
  const formatMessage = useFormattedMessages();
  const [createAccountSelected, setCreateAccountSelected] = useState(false);
  const { formProps, onCheckoutEmailUpdate, defaultFormData } = useGuestUserForm({
    createAccount: createAccountSelected,
  });

  const { getValues } = formProps;

  const getInputProps = useGetInputProps(formProps);

  const debouncedSubmit = useFormDebouncedSubmit<GuestUserFormData>({
    onSubmit: onCheckoutEmailUpdate,
    getValues,
    defaultFormData,
  });

  return (
    <SignInFormContainer
      title={formatMessage(contactMessages.contact)}
      redirectSubtitle={formatMessage(contactMessages.haveAccount)}
      redirectButtonLabel={formatMessage(contactMessages.signIn)}
      onSectionChange={onSectionChange}
    >
      <form method="post" onSubmit={(e) => e.preventDefault()}>
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
          data-testid={"createAccountCheckbox"}
        />
        {createAccountSelected && (
          <div className="mt-2">
            <PasswordInput
              label={formatMessage(contactMessages.password)}
              {...getInputProps("password")}
            />
          </div>
        )}
      </form>
    </SignInFormContainer>
  );
};
