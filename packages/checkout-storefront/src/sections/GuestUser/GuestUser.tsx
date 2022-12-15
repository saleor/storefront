import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { PasswordInput } from "@/checkout-storefront/components/PasswordInput";
import { SignInFormContainer, SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { Checkbox } from "@/checkout-storefront/components/Checkbox";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { contactMessages } from "../Contact/messages";
import { useGuestUserForm } from "@/checkout-storefront/sections/Contact/useGuestUserForm";
import { useCheckoutEmailUpdate } from "@/checkout-storefront/sections/GuestUser/useCheckoutEmailUpdate";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";

type GuestUserProps = Pick<SignInFormContainerProps, "onSectionChange">;

export const GuestUser: React.FC<GuestUserProps> = ({ onSectionChange }) => {
  const formatMessage = useFormattedMessages();
  const form = useGuestUserForm();
  const { createAccount, email } = form.values;

  useCheckoutEmailUpdate({ email });

  return (
    <SignInFormContainer
      title={formatMessage(contactMessages.contact)}
      redirectSubtitle={formatMessage(contactMessages.haveAccount)}
      redirectButtonLabel={formatMessage(contactMessages.signIn)}
      onSectionChange={onSectionChange}
    >
      <FormProvider value={form}>
        <TextInput name="email" label={formatMessage(contactMessages.email)} />
        <Checkbox
          name="createAccount"
          label={formatMessage(contactMessages.wantToCreateAccount)}
          data-testid={"createAccountCheckbox"}
          classNames={{ container: "!mb-0" }}
        />
        {createAccount && (
          <div className="mt-2">
            <PasswordInput name="password" label={formatMessage(contactMessages.password)} />
          </div>
        )}
      </FormProvider>
    </SignInFormContainer>
  );
};
