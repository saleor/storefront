import { useCheckoutQuery } from "@/graphql";
import { getDataWithToken } from "@/lib/utils";
import { useAuthState } from "@saleor/sdk";

export const useCheckout = () => {
  const { authenticating } = useAuthState();

  const [{ data, fetching: loading }] = useCheckoutQuery({
    variables: getDataWithToken(),
    pause: authenticating,
  });

  return { checkout: data!.checkout!, loading };
};
