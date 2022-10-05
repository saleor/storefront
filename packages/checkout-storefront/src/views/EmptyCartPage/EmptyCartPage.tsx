import React from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Text } from "@saleor/ui-kit";
import { Button, Title } from "@/checkout-storefront/components";
import { labels, messages } from "@/checkout-storefront/views/EmptyCartPage/messages";

export const EmptyCartPage = () => {
  const formatMessage = useFormattedMessages();

  // eslint-disable-next-line no-restricted-globals
  const goBack = () => history.back();

  return (
    <div className="w-full flex flex-row justify-center lg:mt-10">
      <div className="flex flex-col justify-start border rounded-lg border-border-secondary section">
        <Title>{formatMessage(messages.emptyCart)}</Title>
        <Text>{formatMessage(messages.addToCardToContinue)}</Text>
        <Button
          className="mt-3 md:self-end"
          ariaLabel={formatMessage(labels.goBackToStore)}
          onClick={goBack}
          variant="secondary"
          label={formatMessage(messages.goBackToStore)}
        />
      </div>
    </div>
  );
};
