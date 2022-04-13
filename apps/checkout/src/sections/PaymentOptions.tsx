import { Button } from "@components/Button";
import { useCheckout } from "@hooks/useCheckout";
import { useFormattedMessages } from "@hooks/useFormattedMessages";
import React from "react";

interface PaymentOptionsProps {}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({}) => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();

  const finalizeCheckout = async () => {
    const result = await fetch(
      `${process.env.REACT_APP_CHECKOUT_APP_URL}/pay`,
      {
        method: "POST",
        body: JSON.stringify({
          provider: "mollie",
          checkoutId: checkout?.id,
          totalAmount: checkout?.totalPrice?.gross?.amount,
        }),
      }
    );

    const { data } = await result.json();

    if (data?.checkoutUrl) {
      window.location.replace(data.checkoutUrl);
    }
  };

  return (
    <div className="mb-10 flex flex-row justify-end">
      <Button
        ariaLabel={formatMessage("finalizeCheckoutLabel")}
        title="Pay"
        onClick={finalizeCheckout}
        className="min-w-28"
      />
    </div>
  );
};
