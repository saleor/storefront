import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";
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
	const form = useGuestUserForm({ initialEmail });
	const { handleChange } = form;
	const { createAccount } = form.values;

	return (
		<SignInFormContainer
			title="Contact details"
			redirectSubtitle="Already have an account?"
			redirectButtonLabel="Sign in"
			onSectionChange={onSectionChange}
		>
			<FormProvider form={form}>
				<div className="grid grid-cols-1 gap-2">
					<TextInput
						required
						name="email"
						label="Email"
						onChange={(event) => {
							handleChange(event);
							onEmailChange(event.currentTarget.value);
						}}
					/>
					<Checkbox
						name="createAccount"
						label="I want to create account"
						data-testid={"createAccountCheckbox"}
					/>
					{createAccount && (
						<div className="mt-2">
							<PasswordInput name="password" label="Password (minimum 8 characters)" />
						</div>
					)}
				</div>
			</FormProvider>
		</SignInFormContainer>
	);
};
