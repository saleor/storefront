import { useCheckoutQuery } from "@graphql";
import { getToken } from "@lib/utils";

export const useCheckout = () => {
  const token = getToken();

  const [{ data, fetching: loading }] = useCheckoutQuery({
    variables: { token: token },
  });

  return { checkout: data!.checkout!, loading };
};
