import React from "react";

export const CheckoutPriceEntry: React.VFC<Record<string, string>> = ({
  label,
  value,
}) => {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
};
