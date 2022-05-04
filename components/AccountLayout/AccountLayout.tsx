import { useAuthState } from "@saleor/sdk";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";

import { Layout, Spinner } from "@/components";
import { NavigationPanel } from "@/components/NavigationPanel";
import { usePaths } from "@/lib/paths";

export type AccountLayoutProps = PropsWithChildren<{}>;

export function AccountLayout({ children }: AccountLayoutProps) {
  const router = useRouter();
  const paths = usePaths();
  const { authenticated, authenticating } = useAuthState();
  if (authenticating) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (!authenticated && typeof window !== "undefined") {
    router.push(paths.account.login.$url({ query: { next: router?.pathname } }));
    return null;
  }

  return (
    <Layout>
      <div className="py-10">
        <main className="flex flex-col md:flex-row container px-8">
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
}
