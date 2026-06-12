"use client";

import { type FC } from "react";
import { AlertCircle } from "lucide-react";

type PaymentErrorProps = {
	message?: string;
};

export const PaymentError: FC<PaymentErrorProps> = ({ message }) => {
	if (!message) {
		return null;
	}

	return (
		<div className="border-destructive/50 bg-destructive/10 flex items-start gap-3 rounded-lg border p-4">
			<AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
			<div>
				<p className="font-medium text-destructive">Payment failed</p>
				<p className="text-destructive/80 text-sm">{message}</p>
			</div>
		</div>
	);
};
