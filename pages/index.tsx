import BaseTemplate from "@/components/BaseTemplate";
import HomepageBlock from "@/components/HomepageBlock";
import { useMenuQuery } from "@/saleor/api";
import React from "react";

const Home: React.VFC = () => {
  const { data, loading } = useMenuQuery({ variables: { slug: "homepage" } });

  if (loading) {
    return <BaseTemplate isLoading={true} />;
  }

  return (
    <BaseTemplate>
      <div className="py-10">
        <header className="mb-4">
          <div className="max-w-7xl mx-auto px-8"></div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-8">
            {data?.menu?.items?.map((m) => {
              if (!!m) return <HomepageBlock key={m?.id} menuItem={m} />;
            })}
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default Home;
