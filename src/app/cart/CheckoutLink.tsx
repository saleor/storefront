"use client";

import clsx from "clsx";
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
			className={clsx(
				disabled && "cursor-not-allowed",
				"w-full rounded border border-transparent bg-pink-600 px-6 py-3 text-center font-medium text-gray-50 hover:bg-pink-500 aria-disabled:bg-pink-500 sm:col-start-2",
			)}
		>
			Checkout
		</Link>
	);
};
