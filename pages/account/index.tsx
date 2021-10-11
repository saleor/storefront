import BaseTemplate from "@/components/BaseTemplate";
import { useMeDetailsQuery } from "@/saleor/api";
import { useRouter } from "next/router";
import { NavigationPanel } from "@/components/NavigationPanel";
import React from "react";
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
      <div className="py-10">
        <header className="mb-4">
          <h1 className="max-w-7xl text-2xl mx-auto px-8">Account</h1>
        </header>
        <main className="flex max-w-7xl mx-auto px-8">
          <div className="flex-initial w-2/5">
            <NavigationPanel active={""} />
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default Account;
