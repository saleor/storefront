import { useOrderQuery } from "@/checkout-storefront/graphql";

export const useOrder = (id: string) => {
  const [{ data, fetching: loading }] = useOrderQuery({
    variables: { id },
  });

  return { order: data?.order!, loading };
};
