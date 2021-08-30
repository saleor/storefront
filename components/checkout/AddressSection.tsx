import { formatAsMoney } from "@/lib/util";
import {
  Checkout,
  CheckoutDetailsFragment,
  useCheckoutEmailUpdateMutation,
} from "@/saleor/api";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AddressForm, AddressType } from "./AddressForm";

export const AddressSection = ({
  checkout,
}: {
  checkout?: CheckoutDetailsFragment;
}) => {
  const [modifyShippingAddress, setModifyShippingAddress] = useState(
    !checkout?.shippingAddress && checkout?.isShippingRequired
  );
  const [modifyBillingAddress, setModifyBillingAddress] = useState(
    !checkout?.billingAddress
  );

  if (!checkout) {
    return <></>;
  }
  return (
    <>
      <div className="col-span-full">
        <h2>Billing address</h2>
      </div>
      {!modifyBillingAddress ? (
        <section className="col-span-full">
          <p>{checkout.billingAddress?.firstName}</p>
          <p>{checkout.billingAddress?.lastName}</p>
          <p>{checkout.billingAddress?.phone}</p>
          <p>{checkout.billingAddress?.country.country}</p>
          <p>{checkout.billingAddress?.streetAddress1}</p>
          <p>{checkout.billingAddress?.city}</p>
          <p>{checkout.billingAddress?.postalCode}</p>
          <button
            className="w-full mt-6 bg-gray-400 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700"
            onClick={() => setModifyBillingAddress(true)}
          >
            Change
          </button>
        </section>
      ) : (
        <AddressForm
          addressType={AddressType.BILLING}
          existingAddressData={checkout?.billingAddress || undefined}
          checkout={checkout}
          toggle={() => setModifyBillingAddress(false)}
        />
      )}
      <div className="col-span-full">
        <h2>Shipping address</h2>
      </div>
      {!modifyShippingAddress ? (
        <section className="col-span-full">
          <p>{checkout.shippingAddress?.firstName}</p>
          <p>{checkout.shippingAddress?.lastName}</p>
          <p>{checkout.shippingAddress?.phone}</p>
          <p>{checkout.shippingAddress?.country.country}</p>
          <p>{checkout.shippingAddress?.streetAddress1}</p>
          <p>{checkout.shippingAddress?.city}</p>
          <p>{checkout.shippingAddress?.postalCode}</p>
          <button
            className="w-full mt-6 bg-gray-400 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700"
            onClick={() => setModifyShippingAddress(true)}
          >
            Change
          </button>
        </section>
      ) : (
        <AddressForm
          addressType={AddressType.SHIPPING}
          existingAddressData={checkout?.shippingAddress || undefined}
          checkout={checkout}
          toggle={() => setModifyShippingAddress(false)}
        />
      )}
    </>
  );
};
