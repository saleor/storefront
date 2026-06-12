"use client";

import { useTransition } from "react";
import { ariaDisabledClassName } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	deleteLine: () => Promise<void>;
};

export const DeleteLineButton = ({ deleteLine }: Props) => {
	const [isPending, startTransition] = useTransition();

	return (
		<button
			type="button"
			className={cn(
				"text-sm text-muted-foreground hover:text-foreground",
				ariaDisabledClassName,
				"aria-disabled:opacity-60",
			)}
			onClick={() => {
				if (isPending) return;
				startTransition(() => {
					void deleteLine();
				});
			}}
			aria-disabled={isPending}
		>
			{isPending ? "Removing" : "Remove"}
			<span className="sr-only">line from cart</span>
		</button>
	);
};
