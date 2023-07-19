import React from "react";

const Money = ({ money, defaultValue, ...props }) => {
  if (!money) {
    return <span {...props}>{defaultValue}</span>;
  }
  return (
    <span {...props}>
      {money.currency && money.currency !== ""
        ? money.amount.toLocaleString(process.env.LANGUAGE_LOCALE, {
            currency: money.currency,
            style: "currency",
          })
        : money.amount.toString()}
    </span>
  );
};

export const TaxedMoney = ({ taxedMoney, defaultValue, ...props }) => {
  const money = taxedMoney ? taxedMoney.gross : undefined;
  return <Money {...props} money={money} defaultValue={defaultValue} />;
};

TaxedMoney.displayName = "TaxedMoney";
export default TaxedMoney;
