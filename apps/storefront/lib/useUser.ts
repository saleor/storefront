import { useUserQuery } from "@/saleor/api";

export const useUser = () => {
  const { data, loading } = useUserQuery({ fetchPolicy: "cache-and-network" });

  const user = data?.user;

  const authenticated = !!user?.id;

  return { user, loading, authenticated };
};
