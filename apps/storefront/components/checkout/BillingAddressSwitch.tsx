import { CheckoutDetailsFragment } from '@/saleor/api';
import React, { useState } from 'react';
import { AddressType } from './AddressForm';
import { AddressSection } from './AddressSection';

export const BillingAddressSwitch = ({
  checkout,
}: {
  checkout?: CheckoutDetailsFragment;
}) => {
  const [sameAsShipping, setSameAsShipping] = useState(true);

  return (
    <div>
      <div className="mt-8 flex space-x-4 items-center">
        <input
          id="same-as-shipping"
          type="checkbox"
          defaultChecked
          className="h-4 w-4 border-gray-300 rounded text-blue-500"
          onClick={() => setSameAsShipping(!sameAsShipping)}
        />
        <label
          htmlFor="same-as-shipping"
          className="text-sm font-semibold text-gray-900"
        >
          My billing address is the same as my shipping address
        </label>
      </div>

      {!sameAsShipping ? <div>
        <div className="mt-8 mb-4">
          <h2 className="text-lg font-medium text-gray-900 my-4">Billing Address</h2>
        </div>
        <AddressSection type={AddressType.BILLING} address={checkout?.billingAddress} required={true} />
      </div> : null}

    </div>
  );
}
