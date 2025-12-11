"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
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
			className="flex items-center gap-1 text-sm text-secondary-500 hover:text-red-600 transition-colors disabled:opacity-50"
			onClick={() => {
				if (isPending) return;
				startTransition(() => deleteLineFromCheckout({ lineId, checkoutId }));
			}}
			disabled={isPending}
			aria-disabled={isPending}
		>
			{isPending ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Trash2 className="h-4 w-4" />
			)}
			<span className="hidden sm:inline">{isPending ? "Removing..." : "Remove"}</span>
			<span className="sr-only">line from cart</span>
		</button>
	);
};
