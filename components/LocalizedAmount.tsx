import { formatAsMoney } from "@/lib/util";

export const LocalizedAmount = ({ amount, currency }: any) => {
  const value = formatAsMoney(amount, currency);
  return (
    <div>{value}</div>
  );
};
