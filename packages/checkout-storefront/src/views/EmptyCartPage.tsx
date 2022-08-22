import React from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Text } from "@saleor/ui-kit";
import { Button, Title } from "@/checkout-storefront/components";

export const EmptyCartPage = () => {
  const formatMessage = useFormattedMessages();

  // eslint-disable-next-line no-restricted-globals
  const goBack = () => history.back();

  return (
    <div className="w-full flex flex-row justify-center lg:mt-10">
      <div className="flex flex-col justify-start border rounded-lg border-border-secondary section">
        <Title>{formatMessage("emptyCart")}</Title>
        <Text>{formatMessage("addToCartToContinue")}</Text>
        <Button
          className="mt-3 md:self-end"
          ariaLabel={formatMessage("goBackToStoreLabel")}
          onClick={goBack}
          variant="secondary"
          label={formatMessage("goBackToStore")}
        />
      </div>
    </div>
  );
};
