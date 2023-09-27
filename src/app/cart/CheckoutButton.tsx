"use client";

import { useTransition } from "react";

export const CheckoutButton = ({ performCheckout }: { performCheckout: () => Promise<void> }) => {
	const [isPending, startTransition] = useTransition();

	return (
		<button
			disabled={isPending}
			onClick={() => startTransition(() => performCheckout())}
			className="w-full rounded border border-transparent bg-pink-600 px-6 py-3 font-medium text-gray-50 hover:bg-pink-500"
		>
			Checkout
		</button>
	);
};
