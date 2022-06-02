import { useOrderQuery } from "@/graphql";

export const useOrder = (id: string) => {
  const [{ data, fetching: loading }] = useOrderQuery({
    variables: { id },
  });

  return { order: data?.order!, loading };
};
