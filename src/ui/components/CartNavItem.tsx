import { cookies } from "next/headers";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import * as Checkout from "@/lib/checkout";

export const CartNavItem = async () => {
	const checkoutId = cookies().get("checkoutId")?.value || "";
	const checkout = await Checkout.find(checkoutId);

	const lineCount = checkout ? checkout.lines.reduce((result, line) => result + line.quantity, 0) : 0;

	return (
		<Link href="/cart" className="flex w-12 items-center">
			<ShoppingBagIcon className="h-6 w-6 flex-shrink-0 " aria-hidden="true" />
			<span className="ml-2 min-w-[2ch] text-sm font-medium">{lineCount > 0 && lineCount}</span>
			<span className="sr-only">items in cart, view bag</span>
		</Link>
	);
};
