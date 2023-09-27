import React from "react";
import { emptyCartLabels, emptyCartMessages } from "./messages";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { Text } from "@/checkout/ui-kit";
import { Button, Title } from "@/checkout/src/components";

export const EmptyCartPage = () => {
	const formatMessage = useFormattedMessages();

	// eslint-disable-next-line no-restricted-globals
	const goBack = () => history.back();

	return (
		<div className="flex w-full flex-row justify-center lg:mt-10">
			<div className="border-border-secondary section flex flex-col justify-start rounded-lg border">
				<Title>{formatMessage(emptyCartMessages.emptyCart)}</Title>
				<Text>{formatMessage(emptyCartMessages.addToCardToContinue)}</Text>
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
