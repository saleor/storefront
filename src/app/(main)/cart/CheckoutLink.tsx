"use client";

import Link from "next/link";

type Props = {
	disabled?: boolean;
	checkoutId?: string;
};

export const CheckoutLink = ({ disabled, checkoutId }: Props) => {
	return (
		<Link
			aria-disabled={disabled}
			onClick={(e) => disabled && e.preventDefault()}
			href={`/checkout?checkout=${checkoutId}`}
			className="w-full rounded border border-transparent bg-gray-900 px-6 py-3 text-center font-medium text-gray-50 hover:bg-gray-800 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-500 sm:col-start-2"
		>
			Checkout
		</Link>
	);
};
