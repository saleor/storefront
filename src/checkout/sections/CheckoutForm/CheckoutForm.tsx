import React, { Suspense, useMemo } from "react";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { Contact } from "@/checkout/sections/Contact";
import { DeliveryMethods } from "@/checkout/sections/DeliveryMethods";
import { ContactSkeleton } from "@/checkout/sections/Contact/ContactSkeleton";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { UserShippingAddressSection } from "@/checkout/sections/UserShippingAddressSection";
import { GuestShippingAddressSection } from "@/checkout/sections/GuestShippingAddressSection";
import { UserBillingAddressSection } from "@/checkout/sections/UserBillingAddressSection";
import { PaymentSection, PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection";
import { GuestBillingAddressSection } from "@/checkout/sections/GuestBillingAddressSection";
import { useUser } from "@/checkout/hooks/useUser";
import { SequentialCheckoutSection } from "@/checkout/components/SequentialCheckoutSection";
import { CheckoutTimeline, type TimelineStep } from "@/checkout/components/CheckoutTimeline";

export const CheckoutForm = () => {
	const { user } = useUser();
	const { checkout } = useCheckout();

	// Determine section completion
	const hasEmail = !!checkout?.email;
	const hasShippingAddress = !!checkout?.shippingAddress;
	const hasBillingAddress = !!checkout?.billingAddress;
	const hasDeliveryMethod = !!checkout?.deliveryMethod;
	const isShippingRequired = checkout?.isShippingRequired ?? false;

	// Get summary text for completed sections
	const getContactSummary = () => {
		if (!checkout?.email) return "";
		return checkout.email;
	};

	const getShippingSummary = () => {
		if (!hasShippingAddress) return "";
		const addr = checkout?.shippingAddress;
		return `${addr?.streetAddress1}, ${addr?.city}, ${addr?.countryArea || ""} ${addr?.postalCode || ""}`.trim();
	};

	const getBillingSummary = () => {
		if (!hasBillingAddress) return "";
		const addr = checkout?.billingAddress;
		return `${addr?.streetAddress1}, ${addr?.city}, ${addr?.countryArea || ""} ${addr?.postalCode || ""}`.trim();
	};

	const getDeliverySummary = () => {
		if (!hasDeliveryMethod) return "";
		return checkout?.deliveryMethod?.name || "";
	};

	// Build timeline steps
	const timelineSteps = useMemo<TimelineStep[]>(() => {
		const steps: TimelineStep[] = [];
		let stepNum = 1;

		// Contact
		steps.push({
			id: "contact",
			title: "Contact Information",
			stepNumber: stepNum++,
			isComplete: hasEmail,
			isActive: true, // Always expanded
			isLocked: false,
		});

		// Shipping (if required)
		if (isShippingRequired) {
			steps.push({
				id: "shipping",
				title: "Shipping Address",
				stepNumber: stepNum++,
				isComplete: hasShippingAddress,
				isActive: true, // Always expanded
				isLocked: !hasEmail,
			});

			steps.push({
				id: "delivery",
				title: "Delivery Method",
				stepNumber: stepNum++,
				isComplete: hasDeliveryMethod,
				isActive: true, // Always expanded
				isLocked: !hasEmail || !hasShippingAddress,
			});
		}

		// Billing
		steps.push({
			id: "billing",
			title: "Billing Address",
			stepNumber: stepNum++,
			isComplete: hasBillingAddress,
			isActive: true, // Always expanded
			isLocked: !hasEmail || (isShippingRequired && (!hasShippingAddress || !hasDeliveryMethod)),
		});

		// Payment
		steps.push({
			id: "payment",
			title: "Payment",
			stepNumber: stepNum++,
			isComplete: false,
			isActive: true, // Always expanded
			isLocked:
				!hasEmail ||
				!hasBillingAddress ||
				(isShippingRequired && (!hasShippingAddress || !hasDeliveryMethod)),
		});

		return steps;
	}, [
		hasEmail,
		hasShippingAddress,
		hasBillingAddress,
		hasDeliveryMethod,
		isShippingRequired,
	]);

	let stepNumber = 1;

	return (
		<div className="flex flex-col gap-6">
			{/* Timeline - shows overall progress */}
			<CheckoutTimeline steps={timelineSteps} />

			{/* Checkout sections - all expanded by default */}
			<div className="flex flex-col gap-4">
			{/* Step 1: Contact */}
			<SequentialCheckoutSection
				id="contact"
				title="Contact Information"
				stepNumber={stepNumber++}
				isComplete={hasEmail}
				isActive={true}
				isLocked={false}
				completedSummary={getContactSummary()}
				data-testid="contactSection"
			>
				<Suspense fallback={<ContactSkeleton />}>
					<Contact />
				</Suspense>
			</SequentialCheckoutSection>

			{/* Step 2: Shipping Address (if required) */}
			{isShippingRequired && (
				<SequentialCheckoutSection
					id="shipping"
					title="Shipping Address"
					stepNumber={stepNumber++}
					isComplete={hasShippingAddress}
					isActive={true}
					isLocked={!hasEmail}
					completedSummary={getShippingSummary()}
					data-testid="shippingAddressSection"
				>
					<Suspense fallback={<AddressSectionSkeleton />}>
						{user ? <UserShippingAddressSection /> : <GuestShippingAddressSection />}
					</Suspense>
				</SequentialCheckoutSection>
			)}

			{/* Step 3: Delivery Method (if shipping required) */}
			{isShippingRequired && (
				<SequentialCheckoutSection
					id="delivery"
					title="Delivery Method"
					stepNumber={stepNumber++}
					isComplete={hasDeliveryMethod}
					isActive={true}
					isLocked={!hasEmail || !hasShippingAddress}
					completedSummary={getDeliverySummary()}
					data-testid="deliveryMethodSection"
				>
					<Suspense fallback={<DeliveryMethodsSkeleton />}>
						<DeliveryMethods collapsed={false} />
					</Suspense>
				</SequentialCheckoutSection>
			)}

			{/* Step 4: Billing Address */}
			<SequentialCheckoutSection
				id="billing"
				title="Billing Address"
				stepNumber={stepNumber++}
				isComplete={hasBillingAddress}
				isActive={true}
				isLocked={!hasEmail || (isShippingRequired && (!hasShippingAddress || !hasDeliveryMethod))}
				completedSummary={getBillingSummary()}
				data-testid="billingAddressSection"
			>
				<Suspense fallback={<AddressSectionSkeleton />}>
					{user ? <UserBillingAddressSection /> : <GuestBillingAddressSection />}
				</Suspense>
			</SequentialCheckoutSection>

			{/* Step 5: Payment */}
			<SequentialCheckoutSection
				id="payment"
				title="Payment"
				stepNumber={stepNumber++}
				isComplete={false}
				isActive={true}
				isLocked={
					!hasEmail ||
					!hasBillingAddress ||
					(isShippingRequired && (!hasShippingAddress || !hasDeliveryMethod))
				}
				data-testid="paymentSection"
			>
				<Suspense fallback={<PaymentSectionSkeleton />}>
					<PaymentSection />
				</Suspense>
			</SequentialCheckoutSection>
			</div>
		</div>
	);
};
