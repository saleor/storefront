"use client";

import { useTransition } from "react";
import { deleteLineFromCheckout } from "./actions";

type Props = {
	lineId: string;
	checkoutId: string;
};

export const DeleteLineButton = ({ lineId, checkoutId }: Props) => {
	const [isPending, startTransition] = useTransition();

	return (
		<button
			type="button"
			className="text-sm text-gray-500 hover:text-gray-900"
			onClick={() => {
				if (isPending) return;
				startTransition(() => deleteLineFromCheckout({ lineId, checkoutId }));
			}}
			aria-disabled={isPending}
		>
			{isPending ? "Removing" : "Remove"}
			<span className="sr-only">line from cart</span>
		</button>
	);
};
