import BaseTemplate from "@/components/BaseTemplate";
import { useMeDetailsQuery } from "@/saleor/api";
import { useRouter } from "next/router";

const Account: React.VFC = () => {
  const router = useRouter();
  const { data, loading } = useMeDetailsQuery();
  if (loading) {
    return <BaseTemplate isLoading={true} />;
  }
  if (!data?.me?.id) {
    router.push("/login");
    // todo: resolve issue with auth token not automatically added to the client
    // because application stuck in redirecting ATM
    // router.push({ pathname: "/login", query: { next: "/account" } });
    return null;
  }
  const user = data.me;
  return (
    <BaseTemplate>
      <div className="py-10">
        <header className="mb-4">
          <div className="max-w-7xl mx-auto px-8">Your account</div>
        </header>
        <main className="max-w-7xl mx-auto px-8">
          <p>{user.email}</p>
          <p>{user.firstName}</p>
          <p>{user.lastName}</p>
          <p>{user.dateJoined}</p>
          <p>{user.lastLogin}</p>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default Account;
