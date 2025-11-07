import { useEffect, useState, useMemo } from "react";
import { bool, object, type Schema, string } from "yup";
import { useUserRegisterMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import {
	useCheckoutUpdateStateActions,
	useCheckoutUpdateStateChange,
	useUserRegisterState,
} from "@/checkout/state/updateStateStore";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { type ChangeHandler, hasErrors, useForm } from "@/checkout/hooks/useForm";
import { useCheckoutEmailUpdate } from "@/checkout/sections/GuestUser/useCheckoutEmailUpdate";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useUser } from "@/checkout/hooks/useUser";
import { isValidEmail } from "@/checkout/lib/utils/common";
import { useHasCortexProducts } from "@/checkout/hooks/useHasCortexProducts";
import { useCortexDataStore } from "@/checkout/state/cortexDataStore";

export interface GuestUserFormData {
	email: string;
	password: string;
	createAccount: boolean;
	cortexCloudUsername: string;
	cortexFollowConfirmed: boolean;
}

interface GuestUserFormProps {
	// shared between sign in form and guest user form
	initialEmail: string;
}

export const useGuestUserForm = ({ initialEmail }: GuestUserFormProps) => {
	const { checkout } = useCheckout();
	const { user } = useUser();
	const shouldUserRegister = useUserRegisterState();
	const { setShouldRegisterUser, setSubmitInProgress } = useCheckoutUpdateStateActions();
	const { errorMessages } = useErrorMessages();
	const { setCheckoutUpdateState: setRegisterState } = useCheckoutUpdateStateChange("userRegister");
	const [, userRegister] = useUserRegisterMutation();
	const [userRegisterDisabled, setUserRegistrationDisabled] = useState(false);
	const { setCheckoutUpdateState } = useCheckoutUpdateStateChange("checkoutEmailUpdate");
	const hasCortexProducts = useHasCortexProducts();
	const { cortexData } = useCortexDataStore();

	const validationSchema = useMemo(() => object({
		createAccount: bool(),
		email: string().email(errorMessages.invalid).required(errorMessages.required),
		password: string().when(["createAccount"], ([createAccount], field) =>
			createAccount ? field.min(8, "Password must be at least 8 characters").required() : field,
		),
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
	}) as Schema<GuestUserFormData>, [errorMessages.invalid, errorMessages.required, hasCortexProducts]);

	const defaultFormData: GuestUserFormData = {
		email: initialEmail || checkout.email || "",
		password: "",
		createAccount: false,
		// Initialize Cortex fields from persisted store to maintain values on page reload
		cortexCloudUsername: cortexData?.cortexCloudUsername || "",
		cortexFollowConfirmed: cortexData?.cortexFollowConfirmed || false,
	};

	const onSubmit = useFormSubmit<GuestUserFormData, typeof userRegister>(
		useMemo(
			() => ({
				scope: "userRegister",
				onSubmit: userRegister,
				onStart: () => setShouldRegisterUser(false),
				shouldAbort: ({ formData, formHelpers: { validateForm } }) => {
					const errors = validateForm(formData);
					return hasErrors(errors);
				},
				parse: ({ email, password, channel }) => {
					// Build the confirmation URL that works regardless of checkout status
					const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
					const confirmUrl = `${baseUrl}/default-channel/confirm-account`;
					return {
						input: {
							email,
							password,
							channel,
							redirectUrl: confirmUrl,
						},
					};
				},
				onError: ({ errors }) => {
					setSubmitInProgress(false);
					const hasAccountForCurrentEmail = errors.some(({ code }) => code === "UNIQUE");

					if (hasAccountForCurrentEmail) {
						setUserRegistrationDisabled(true);
						// @todo this logic will be removed once new register flow is implemented
						setTimeout(() => setRegisterState("success"), 100);
					}
				},
				onSuccess: () => setUserRegistrationDisabled(true),
			}),
			[setRegisterState, setShouldRegisterUser, setSubmitInProgress, userRegister],
		),
	);

	const form = useForm<GuestUserFormData>({
		initialValues: defaultFormData,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: false,
		initialTouched: { email: true },
	});

	const {
		values: { email, createAccount, cortexCloudUsername, cortexFollowConfirmed },
		handleSubmit,
		handleChange,
	} = form;

	const { setCortexData } = useCortexDataStore();

	// Update Cortex data in store whenever it changes
	useEffect(() => {
		if (hasCortexProducts) {
			setCortexData({ cortexCloudUsername, cortexFollowConfirmed });
		}
	}, [cortexCloudUsername, cortexFollowConfirmed, hasCortexProducts, setCortexData]);

	useCheckoutFormValidationTrigger({
		scope: "guestUser",
		form,
	});

	useEffect(() => {
		setUserRegistrationDisabled(false);
	}, [email]);

	useEffect(() => {
		if (!shouldUserRegister || user || !createAccount || userRegisterDisabled) {
			return;
		}

		void handleSubmit();
	}, [createAccount, handleSubmit, shouldUserRegister, user, userRegisterDisabled]);

	useCheckoutEmailUpdate({ email });

	// since we use debounced submit, set update
	// state as "loading" right away
	const onChange: ChangeHandler = async (event) => {
		handleChange(event);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const error = await isValidEmail(event.target.value as string);

		if (!error) {
			setCheckoutUpdateState("loading");
		}
	};

	return { ...form, handleChange: onChange };
};
