"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { FlaskConical } from "lucide-react";
import { useCheckoutPaymentMessages } from "@/checkout/hooks/use-checkout-payment-messages";

export interface DummyPaymentPlaceholderProps {
	/** Gateway display name from Saleor (e.g. "Dummy Payment App") */
	gatewayName?: string | null;
}

/**
 * Minimal payment UI for Saleor Dummy Payment test checkouts.
 * No card fields or method picker — the gateway is chosen server-side on Pay.
 */
export const DummyPaymentPlaceholder: FC<DummyPaymentPlaceholderProps> = ({ gatewayName }) => {
	const tSteps = useTranslations("checkout.steps");
	const paymentMessages = useCheckoutPaymentMessages();
	const label = gatewayName?.trim() || paymentMessages.dummyGateway;

	return (
		<section className="space-y-3">
			<h2 className="text-lg font-semibold">{tSteps("payment")}</h2>
			<p className="flex items-start gap-2 text-sm text-muted-foreground">
				<FlaskConical className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
				<span>
					<span className="text-foreground">{label}</span>
					{" · "}
					{paymentMessages.dummyTestMode}
				</span>
			</p>
			<TestCardMockup />
		</section>
	);
};

/** Soft ambient sheen — corner blooms only, no diagonal stripe. */
const CARD_SURFACE_STYLE = {
	background: [
		"radial-gradient(130% 100% at 0% 0%, rgba(255,255,255,0.11), transparent 52%)",
		"radial-gradient(130% 100% at 100% 100%, rgba(255,255,255,0.11), transparent 52%)",
		"linear-gradient(168deg, oklch(0.2 0 0) 0%, oklch(0.11 0 0) 45%, oklch(0.15 0 0) 100%)",
	].join(", "),
	boxShadow: [
		"inset 0 1px 0 rgba(255,255,255,0.14)",
		"inset 0 -1px 0 rgba(0,0,0,0.25)",
		"0 2px 16px rgba(0,0,0,0.1)",
	].join(", "),
} as const;

/**
 * Decorative card preview — non-interactive, test checkout only.
 */
const TestCardMockup: FC = () => (
	<div aria-hidden className="relative aspect-[856/520] w-full">
		<div
			className="absolute inset-0 overflow-hidden rounded-2xl p-5 text-white sm:p-6"
			style={CARD_SURFACE_STYLE}
		>
			<div className="relative z-10 flex h-full flex-col justify-between">
				<div className="flex justify-end">
					<span className="text-[10px] font-medium uppercase tracking-widest text-white/45 sm:text-xs">
						Test
					</span>
				</div>
				<p className="font-mono text-base tracking-[0.2em] text-white/90 sm:text-lg">•••• •••• •••• 4242</p>
				<div className="flex items-end justify-between text-xs text-white/60 sm:text-sm">
					<span className="uppercase tracking-wide">Test cardholder</span>
					<span>12/28</span>
				</div>
			</div>
		</div>
	</div>
);
