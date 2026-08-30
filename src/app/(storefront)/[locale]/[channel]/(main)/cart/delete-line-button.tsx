"use client";

import { useTransition } from "react";
import { bumpChromeVersion } from "@/lib/chrome-sync";
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
				startTransition(async () => {
					await deleteLine();
					// This tab re-renders via `refresh()` inside the action;
					// other tabs sync their cart chrome on next focus.
					bumpChromeVersion();
				});
			}}
			aria-disabled={isPending}
		>
			{isPending ? "Removing" : "Remove"}
			<span className="sr-only">line from cart</span>
		</button>
	);
};
