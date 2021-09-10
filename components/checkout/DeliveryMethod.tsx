import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { RadioGroup } from '@headlessui/react'
import { useCheckoutShippingMethodUpdateMutation } from '@/saleor/api';
import { useLocalStorage } from 'react-use';

export const DeliveryMethod = ({ collection }: { collection: Array<any> }) => {
  const [token] = useLocalStorage("token");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState()
  const [checkoutShippingMethodUpdate] = useCheckoutShippingMethodUpdateMutation({});

  const handleChange = async (method: any) => {
    console.log('DeliveryMethod.handleChange', method);

    const r = await checkoutShippingMethodUpdate({
      variables: {
        token,
        shippingMethodId: method.id
      }
    });

    setSelectedDeliveryMethod(method);
  }

  return (
    <RadioGroup value={selectedDeliveryMethod} onChange={handleChange} className="py-8">
      <RadioGroup.Label className="text-lg font-medium text-gray-900">Delivery method</RadioGroup.Label>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {collection.map((deliveryMethod) => (
          <RadioGroup.Option
            key={deliveryMethod.id}
            value={deliveryMethod}
            className={({ checked, active }) =>
              clsx(
                checked ? 'border-transparent' : 'border-gray-300',
                active ? 'ring-1 ring-blue-500' : '',
                'bg-white border rounded shadow-sm p-4 flex cursor-pointer'
              )
            }
          >
            {({ checked, active }) => (
              <>
                <div className="flex-1 flex">
                  <div className="flex flex-col">
                    <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                      {deliveryMethod.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {deliveryMethod.minimumDeliveryDays || 2}-{deliveryMethod.maximumDeliveryDays || 14} business days
                    </RadioGroup.Description>
                    <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                      {deliveryMethod.price.amount}
                    </RadioGroup.Description>
                  </div>
                </div>
                <div
                  className={clsx(
                    active ? 'border' : 'border-2',
                    checked ? 'border-blue-500' : 'border-transparent',
                    'absolute -inset-px rounded pointer-events-none'
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
