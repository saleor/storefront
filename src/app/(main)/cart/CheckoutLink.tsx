"use client";

type Props = {
	disabled?: boolean;
	checkoutId?: string;
};

export const CheckoutLink = ({ disabled, checkoutId }: Props) => {
	return (
		<a
			aria-disabled={disabled}
			onClick={(e) => disabled && e.preventDefault()}
			href={`/checkout?checkout=${checkoutId}`}
			className="w-full rounded border border-transparent bg-neutral-900 px-6 py-3 text-center font-medium text-neutral-50 hover:bg-neutral-800 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-500 sm:col-start-2"
		>
			Checkout
		</a>
	);
};
