import { OrderFragment, useOrderQuery } from "@/checkout-storefront/graphql";
import { useQueryVarsWithLocale } from "@/checkout-storefront/hooks/useQueryVarsWithLocale";

export const useOrder = (id: string) => {
  const getQueryVarsWithLocale = useQueryVarsWithLocale();

  const [{ data, fetching: loading }] = useOrderQuery({
    variables: getQueryVarsWithLocale({ id }),
  });

  return { order: data?.order as OrderFragment, loading };
};
