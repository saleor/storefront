"use client";

import { useState, useEffect, useCallback, type FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/ui/components/ui/Button";
import { ExpressCheckout } from "@/checkout/components/ExpressCheckout";
import {
	type CheckoutFragment,
	type CountryCode,
	useCheckoutEmailUpdateMutation,
	useCheckoutShippingAddressUpdateMutation,
	useUserRegisterMutation,
} from "@/checkout/graphql";
import { useAvailableShippingCountries } from "@/checkout/hooks/useAvailableShippingCountries";
import { useAddressFormUtils } from "@/checkout/components/AddressForm/useAddressFormUtils";
import {
	getAddressInputData,
	getAddressInputDataFromAddress,
	isMatchingAddressData,
} from "@/checkout/components/AddressForm/utils";
import { useUser } from "@/checkout/hooks/useUser";
import { getQueryParams, createQueryString } from "@/checkout/lib/utils/url";
import { localeConfig } from "@/config/locale";
import { getStepNumber } from "./flow";

// Extracted components
import { SignInForm, ResetPasswordForm } from "@/checkout/components/contact";
import { ContactSection, ShippingAddressSection } from "./sections";
import { MobileStickyAction } from "./MobileStickyAction";

// =============================================================================
// Types
// =============================================================================

type ContactView = "main" | "signIn" | "resetPassword";

interface InformationStepProps {
	checkout: CheckoutFragment;
	onNext: () => void;
}

// =============================================================================
// Main Component
// =============================================================================

export const InformationStep: FC<InformationStepProps> = ({ checkout, onNext }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user, authenticated } = useUser();
	const { availableShippingCountries } = useAvailableShippingCountries();
	const shippingAddress = checkout.shippingAddress;

	// Default country: use checkout's address, or first available country from channel
	const defaultCountry =
		(shippingAddress?.country?.code as CountryCode) || availableShippingCountries[0] || ("US" as CountryCode);

	// Mutations
	const [, updateEmail] = useCheckoutEmailUpdateMutation();
	const [, updateShippingAddress] = useCheckoutShippingAddressUpdateMutation();
	const [, userRegister] = useUserRegisterMutation();

	// View state - what sub-view are we showing?
	const [contactView, setContactView] = useState<ContactView>(() => {
		const { passwordResetToken } = getQueryParams(searchParams);
		if (passwordResetToken) return "resetPassword";
		return "main";
	});

	// ----- Contact form state -----
	const [email, setEmail] = useState(checkout.email || "");
	const [createAccount, setCreateAccount] = useState(false);
	const [accountPassword, setAccountPassword] = useState("");
	const [subscribeNews, setSubscribeNews] = useState(false);

	// ----- Address form state (for guests/new address) -----
	const [countryCode, setCountryCode] = useState<CountryCode>(defaultCountry);
	const [formData, setFormData] = useState<Record<string, string>>(() => ({
		firstName: shippingAddress?.firstName || "",
		lastName: shippingAddress?.lastName || "",
		streetAddress1: shippingAddress?.streetAddress1 || "",
		streetAddress2: shippingAddress?.streetAddress2 || "",
		companyName: shippingAddress?.companyName || "",
		city: shippingAddress?.city || "",
		postalCode: shippingAddress?.postalCode || "",
		countryArea: shippingAddress?.countryArea || "",
		cityArea: shippingAddress?.cityArea || "",
		phone: shippingAddress?.phone || "",
	}));

	// ----- Address selection state (for logged-in users) -----
	// Check if checkout's shipping address matches any saved address
	const findMatchingAddressId = (): string | null => {
		if (!shippingAddress || !user?.addresses?.length) return null;
		const match = user.addresses.find((addr) => isMatchingAddressData(addr, shippingAddress));
		return match?.id || null;
	};

	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
		// First, check if checkout's address matches a saved address
		const matchingId = findMatchingAddressId();
		if (matchingId) return matchingId;
		// Otherwise, use defaults
		if (user?.defaultShippingAddress?.id) return user.defaultShippingAddress.id;
		if (user?.addresses?.[0]?.id) return user.addresses[0].id;
		return null;
	});

	// If checkout has an address that doesn't match any saved address, show the form
	const [showNewAddressForm, setShowNewAddressForm] = useState(() => {
		if (!shippingAddress) return false;
		if (!user?.addresses?.length) return false;
		// If there's a shipping address but it doesn't match any saved address, show the form
		const matchingId = findMatchingAddressId();
		return !matchingId && Boolean(shippingAddress.streetAddress1);
	});

	// Sync local state with checkout data when it updates (e.g. after auto-login)
	useEffect(() => {
		if (checkout.email) {
			setEmail(checkout.email);
		}
	}, [checkout.email]);

	// Sync form data with checkout's shipping address - but only when NOT entering a new address
	useEffect(() => {
		if (shippingAddress && !showNewAddressForm) {
			setCountryCode((shippingAddress.country?.code as CountryCode) || defaultCountry);
			setFormData({
				firstName: shippingAddress.firstName || "",
				lastName: shippingAddress.lastName || "",
				streetAddress1: shippingAddress.streetAddress1 || "",
				streetAddress2: shippingAddress.streetAddress2 || "",
				companyName: shippingAddress.companyName || "",
				city: shippingAddress.city || "",
				postalCode: shippingAddress.postalCode || "",
				countryArea: shippingAddress.countryArea || "",
				cityArea: shippingAddress.cityArea || "",
				phone: shippingAddress.phone || "",
			});
		}
	}, [shippingAddress, showNewAddressForm]);

	// Update selected address when user data loads
	useEffect(() => {
		if (user && !selectedAddressId && !showNewAddressForm) {
			// First check if checkout's address matches a saved address
			if (shippingAddress && user.addresses?.length) {
				const match = user.addresses.find((addr) => isMatchingAddressData(addr, shippingAddress));
				if (match) {
					setSelectedAddressId(match.id);
					return;
				}
				// If shipping address exists but doesn't match, show form
				if (shippingAddress.streetAddress1) {
					setShowNewAddressForm(true);
					return;
				}
			}
			// Fall back to defaults
			if (user.defaultShippingAddress?.id) {
				setSelectedAddressId(user.defaultShippingAddress.id);
			} else if (user.addresses?.[0]?.id) {
				setSelectedAddressId(user.addresses[0].id);
			}
		}
	}, [user, selectedAddressId, showNewAddressForm, shippingAddress]);

	// ----- Validation & Errors -----
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Country-specific address configuration
	const { orderedAddressFields, getFieldLabel, isRequiredField, countryAreaChoices } =
		useAddressFormUtils(countryCode);

	// ----- Event Handlers -----
	const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

	const handleEmailChange = (value: string) => {
		setEmail(value);
		if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
	};

	const handleEmailBlur = () => {
		if (email && !validateEmail(email)) {
			setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
		}
	};

	const handleFieldChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const handleCountryChange = (value: string) => {
		setCountryCode(value as CountryCode);
		setFormData((prev) => ({ ...prev, countryArea: "" }));
	};

	const handleShowNewAddressForm = (show: boolean) => {
		setShowNewAddressForm(show);
		if (show) {
			// Clear form for new address entry
			setFormData({
				firstName: "",
				lastName: "",
				streetAddress1: "",
				streetAddress2: "",
				companyName: "",
				city: "",
				postalCode: "",
				countryArea: "",
				cityArea: "",
				phone: "",
			});
			setErrors({});
		} else {
			// Going back to saved addresses - restore from checkout if available
			if (shippingAddress) {
				setCountryCode((shippingAddress.country?.code as CountryCode) || defaultCountry);
				setFormData({
					firstName: shippingAddress.firstName || "",
					lastName: shippingAddress.lastName || "",
					streetAddress1: shippingAddress.streetAddress1 || "",
					streetAddress2: shippingAddress.streetAddress2 || "",
					companyName: shippingAddress.companyName || "",
					city: shippingAddress.city || "",
					postalCode: shippingAddress.postalCode || "",
					countryArea: shippingAddress.countryArea || "",
					cityArea: shippingAddress.cityArea || "",
					phone: shippingAddress.phone || "",
				});
			}
			setErrors({});
		}
	};

	// ----- Submit Logic -----
	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			if (event) {
				event.preventDefault();
			}

			const newErrors: Record<string, string> = {};

			// Validate email (guests only)
			if (!authenticated) {
				if (!email) newErrors.email = "Email is required";
				else if (!validateEmail(email)) newErrors.email = "Please enter a valid email";

				if (createAccount) {
					if (!accountPassword) newErrors.password = "Password is required";
					else if (accountPassword.length < 8) newErrors.password = "Password must be at least 8 characters";
				}
			}

			// Validate shipping address (if required)
			if (checkout.isShippingRequired) {
				if (authenticated && user?.addresses?.length && !showNewAddressForm) {
					if (!selectedAddressId) {
						newErrors.address = "Please select a shipping address";
					}
				} else {
					orderedAddressFields.forEach((field) => {
						if (isRequiredField(field) && !formData[field]) {
							newErrors[field] = `${getFieldLabel(field)} is required`;
						}
					});
				}
			}

			setErrors(newErrors);
			if (Object.keys(newErrors).length > 0) {
				// Focus the first invalid field
				const firstErrorField = Object.keys(newErrors)[0];
				const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
				element?.focus();
				return;
			}

			// ----- Save to Saleor -----
			setIsSubmitting(true);
			try {
				// Update email (guests)
				if (!authenticated) {
					const emailResult = await updateEmail({
						checkoutId: checkout.id,
						email,
						languageCode: localeConfig.graphqlLanguageCode,
					});
					if (emailResult.error) {
						setErrors({ email: "Failed to update email" });
						return;
					}
					const emailErrors = emailResult.data?.checkoutEmailUpdate?.errors;
					if (emailErrors?.length) {
						const errorMap: Record<string, string> = {};
						emailErrors.forEach((err) => {
							errorMap[err.field || "email"] = err.message || "Invalid value";
						});
						setErrors(errorMap);
						return;
					}

					// Create account if requested
					if (createAccount && accountPassword) {
						const registerResult = await userRegister({
							input: {
								email,
								password: accountPassword,
								channel: checkout.channel.slug,
								redirectUrl: window.location.href,
							},
						});
						if (registerResult.data?.accountRegister?.errors?.length) {
							const err = registerResult.data.accountRegister.errors[0];
							if (err.code !== "UNIQUE") {
								setErrors({ password: err.message || "Failed to create account" });
								return;
							}
						}
					}
				}

				// Update shipping address
				if (checkout.isShippingRequired) {
					let addressInput;
					if (authenticated && user?.addresses?.length && selectedAddressId && !showNewAddressForm) {
						const selectedAddress = user.addresses.find((a) => a.id === selectedAddressId);
						if (selectedAddress) {
							addressInput = getAddressInputDataFromAddress(selectedAddress);
						}
					} else {
						addressInput = getAddressInputData({ ...formData, countryCode });
					}

					if (addressInput) {
						const addressResult = await updateShippingAddress({
							checkoutId: checkout.id,
							shippingAddress: addressInput,
							languageCode: localeConfig.graphqlLanguageCode,
						});

						if (addressResult.error) {
							setErrors({ streetAddress1: "Failed to update address" });
							return;
						}
						const addressErrors = addressResult.data?.checkoutShippingAddressUpdate?.errors;
						if (addressErrors?.length) {
							const errorMap: Record<string, string> = {};
							addressErrors.forEach((err) => {
								const field = err.field || "streetAddress1";
								errorMap[field] = err.message || "Invalid value";
							});
							setErrors(errorMap);
							return;
						}
					}
				}

				onNext();
			} finally {
				setIsSubmitting(false);
			}
		},
		[
			authenticated,
			email,
			createAccount,
			accountPassword,
			checkout.isShippingRequired,
			checkout.id,
			checkout.channel.slug,
			user?.addresses,
			showNewAddressForm,
			selectedAddressId,
			orderedAddressFields,
			isRequiredField,
			getFieldLabel,
			formData,
			countryCode,
			updateEmail,
			userRegister,
			updateShippingAddress,
			onNext,
		],
	);

	// ----- Render: Password Reset -----
	if (contactView === "resetPassword") {
		return (
			<div className="space-y-8">
				<ExpressCheckout />
				<ResetPasswordForm
					onSuccess={() => setContactView("main")}
					onBackToSignIn={() => {
						const newQuery = createQueryString(searchParams, {
							passwordResetToken: null,
							passwordResetEmail: null,
						});
						router.replace(`?${newQuery}`, { scroll: false });
						setContactView("signIn");
					}}
				/>
			</div>
		);
	}

	// ----- Render: Sign In -----
	if (contactView === "signIn") {
		return (
			<div className="space-y-8">
				<ExpressCheckout />
				<SignInForm
					initialEmail={email}
					channelSlug={checkout.channel.slug}
					onSuccess={() => setContactView("main")}
					onGuestCheckout={() => setContactView("main")}
				/>
			</div>
		);
	}

	// ----- Render: Main Form -----
	const buttonText = isSubmitting
		? "Saving..."
		: checkout.isShippingRequired
			? "Continue to shipping"
			: "Continue to payment";

	return (
		<form className="space-y-8" onSubmit={handleSubmit} noValidate>
			<ExpressCheckout />

			<ContactSection
				isSignedIn={authenticated}
				user={user}
				onSignOut={() => {}} // User signs out via header
				onSignInClick={() => setContactView("signIn")}
				email={email}
				onEmailChange={handleEmailChange}
				onEmailBlur={handleEmailBlur}
				emailError={errors.email}
				createAccount={createAccount}
				onCreateAccountChange={setCreateAccount}
				password={accountPassword}
				onPasswordChange={setAccountPassword}
				passwordError={errors.password}
				subscribeNews={subscribeNews}
				onSubscribeChange={setSubscribeNews}
			/>

			{checkout.isShippingRequired && (
				<ShippingAddressSection
					isAuthenticated={authenticated}
					userAddresses={user?.addresses || []}
					defaultAddressId={user?.defaultShippingAddress?.id}
					selectedAddressId={selectedAddressId}
					onSelectAddress={setSelectedAddressId}
					showNewAddressForm={showNewAddressForm}
					onShowNewAddressForm={handleShowNewAddressForm}
					countryCode={countryCode}
					onCountryChange={handleCountryChange}
					availableCountries={availableShippingCountries}
					formData={formData}
					onFieldChange={handleFieldChange}
					errors={errors}
					orderedAddressFields={orderedAddressFields}
					getFieldLabel={getFieldLabel}
					isRequiredField={isRequiredField}
					countryAreaChoices={countryAreaChoices}
				/>
			)}

			<Button
				type="submit"
				disabled={isSubmitting}
				className="hidden h-14 w-full text-base font-semibold md:flex"
			>
				{buttonText}
			</Button>

			<MobileStickyAction
				step={getStepNumber("INFO", checkout.isShippingRequired)}
				isShippingRequired={checkout.isShippingRequired}
				type="submit"
				onAction={handleSubmit}
				isLoading={isSubmitting}
				loadingText="Saving..."
			/>
		</form>
	);
};
