"use client";

import { type FC, useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { Input } from "@/ui/components/ui/Input";
import { cn } from "@/lib/utils";

export type PaymentMethodType = "card" | "paypal" | "ideal";

export interface CardData {
	cardNumber: string;
	expiry: string;
	cvc: string;
	nameOnCard: string;
}

export interface PaymentMethodSelectorProps {
	/** Currently selected payment method */
	value: PaymentMethodType;
	/** Called when payment method changes */
	onChange: (method: PaymentMethodType) => void;
	/** Card data (when card is selected) */
	cardData?: CardData;
	/** Called when card data changes */
	onCardDataChange?: (data: CardData) => void;
	/** Whether card form is in test/demo mode */
	isTestMode?: boolean;
	/** Available payment methods to show */
	availableMethods?: PaymentMethodType[];
}

/**
 * Payment method selector with card form.
 *
 * Features:
 * - Radio selection for payment methods
 * - Expandable card form when card is selected
 * - Card number formatting (groups of 4)
 * - Expiry date formatting (MM/YY)
 * - CVC masking
 *
 * @example
 * ```tsx
 * <PaymentMethodSelector
 *   value={paymentMethod}
 *   onChange={setPaymentMethod}
 *   cardData={cardData}
 *   onCardDataChange={setCardData}
 *   availableMethods={["card", "paypal"]}
 * />
 * ```
 */
export const PaymentMethodSelector: FC<PaymentMethodSelectorProps> = ({
	value,
	onChange,
	cardData,
	onCardDataChange,
	availableMethods = ["card", "paypal", "ideal"],
}) => {
	// Local card state if not controlled
	const [localCardData, setLocalCardData] = useState<CardData>({
		cardNumber: "",
		expiry: "",
		cvc: "",
		nameOnCard: "",
	});

	const card = cardData ?? localCardData;
	const setCard = onCardDataChange ?? setLocalCardData;

	const formatCardNumber = (value: string) => {
		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
		const matches = v.match(/\d{4,16}/g);
		const match = (matches && matches[0]) || "";
		const parts = [];
		for (let i = 0, len = match.length; i < len; i += 4) {
			parts.push(match.substring(i, i + 4));
		}
		return parts.length ? parts.join(" ") : value;
	};

	const formatExpiry = (value: string) => {
		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
		if (v.length >= 2) {
			return v.substring(0, 2) + "/" + v.substring(2, 4);
		}
		return v;
	};

	const updateCardField = (field: keyof CardData, value: string) => {
		setCard({ ...card, [field]: value });
	};

	return (
		<section className="space-y-4">
			<h2 className="text-lg font-semibold">Payment</h2>
			<p className="text-sm text-muted-foreground">All transactions are secure and encrypted.</p>

			<div className="space-y-3">
				{/* Credit Card */}
				{availableMethods.includes("card") && (
					<div
						className={cn(
							"overflow-hidden rounded-lg border transition-colors",
							value === "card" ? "border-foreground" : "border-border",
						)}
					>
						<label className="flex cursor-pointer items-center gap-4 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-foreground">
							<input
								type="radio"
								name="payment"
								value="card"
								checked={value === "card"}
								onChange={() => onChange("card")}
								className="sr-only"
							/>
							<RadioIndicator selected={value === "card"} />
							<CreditCard className="h-5 w-5 text-muted-foreground" />
							<span className="font-medium">Credit card</span>
							<div className="ml-auto flex gap-1">
								<CardBrandIcon brand="visa" />
								<CardBrandIcon brand="mastercard" />
								<CardBrandIcon brand="amex" />
							</div>
						</label>

						{value === "card" && (
							<div className="bg-secondary/30 space-y-4 border-t border-border p-4">
								<div className="relative">
									<Input
										placeholder="Card number"
										value={card.cardNumber}
										onChange={(e) => updateCardField("cardNumber", formatCardNumber(e.target.value))}
										maxLength={19}
										className="pr-12"
									/>
									<Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<Input
										placeholder="MM/YY"
										value={card.expiry}
										onChange={(e) => updateCardField("expiry", formatExpiry(e.target.value))}
										maxLength={5}
									/>
									<Input
										placeholder="CVC"
										value={card.cvc}
										onChange={(e) => updateCardField("cvc", e.target.value.replace(/\D/g, ""))}
										maxLength={4}
									/>
								</div>
								<Input
									placeholder="Name on card"
									value={card.nameOnCard}
									onChange={(e) => updateCardField("nameOnCard", e.target.value)}
								/>
							</div>
						)}
					</div>
				)}

				{/* PayPal */}
				{availableMethods.includes("paypal") && (
					<label
						className={cn(
							"flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
							"focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-2",
							value === "paypal" ? "border-foreground" : "border-border",
						)}
					>
						<input
							type="radio"
							name="payment"
							value="paypal"
							checked={value === "paypal"}
							onChange={() => onChange("paypal")}
							className="sr-only"
						/>
						<RadioIndicator selected={value === "paypal"} />
						<span className="font-bold text-blue-600">Pay</span>
						<span className="font-bold text-blue-900">Pal</span>
					</label>
				)}

				{/* iDEAL */}
				{availableMethods.includes("ideal") && (
					<label
						className={cn(
							"flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
							"focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-2",
							value === "ideal" ? "border-foreground" : "border-border",
						)}
					>
						<input
							type="radio"
							name="payment"
							value="ideal"
							checked={value === "ideal"}
							onChange={() => onChange("ideal")}
							className="sr-only"
						/>
						<RadioIndicator selected={value === "ideal"} />
						<div className="flex h-6 w-10 items-center justify-center rounded bg-pink-500 text-xs font-bold text-white">
							iDEAL
						</div>
						<span className="font-medium">iDEAL</span>
					</label>
				)}
			</div>
		</section>
	);
};

// Helper components
const RadioIndicator: FC<{ selected: boolean }> = ({ selected }) => (
	<div
		className={cn(
			"flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
			selected ? "border-foreground" : "border-muted-foreground/50",
		)}
	>
		{selected && <div className="h-2.5 w-2.5 rounded-full bg-foreground" />}
	</div>
);

const CardBrandIcon: FC<{ brand: "visa" | "mastercard" | "amex" }> = ({ brand }) => {
	const gradients: Record<string, string> = {
		visa: "from-blue-600 to-blue-800",
		mastercard: "from-red-500 to-yellow-500",
		amex: "from-blue-500 to-cyan-400",
	};
	return <div className={cn("h-6 w-10 rounded bg-gradient-to-r", gradients[brand])} />;
};

/**
 * Validate card data.
 */
export const isCardDataValid = (cardData: CardData): boolean => {
	return (
		cardData.cardNumber.length >= 19 &&
		cardData.expiry.length === 5 &&
		cardData.cvc.length >= 3 &&
		cardData.nameOnCard.length > 0
	);
};
