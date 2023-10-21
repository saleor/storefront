import React from "react";
import { Button, Title } from "@/checkout/components";
import { useRouter } from "next/navigation";

export const EmptyCartPage = () => {
	const formatMessage = useFormattedMessages();
	const router = useRouter();


	// eslint-disable-next-line no-restricted-globals
	const goBack = () => router.replace("/");

	return (
		<div className="flex h-40 w-full flex-row justify-center lg:mt-10">
			<div className="flex flex-col justify-start rounded-lg border border-neutral-400 p-6">
				<Title>{formatMessage(emptyCartMessages.emptyCart)}</Title>
				<p>{formatMessage(emptyCartMessages.addToCardToContinue)}</p>
		<div className="flex w-full flex-row justify-center lg:mt-10">
			<div className="flex flex-col justify-start rounded-lg border border-neutral-400 py-6">
				<Title>Your cart is empty</Title>
				<p>Add anything to the cart to continue</p>
				<Button
					className="mt-3 md:self-end"
					ariaLabel="Go back to store"
					onClick={goBack}
					variant="secondary"
					label="Go back to store"
				/>
			</div>
		</div>
	);
};
