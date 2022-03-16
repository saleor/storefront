import { CheckIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React, { ReactElement } from "react";

import { Layout } from "@/components";
import { usePaths } from "@/lib/paths";

const OrderCompletedPage = () => {
  const paths = usePaths();

  return (
    <main className="max-w-7xl mx-auto pt-8 px-8">
      <CheckIcon className="text-green-700" />
      <div className="font-semibold text-3xl">Your order is completed!</div>
      <p className="mt-2">
        <Link href={paths.$url()}>Go back to homepage</Link>
      </p>
    </main>
  );
};

export default OrderCompletedPage;

OrderCompletedPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
