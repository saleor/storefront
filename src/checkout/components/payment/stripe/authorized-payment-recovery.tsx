"use client";

import { useState, type FC } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { type CheckoutFragment } from "@/checkout/graphql";
import { isCheckoutReadyToComplete } from "@/checkout/lib/payment/checkout-payment-status";
import {
	isCheckoutPaymentActive,
	markPaymentCompleting,
} from "@/checkout/lib/payment/checkout-payment-completion";
import { finalizeCheckoutOrder } from "@/checkout/lib/payment/finalize-checkout-order";
import { rethrowNextInternalError } from "@/checkout/lib/rethrow-next-internal-error";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";
import { Button } from "@/ui/components/ui/button";

type AuthorizedPaymentRecoveryProps = {
	checkout: CheckoutFragment;
	onError: (message: string) => void;
};

/** Fallback when authorizeStatus is FULL but checkoutComplete did not run. */
export const AuthorizedPaymentRecovery: FC<AuthorizedPaymentRecoveryProps> = ({ checkout, onError }) => {
	const searchParams = useSearchParams();
	const paymentMessages = useCheckoutPaymentMessages();
	const tActions = useTranslations("checkout.actions");
	const [isCompleting, setIsCompleting] = useState(false);

	if (isCheckoutPaymentActive(searchParams)) {
		return null;
	}

	if (!isCheckoutReadyToComplete(checkout)) {
		return null;
	}

	const handleComplete = async () => {
		onError("");
		setIsCompleting(true);
		markPaymentCompleting(checkout.id);

		try {
			const result = await finalizeCheckoutOrder(checkout.id, checkout.channel.slug);
			if (!result.ok) {
				onError(result.error);
				setIsCompleting(false);
			}
		} catch (error) {
			rethrowNextInternalError(error);
			console.error("Failed to complete authorized checkout:", error);
			onError(paymentMessages.placeOrderFailed);
			setIsCompleting(false);
		}
	};

	return (
		<div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
			<div className="flex-1 space-y-3">
				<div>
					<p className="font-medium text-amber-900">{paymentMessages.authorizedTitle}</p>
					<p className="mt-1 text-sm text-amber-800">{paymentMessages.authorizedBody}</p>
				</div>
				<Button
					type="button"
					variant="outline-solid"
					disabled={isCompleting}
					onClick={() => void handleComplete()}
				>
					{isCompleting ? (
						<span className="flex items-center gap-2">
							<LoadingSpinner />
							{tActions("creatingOrder")}
						</span>
					) : (
						tActions("completeOrder")
					)}
				</Button>
			</div>
		</div>
	);
};
