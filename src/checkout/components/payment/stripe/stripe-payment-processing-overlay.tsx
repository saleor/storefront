"use client";

import { type FC } from "react";
import { LoadingSpinner } from "@/checkout/ui-kit/loading-spinner";

type StripePaymentProcessingOverlayProps = {
	title: string;
	description?: string;
};

/** Covers Stripe Elements while confirm/process runs — keeps Elements mounted. */
export const StripePaymentProcessingOverlay: FC<StripePaymentProcessingOverlayProps> = ({
	title,
	description = "Please don't close or refresh this page.",
}) => {
	return (
		<div
			className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card px-6 text-center"
			role="status"
			aria-live="polite"
			aria-busy="true"
		>
			<LoadingSpinner />
			<p className="mt-4 text-sm font-medium text-foreground">{title}</p>
			<p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p>
		</div>
	);
};
