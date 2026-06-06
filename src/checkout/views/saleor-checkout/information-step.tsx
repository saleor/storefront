"use client";

/* eslint-disable react-hooks/preserve-manual-memoization -- large submit handler; refactor separately */

import { useState, useCallback, useEffect, type FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { syncAuthSurfacesAfterSignIn } from "@/lib/auth";
import { Button } from "@/ui/components/ui/button";
import { ExpressCheckout } from "@/checkout/components/express-checkout";
import {
	updateCheckoutEmail,
	updateCheckoutShippingAddress,
	registerCheckoutAccount,
} from "@/app/(checkout)/actions";
import { type CheckoutFragment, type CountryCode } from "@/checkout/graphql";
import type { CheckoutUser, ServerCheckout } from "@/checkout/lib/checkout-types";
import { checkoutLinesSignature } from "@/checkout/lib/checkout-sync";
import { useAvailableShippingCountries } from "@/checkout/hooks/use-available-shipping-countries";
import { useAddressFormUtils } from "@/checkout/components/address-form/use-address-form-utils";
import {
	getAddressInputData,
	getAddressInputDataFromAddress,
	isMatchingAddressData,
} from "@/checkout/components/address-form/utils";
import { useUser } from "@/checkout/hooks/use-user";
import { useOrphanedCheckoutRecovery } from "@/checkout/hooks/use-orphaned-checkout-recovery";
import { getQueryParams, createQueryString } from "@/checkout/lib/utils/url";
import {
	getCheckoutSaveAddressFlag,
	isUsingSavedShippingAddress,
} from "@/checkout/lib/shipping-address-submit";
import { getStepNumber } from "./flow";

// Extracted components
import { SignInForm, ResetPasswordForm } from "@/checkout/components/contact";
import { ContactSection, ShippingAddressSection } from "./sections";
import { MobileStickyAction } from "./mobile-sticky-action";

// =============================================================================
// Types
// =============================================================================

type ContactView = "main" | "signIn" | "resetPassword";

interface InformationStepProps {
	checkout: CheckoutFragment;
	onComplete: (checkout: ServerCheckout) => void;
}

interface InformationStepFormProps extends InformationStepProps {
	user: CheckoutUser | null;
	authenticated: boolean;
	userLoading: boolean;
	isAuthTransitionLoading: boolean;
	onAuthSessionPending: () => void;
}

// =============================================================================
// Main Component
// =============================================================================

export const InformationStep: FC<InformationStepProps> = (props) => {
	const { user, authenticated, loading: userLoading } = useUser();
	const [isAwaitingAuthRefresh, setIsAwaitingAuthRefresh] = useState(false);
	const linesKey = checkoutLinesSignature(props.checkout);
	const formKey = userLoading
		? `${props.checkout.id}:${linesKey}:loading`
		: `${props.checkout.id}:${linesKey}:${user?.id ?? "guest"}`;

	useEffect(() => {
		if (authenticated) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- clear sign-in transition once session is live
			setIsAwaitingAuthRefresh(false);
		}
	}, [authenticated]);

	const isAuthTransitionLoading = isAwaitingAuthRefresh && !authenticated;

	return (
		<InformationStepForm
			key={formKey}
			{...props}
			user={user}
			authenticated={authenticated}
			userLoading={userLoading}
			isAuthTransitionLoading={isAuthTransitionLoading}
			onAuthSessionPending={() => setIsAwaitingAuthRefresh(true)}
		/>
	);
};

const InformationStepForm: FC<InformationStepFormProps> = ({
	checkout,
	onComplete,
	user,
	authenticated,
	userLoading,
	isAuthTransitionLoading,
	onAuthSessionPending,
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const {
		isOrphaned,
		isRecovering,
		error: recoveryError,
		recoverAsGuest,
	} = useOrphanedCheckoutRecovery(checkout);
	const contactLoading = userLoading || isAuthTransitionLoading;
	const { availableShippingCountries } = useAvailableShippingCountries();
	const shippingAddress = checkout.shippingAddress;

	// Default country: use checkout's address, or first available country from channel
	const defaultCountry =
		(shippingAddress?.country?.code as CountryCode) || availableShippingCountries[0] || ("US" as CountryCode);

	// View state - what sub-view are we showing?
	const [contactView, setContactView] = useState<ContactView>(() => {
		const { passwordResetToken } = getQueryParams(searchParams);
		if (passwordResetToken) return "resetPassword";
		return "main";
	});

	// ----- Contact form state -----
	const [email, setEmail] = useState(() => (isOrphaned ? "" : checkout.email || ""));
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

	// Explicit flag: user is typing a new address (not picking a saved one)
	const [isEnteringNewAddress, setIsEnteringNewAddress] = useState(() => {
		if (!user?.addresses?.length) return true;
		if (!shippingAddress?.streetAddress1) return false;
		return !findMatchingAddressId();
	});

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

	const handleSelectAddress = (id: string | null) => {
		setSelectedAddressId(id);
		setIsEnteringNewAddress(false);
	};

	const handleShowNewAddressForm = (show: boolean) => {
		setShowNewAddressForm(show);
		setIsEnteringNewAddress(show);
		if (show) {
			setSelectedAddressId(null);
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

			if (isSubmitting) return;

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
				const usingSavedAddress = isUsingSavedShippingAddress({
					isAuthenticated: authenticated,
					savedAddressCount: user?.addresses?.length ?? 0,
					showNewAddressForm,
					isEnteringNewAddress,
					selectedAddressId,
				});

				if (usingSavedAddress) {
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

			if (isOrphaned) {
				setErrors({
					email: "This cart is still linked to a signed-in account. Continue as guest above, or log in.",
				});
				return;
			}

			setIsSubmitting(true);
			try {
				let updatedCheckout: ServerCheckout = checkout;

				if (!authenticated) {
					const emailResult = await updateCheckoutEmail(checkout.id, email);
					if (!emailResult.ok) {
						if (emailResult.fieldErrors?.length) {
							const errorMap: Record<string, string> = {};
							emailResult.fieldErrors.forEach((err) => {
								errorMap[err.field || "email"] = err.message || "Invalid value";
							});
							setErrors(errorMap);
						} else {
							setErrors({ email: emailResult.error ?? "Failed to update email" });
						}
						setIsSubmitting(false);
						return;
					}
					updatedCheckout = emailResult.checkout;

					if (createAccount && accountPassword) {
						const registerResult = await registerCheckoutAccount({
							email,
							password: accountPassword,
							channel: checkout.channel.slug,
							redirectUrl: window.location.href,
						});
						if (!registerResult.ok) {
							const fieldError = registerResult.fieldErrors?.[0];
							setErrors({
								password: fieldError?.message ?? registerResult.error ?? "Failed to create account",
							});
							setIsSubmitting(false);
							return;
						}
					}
				}

				if (checkout.isShippingRequired) {
					let addressInput;
					const usingSavedAddress = isUsingSavedShippingAddress({
						isAuthenticated: authenticated,
						savedAddressCount: user?.addresses?.length ?? 0,
						showNewAddressForm,
						isEnteringNewAddress,
						selectedAddressId,
					});
					const saveAddress = getCheckoutSaveAddressFlag({
						isAuthenticated: authenticated,
						isUsingSavedAddress: usingSavedAddress,
					});

					if (usingSavedAddress && user?.addresses) {
						const selectedAddress = user.addresses.find((a) => a.id === selectedAddressId);
						if (selectedAddress) {
							addressInput = getAddressInputDataFromAddress(selectedAddress);
						}
					} else {
						addressInput = getAddressInputData({ ...formData, countryCode });
					}

					if (addressInput) {
						const addressResult = await updateCheckoutShippingAddress(
							updatedCheckout.id,
							addressInput,
							saveAddress,
						);

						if (!addressResult.ok) {
							if (addressResult.fieldErrors?.length) {
								const errorMap: Record<string, string> = {};
								addressResult.fieldErrors.forEach((err) => {
									const field = err.field || "streetAddress1";
									errorMap[field] = err.message || "Invalid value";
								});
								setErrors(errorMap);
							} else {
								setErrors({ streetAddress1: addressResult.error ?? "Failed to update address" });
							}
							setIsSubmitting(false);
							return;
						}
						updatedCheckout = addressResult.checkout;
					}
				}

				onComplete(updatedCheckout);
			} catch {
				setIsSubmitting(false);
			}
		},
		[
			checkout,
			isSubmitting,
			authenticated,
			isOrphaned,
			email,
			createAccount,
			accountPassword,
			user?.addresses,
			showNewAddressForm,
			isEnteringNewAddress,
			selectedAddressId,
			orderedAddressFields,
			isRequiredField,
			getFieldLabel,
			formData,
			countryCode,
			onComplete,
		],
	);

	// ----- Render: Password Reset -----
	if (contactView === "resetPassword") {
		return (
			<div className="space-y-8">
				<ExpressCheckout />
				<ResetPasswordForm
					onSuccess={async () => {
						onAuthSessionPending();
						await syncAuthSurfacesAfterSignIn(checkout.channel.slug, router);
						setContactView("main");
					}}
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
					onSuccess={async () => {
						onAuthSessionPending();
						await syncAuthSurfacesAfterSignIn(checkout.channel.slug, router);
						setContactView("main");
					}}
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
			{isOrphaned ? (
				<div className="bg-muted/40 space-y-3 rounded-lg border border-border p-4">
					<p className="text-sm text-foreground">
						This cart is still linked to a signed-in account. To check out as a guest, start a fresh anonymous
						cart with the same items, or log in instead.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button
							type="button"
							variant="outline-solid"
							size="sm"
							disabled={isRecovering}
							onClick={() => void recoverAsGuest()}
						>
							{isRecovering ? "Preparing guest cart..." : "Continue as guest"}
						</Button>
						<Button type="button" variant="ghost" size="sm" onClick={() => setContactView("signIn")}>
							Log in
						</Button>
					</div>
					{recoveryError ? <p className="text-sm text-destructive">{recoveryError}</p> : null}
				</div>
			) : null}

			<ExpressCheckout />

			<ContactSection
				isSignedIn={authenticated}
				user={user}
				checkoutId={checkout.id}
				isLoading={contactLoading}
				onSignOut={() => {
					setShowNewAddressForm(false);
					setSelectedAddressId(null);
					setIsEnteringNewAddress(true);
					setEmail(checkout.email || "");
				}}
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
					isLoading={isAuthTransitionLoading}
					isAuthenticated={authenticated}
					userAddresses={user?.addresses || []}
					defaultAddressId={user?.defaultShippingAddress?.id}
					selectedAddressId={selectedAddressId}
					onSelectAddress={handleSelectAddress}
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
