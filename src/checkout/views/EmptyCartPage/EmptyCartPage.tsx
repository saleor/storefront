import React from "react";
import { Title } from "@/checkout/components";

export const EmptyCartPage = () => {
	return (
		<div className="flex w-full flex-row justify-center lg:mt-10">
			<div className="flex flex-col justify-start rounded-lg border border-neutral-400 py-6">
				<Title>Your cart is empty</Title>
				<p>Add anything to the cart to continue</p>
				<a className="mt-3 md:self-end" href="/">
					Go back to store
				</a>
			</div>
		</div>
	);
};
