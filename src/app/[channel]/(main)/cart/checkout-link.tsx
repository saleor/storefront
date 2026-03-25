"use client";

type Props = {
	disabled?: boolean;
	checkoutId?: string;
	className?: string;
};

export const CheckoutLink = ({ disabled, checkoutId, className = "" }: Props) => {
	return (
		<a
			data-testid="CheckoutLink"
			aria-disabled={disabled}
			onClick={(e) => disabled && e.preventDefault()}
			href={`/checkout?checkout=${checkoutId}`}
			className={`inline-block max-w-full rounded-xl bg-emerald-500 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-700 aria-disabled:shadow-none sm:px-16 ${className}`}
		>
			Checkout
		</a>
	);
};
