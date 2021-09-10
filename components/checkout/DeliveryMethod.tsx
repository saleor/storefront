import React, { useState } from 'react';
import clsx from 'clsx';

import { RadioGroup } from '@headlessui/react'

const deliveryMethods = [
  { id: 1, title: 'Standard', turnaround: '4–10 business days', price: '$5.00' },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: '$16.00' },
]

export const DeliveryMethod = ({}) => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0])

  return (
    <RadioGroup value={selectedDeliveryMethod} onChange={setSelectedDeliveryMethod} className="py-8">
      <RadioGroup.Label className="text-lg font-medium text-gray-900">Delivery method</RadioGroup.Label>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {deliveryMethods.map((deliveryMethod) => (
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
                      {deliveryMethod.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {deliveryMethod.turnaround}
                    </RadioGroup.Description>
                    <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                      {deliveryMethod.price}
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
