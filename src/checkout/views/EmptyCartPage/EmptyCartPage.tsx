import React from "react";
import { Title } from "@/checkout/components";
import { LinkAsButton } from "@/checkout/components/LinkAsButton";

export const EmptyCartPage = () => {
	return (
		<div className="mx-auto flex max-w-screen-sm flex-col items-center gap-y-4 bg-neutral-50 px-8 py-16 text-center">
			<Title className="mb-0 text-xl">Your cart is empty</Title>
			<p>Add anything to the cart to continue.</p>
			<LinkAsButton href="/" variant="secondary">
				Go back to store
			</LinkAsButton>
		</div>
	);
};
