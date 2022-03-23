import { useCheckoutQuery } from "@graphql";
import { getDataWithToken } from "@lib/utils";

export const useCheckout = () => {
  const [{ data, fetching: loading }] = useCheckoutQuery({
    variables: getDataWithToken(),
  });

  return { checkout: data!.checkout!, loading };
};
