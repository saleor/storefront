import currency from "currency.js";

export const formatRedirectUrl = (redirectUrl: string, orderId: string) => {
  const url = new URL(redirectUrl);
  url.searchParams.set("order", orderId);

  return url.toString();
};

type Money = string | number | undefined;

type Amounts = {
  charged: Money;
  authorized: Money;
  refunded: Money;
  voided: Money;
};

const notNegative = (number: number) => (number < 0 ? 0 : number);

export const getTransactionAmount = (amounts: Amounts) => {
  const charged = amounts?.charged ?? 0;
  const authorized = amounts?.authorized ?? 0;
  const refunded = amounts?.refunded ?? 0;
  const voided = amounts?.voided ?? 0;

  return (type: keyof Amounts): number => {
    switch (type) {
      case "refunded":
        return currency(refunded).value;
      case "voided":
        return currency(voided).value;
      case "charged":
        return notNegative(
          currency(charged).subtract(refunded).subtract(voided).value
        );
      case "authorized":
        return notNegative(
          currency(authorized)
            .subtract(charged)
            .subtract(refunded)
            .subtract(voided).value
        );
    }
  };
};
