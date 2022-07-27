import React, { PropsWithChildren, useRef, useState } from "react";
import { createSafeContext } from "@/checkout-storefront/providers/createSafeContext";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

interface BillingSameAsShippingContextConsumerProps {
  isBillingSameAsShippingAddress: boolean;
  setIsBillingSameAsShippingAddress: (value: boolean) => void;
  hasBillingSameAsShippingAddressChanged: boolean;
  setHasBillingSameAsShippingAddressChanged: (value: boolean) => void;
}

export const [useBillingSameAsShipping, Provider] =
  createSafeContext<BillingSameAsShippingContextConsumerProps>();

export const BillingSameAsShippingProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const { checkout } = useCheckout();

  const [isBillingSameAsShippingAddress, setIsBillingSameAsShippingAddress] =
    useState(!checkout?.billingAddress);

  const [
    hasBillingSameAsShippingAddressChanged,
    setHasBillingSameAsShippingAddressChanged,
  ] = useState(false);

  const providerValues: BillingSameAsShippingContextConsumerProps = {
    isBillingSameAsShippingAddress,
    setIsBillingSameAsShippingAddress,
    hasBillingSameAsShippingAddressChanged,
    setHasBillingSameAsShippingAddressChanged,
  };

  return <Provider value={providerValues}>{children}</Provider>;
};
