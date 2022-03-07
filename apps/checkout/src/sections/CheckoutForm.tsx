import { Divider } from "@components/Divider";
import { Contact } from "./Contact";

export const CheckoutForm = () => {
  return (
    <div className="checkout-form">
      <Contact />
      <Divider className="my-8" />
    </div>
  );
};
