import React from "react";
import { Text } from "@components/Text";

interface CheckoutFormProps {}

const CheckoutForm: React.FC<CheckoutFormProps> = ({}) => {
  return (
    <div className="checkout-form" style={{ border: "1px solid red" }}>
      <Text>Checkout here</Text>
    </div>
  );
};

export default CheckoutForm;
