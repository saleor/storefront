
import React from 'react';

export const CreditCardSection = ({ }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>

      <div className="mt-4 grid grid-cols-12 gap-4">

        <div className="col-span-full">
          <label
            htmlFor="name-on-card"
            className="block text-sm font-medium text-gray-700"
          >
            Name on card
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name-on-card"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label
            htmlFor="card-number"
            className="block text-sm font-medium text-gray-700"
          >
            Card number
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="card-number"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="col-span-8 sm:col-span-9">
          <label
            htmlFor="expiration-date"
            className="block text-sm font-medium text-gray-700"
          >
            Expiration date (MM/YY)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="expiration-date"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="col-span-4 sm:col-span-3">
          <label
            htmlFor="cvc"
            className="block text-sm font-medium text-gray-700"
          >
            CVC
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="cvc"
              className="block w-full border-gray-300 rounded-md shadow-sm text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
