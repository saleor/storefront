import React from "react";
import { emptyCartLabels, emptyCartMessages } from "./messages";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { Button, Title } from "@/checkout/components";

export const EmptyCartPage = () => {
	const formatMessage = useFormattedMessages();

	// eslint-disable-next-line no-restricted-globals
	const goBack = () => history.back();

	return (
		<div className="flex w-full flex-row justify-center lg:mt-10">
			<div className="flex flex-col justify-start rounded-lg border border-gray-400 py-6">
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
