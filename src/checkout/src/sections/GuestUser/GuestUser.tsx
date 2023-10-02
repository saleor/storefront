import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { contactMessages } from "../Contact/messages";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { PasswordInput } from "@/checkout/src/components/PasswordInput";
import { Checkbox } from "@/checkout/src/components/Checkbox";
import { TextInput } from "@/checkout/src/components/TextInput";
import { useGuestUserForm } from "@/checkout/src/sections/GuestUser/useGuestUserForm";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";

type GuestUserProps = Pick<SignInFormContainerProps, "onSectionChange"> & {
	onEmailChange: (email: string) => void;
	email: string;
};

export const GuestUser: React.FC<GuestUserProps> = ({
	onSectionChange,
	onEmailChange,
	email: initialEmail,
}) => {
	const formatMessage = useFormattedMessages();
	const form = useGuestUserForm({ initialEmail });
	const { handleChange } = form;
	const { createAccount } = form.values;

	return (
		<SignInFormContainer
			title={formatMessage(contactMessages.contact)}
			redirectSubtitle={formatMessage(contactMessages.haveAccount)}
			redirectButtonLabel={formatMessage(contactMessages.signIn)}
			onSectionChange={onSectionChange}
		>
			<FormProvider form={form}>
				<TextInput
					name="email"
					label={formatMessage(contactMessages.email)}
					onChange={(event) => {
						handleChange(event);
						onEmailChange(event.target.value);
					}}
				/>
				<Checkbox
					name="createAccount"
					label={formatMessage(contactMessages.wantToCreateAccount)}
					data-testid={"createAccountCheckbox"}
				/>
				{createAccount && (
					<div className="mt-2">
						<PasswordInput name="password" label={formatMessage(contactMessages.passwordWithRequirements)} />
					</div>
				)}
			</FormProvider>
		</SignInFormContainer>
	);
};
