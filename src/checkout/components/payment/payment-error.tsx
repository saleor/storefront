"use client";

import { type FC } from "react";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type PaymentErrorProps = {
	message?: string;
};

export const PaymentError: FC<PaymentErrorProps> = ({ message }) => {
	const t = useTranslations("checkout.payment");

	if (!message) {
		return null;
	}

	return (
		<div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
			<AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
			<div>
				{/* Not "Payment failed": the message may be about an order that failed after a
				    payment went through. */}
				<p className="font-medium text-destructive">{t("errorTitle")}</p>
				<p className="text-sm text-destructive/80">{message}</p>
			</div>
		</div>
	);
};
