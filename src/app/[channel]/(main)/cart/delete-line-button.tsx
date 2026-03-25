"use client";

import { useTransition } from "react";
import { deleteLineFromCheckout } from "./actions";

type Props = {
	lineId: string;
	checkoutId: string;
	channel: string;
};

export const DeleteLineButton = ({ lineId, checkoutId, channel }: Props) => {
	const [isPending, startTransition] = useTransition();

	return (
		<button
			type="button"
			className="text-sm text-neutral-500 transition-colors hover:text-red-400"
			onClick={() => {
				if (isPending) return;
				startTransition(() => deleteLineFromCheckout({ lineId, checkoutId, channel }));
			}}
			aria-disabled={isPending}
		>
			{isPending ? "Removing" : "Remove"}
			<span className="sr-only">line from cart</span>
		</button>
	);
};
