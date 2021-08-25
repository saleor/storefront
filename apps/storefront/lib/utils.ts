export const formatAsMoney = (amount: number = 0, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    style: "currency",
    currency,
  }).format(amount);
