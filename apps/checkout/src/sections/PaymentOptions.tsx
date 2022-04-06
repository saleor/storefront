import { Button } from "@components/Button";
// import { Title } from "@components/Title";
import { useCheckout } from "@hooks/useCheckout";
import React from "react";

interface PaymentOptionsProps {}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({}) => {
  const { checkout } = useCheckout();

  // const [selectedOptionId, setSelectedOptionId] = useState();

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
    <div className="mb-10">
      {/* <Title className="mb-4">Payment options</Title>
      {checkout?.availablePaymentGateways?.map(({ id, name }) => (
        <div>
          <input
            type="radio"
            className="mr-2 mt-1"
            checked={selectedOptionId === id}
            onChange={() => setSelectedOptionId(id)}
          />
          <label>{name}</label>
        </div>
      ))} */}
      <Button
        ariaLabel="finaliza checkout"
        title="Pay"
        onClick={finalizeCheckout}
        className="min-w-28"
      />
    </div>
  );
};
