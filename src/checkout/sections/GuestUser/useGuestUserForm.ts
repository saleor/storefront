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
import { getCurrentHref } from "@/checkout/lib/utils/locale";
import { useCheckoutEmailUpdate } from "@/checkout/sections/GuestUser/useCheckoutEmailUpdate";
import { useErrorMessages } from "@/checkout/hooks/useErrorMessages";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { passwordMessages } from "@/checkout/sections/SignIn/messages";
import { useUser } from "@/checkout/hooks/useUser";
import { isValidEmail } from "@/checkout/lib/utils/common";

export interface GuestUserFormData {
	email: string;
	password: string;
	createAccount: boolean;
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
	const formatMessage = useFormattedMessages();
	const { setCheckoutUpdateState: setRegisterState } = useCheckoutUpdateStateChange("userRegister");
	const [, userRegister] = useUserRegisterMutation();
	const [userRegisterDisabled, setUserRegistrationDisabled] = useState(false);
	const { setCheckoutUpdateState } = useCheckoutUpdateStateChange("checkoutEmailUpdate");

	const validationSchema = object({
		createAccount: bool(),
		email: string().email(errorMessages.invalid).required(errorMessages.required),
		password: string().when(["createAccount"], ([createAccount], field) =>
			createAccount
				? field.min(8, formatMessage(passwordMessages.passwordAtLeastCharacters)).required()
				: field,
		),
	}) as Schema<GuestUserFormData>;

	const defaultFormData: GuestUserFormData = {
		email: initialEmail || checkout.email || "",
		password: "",
		createAccount: false,
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
				parse: ({ email, password, channel }) => ({
					input: {
						email,
						password,
						channel,
						redirectUrl: getCurrentHref(),
					},
				}),
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
		values: { email, createAccount },
		handleSubmit,
		handleChange,
	} = form;

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
