import React from "react";
import { NavigationPanel } from "@/components/NavigationPanel";
import BaseTemplate from "@/components/BaseTemplate";
import { useRouter } from "next/router";
import { useAuthState } from "@saleor/sdk";

interface AccountBaseTemplateProps {
  children: React.ReactNode;
}

const AccountBaseTemplate: React.VFC<AccountBaseTemplateProps> = ({
  children,
}) => {
  const router = useRouter();
  const { authenticated, authenticating } = useAuthState();
  if (authenticating) {
    return <BaseTemplate isLoading={true} />;
  }

  if (!authenticated && process.browser) {
    router.push({
      pathname: "/account/login",
      query: { next: router?.pathname },
    });
    return null;
  }

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
            {children}
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default AccountBaseTemplate;
