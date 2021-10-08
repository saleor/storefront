import BaseTemplate from "@/components/BaseTemplate";
import { useMeDetailsQuery } from "@/saleor/api";
import { useRouter } from "next/router";
import { AccountPreferences } from "@/components/accountPreferences/AccountPreferences";

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
    //router.push({ pathname: "/account/login", query: { next: "/account" } });
    return null;
  }
  const user = data.me;
  return (
    <BaseTemplate>
      <div>
        <header className="mb-4 pt-5">
          <div className="max-w-7xl mx-auto px-8">Your account</div>
        </header>
        <main className="flex max-w-7xl mx-auto px-8">
          <div className="flex-1">
            <p>{user.email}</p>
            <p>{user.firstName}</p>
            <p>{user.lastName}</p>
            <p>{user.dateJoined}</p>
            <p>{user.lastLogin}</p>
          </div>

          <div className="flex-1 justify-end">
            <AccountPreferences />
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default Account;
