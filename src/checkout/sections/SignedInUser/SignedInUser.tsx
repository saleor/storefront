import { type FC, useEffect } from "react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { SignInFormContainer, type SignInFormContainerProps } from "../Contact/SignInFormContainer";
import { Button } from "@/checkout/components/Button";
import { TextInput } from "@/checkout/components/TextInput";
import { Checkbox } from "@/checkout/components/Checkbox";
import { useUser } from "@/checkout/hooks/useUser";
import { useHasCortexProducts } from "@/checkout/hooks/useHasCortexProducts";
import { useCortexDataStore } from "@/checkout/state/cortexDataStore";
import { useForm, FormProvider } from "@/checkout/hooks/useForm";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { object, string, bool, type Schema } from "yup";
import { useMemo } from "react";

interface SignedInUserProps extends Pick<SignInFormContainerProps, "onSectionChange"> {
	onSignOutSuccess: () => void;
}

interface SignedInUserCortexFormData {
	cortexCloudUsername: string;
	cortexFollowConfirmed: boolean;
}

export const SignedInUser: FC<SignedInUserProps> = ({ onSectionChange, onSignOutSuccess }) => {
	const { signOut } = useSaleorAuthContext();
	const { user } = useUser();
	const hasCortexProducts = useHasCortexProducts();
	const { cortexData, setCortexData } = useCortexDataStore();

	const validationSchema = useMemo(
		() =>
			object({
				cortexCloudUsername: string().test(
					"cortex-username-required",
					"Cortex Cloud username is required for Cortex products",
					function (value) {
						if (!hasCortexProducts) return true;
						return !!value && value.length > 0;
					}
				),
				cortexFollowConfirmed: bool().test(
					"cortex-follow-required",
					"You must confirm that you follow GuitarJonSDS on Cortex Cloud",
					function (value) {
						if (!hasCortexProducts) return true;
						return value === true;
					}
				),
			}) as Schema<SignedInUserCortexFormData>,
		[hasCortexProducts]
	);

	const form = useForm<SignedInUserCortexFormData>({
		initialValues: {
			cortexCloudUsername: cortexData?.cortexCloudUsername || "",
			cortexFollowConfirmed: cortexData?.cortexFollowConfirmed || false,
		},
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		onSubmit: async () => {}, // No submit needed, just validation
	});

	const {
		values: { cortexCloudUsername, cortexFollowConfirmed },
	} = form;

	// Update Cortex data in store whenever it changes
	useEffect(() => {
		if (hasCortexProducts) {
			setCortexData({ cortexCloudUsername, cortexFollowConfirmed });
		}
	}, [cortexCloudUsername, cortexFollowConfirmed, hasCortexProducts, setCortexData]);

	// Register form validation trigger (only if Cortex products exist)
	useCheckoutFormValidationTrigger({
		scope: "guestUser", // Reuse the same scope since it's the contact/user section
		form,
		skip: !hasCortexProducts, // Skip validation if no Cortex products
	});

	const handleLogout = async () => {
		signOut();
		onSignOutSuccess();
	};

	return (
		<SignInFormContainer title="Account" onSectionChange={onSectionChange}>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between items-center">
					<p className="text-base font-bold">{user?.email}</p>
					<Button ariaLabel="Sign out" variant="tertiary" onClick={handleLogout} label="Sign out" />
				</div>

				{hasCortexProducts && (
					<FormProvider form={form}>
						<div className="grid grid-cols-1 gap-3 mt-2 pt-4 border-t border-neutral-700">
							<p className="text-sm text-neutral-400 mb-1">
								Cortex Cloud information required for your purchase
							</p>
							<TextInput
								required
								name="cortexCloudUsername"
								label="Cortex Cloud Username"
								data-testid="cortexCloudUsernameInput"
							/>
							<Checkbox
								name="cortexFollowConfirmed"
								label="I confirm that I follow GuitarJonSDS on Cortex Cloud"
								data-testid="cortexFollowConfirmedCheckbox"
							/>
						</div>
					</FormProvider>
				)}
			</div>
		</SignInFormContainer>
	);
};

