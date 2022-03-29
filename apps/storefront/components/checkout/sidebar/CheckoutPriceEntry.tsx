import React from "react";

export function CheckoutPriceEntry({ label, value }: Record<string, string>) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}

export default CheckoutPriceEntry;
