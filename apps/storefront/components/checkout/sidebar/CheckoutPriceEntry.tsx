import React from "react";

export const CheckoutPriceEntry = ({ label, value }: Record<string, string>) => {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
};
