import { useAuthState } from "@saleor/sdk";
import { useRouter } from "next/router";
import React from "react";

import { Layout, Spinner } from "@/components";
import { NavigationPanel } from "@/components/NavigationPanel";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  const router = useRouter();
  const { authenticated, authenticating } = useAuthState();
  if (authenticating) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (!authenticated && process.browser) {
    router.push({
      pathname: "/account/login",
      query: { next: router?.pathname },
    });
    return null;
  }

  return (
    <Layout>
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
    </Layout>
  );
};
