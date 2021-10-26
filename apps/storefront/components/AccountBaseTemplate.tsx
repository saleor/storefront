import React from "react";
import { useRouter } from "next/router";
import { useAuthState } from "@saleor/sdk";

import { NavigationPanel } from "@/components/NavigationPanel";
import { BaseTemplate } from "@/components";

interface AccountBaseTemplateProps {
  children: React.ReactNode;
}

export const AccountBaseTemplate = ({ children }: AccountBaseTemplateProps) => {
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
        <main className="flex flex-col md:flex-row max-w-7xl mx-auto px-8">
          <div className="mb-2 flex-initial md:w-3/5">
            <NavigationPanel />
          </div>
          <div className="flex flex-initial w-full flex-col overflow-y-auto md:px-4 space-y-4">
            {children}
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

