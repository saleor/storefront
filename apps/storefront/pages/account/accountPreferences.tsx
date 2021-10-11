import React from "react";
import { NavigationPanel } from "@/components/NavigationPanel";
import BaseTemplate from "@/components/BaseTemplate";
import { useMeDetailsQuery } from "@/saleor/api";
import { useRouter } from "next/router";
import { EmailPreferences } from "../../components/accountPreferences/EmailPreferences";
import { PasswordPreferences } from "../../components/accountPreferences/PasswordPreferences";

const AccountPreferencesPage: React.VFC<any> = ({}) => {
  const router = useRouter();
  const { data, loading } = useMeDetailsQuery();
  if (loading) {
    return <BaseTemplate isLoading={true} />;
  }
  if (!data?.me?.id) {
    router.push("/account/login");
    // todo: resolve issue with auth token not automatically added to the client
    // because application stuck in redirecting ATM
    // router.push({
    //   pathname: "/account/login",
    //   query: { next: "/account/accountPreferences" },
    // });
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
            <NavigationPanel active={"AccountPreferences"} />
          </div>
          <div className="border-r flex flex-auto flex-col overflow-y-auto px-4 pt-4 space-y-4 pb-4">
            <div className="checkout-section-container">
              <EmailPreferences />
            </div>
            <div className="checkout-section-container">
              <PasswordPreferences />
            </div>
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default AccountPreferencesPage;
