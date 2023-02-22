import { useUserQuery } from "@/saleor/api";

export const useUser = () => {
  const { data, loading } = useUserQuery();

  const user = data?.user;

  const authenticated = !!user?.id;

  return { user, loading, authenticated };
};
