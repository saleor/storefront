import { cookies } from "next/headers";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import * as Checkout from "@/lib/checkout";

export const CartNavItem = async () => {
	const checkoutId = cookies().get("checkoutId")?.value || "";
	const checkout = await Checkout.find(checkoutId);

	const lineCount = checkout ? checkout.lines.reduce((result, line) => result + line.quantity, 0) : 0;

	return (
		<Link href="/cart" className="relative flex items-center">
			<ShoppingBagIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
			{lineCount > 0 ? (
				<div
					className={clsx(
						"absolute bottom-0 right-0 -mb-2 -mr-2 flex h-4 flex-col items-center justify-center rounded bg-neutral-900 text-xs font-medium text-white",
						lineCount > 9 ? "w-[3ch]" : "w-[2ch]",
					)}
				>
					{lineCount}
					<span className="sr-only">items in cart, view bag</span>
				</div>
			) : (
				<span className="sr-only">cart</span>
			)}
		</Link>
	);
};
