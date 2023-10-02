import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { contactMessages } from "../Contact/messages";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { PasswordInput } from "@/checkout/components/PasswordInput";
import { Checkbox } from "@/checkout/components/Checkbox";
import { TextInput } from "@/checkout/components/TextInput";
import { useGuestUserForm } from "@/checkout/sections/GuestUser/useGuestUserForm";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";

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
				<div className="grid grid-cols-1 gap-2">
					<TextInput
						required
						name="email"
						label={formatMessage(contactMessages.email)}
						onChange={(event) => {
							handleChange(event);
							onEmailChange(event.currentTarget.value);
						}}
					/>
					<Checkbox
						name="createAccount"
						label={formatMessage(contactMessages.wantToCreateAccount)}
						data-testid={"createAccountCheckbox"}
					/>
					{createAccount && (
						<div className="mt-2">
							<PasswordInput
								name="password"
								label={formatMessage(contactMessages.passwordWithRequirements)}
							/>
						</div>
					)}
				</div>
			</FormProvider>
		</SignInFormContainer>
	);
};
