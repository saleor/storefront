import { useCheckoutQuery } from "@graphql";
import { extractTokenFromUrl } from "@lib/utils";

export const useCheckout = () => {
  const token = extractTokenFromUrl();

  const [{ data, fetching: loading }] = useCheckoutQuery({
    variables: { token },
  });

  return { checkout: data!.checkout!, loading };
};
