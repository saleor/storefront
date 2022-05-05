import { useOrderQuery } from "@/graphql";
import { useAuthState } from "@saleor/sdk";

export const useOrder = (token: string) => {
  const { authenticating } = useAuthState();

  const [{ data, fetching: loading }] = useOrderQuery({
    variables: { token },
    pause: authenticating,
  });

  return { order: data?.orderByToken!, loading };
};
