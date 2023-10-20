import React from "react";
import { emptyCartLabels, emptyCartMessages } from "./messages";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
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
				<Button
					className="mt-3 md:self-end"
					ariaLabel={formatMessage(emptyCartLabels.goBackToStore)}
					onClick={goBack}
					variant="secondary"
					label={formatMessage(emptyCartMessages.goBackToStore)}
				/>
			</div>
		</div>
	);
};
