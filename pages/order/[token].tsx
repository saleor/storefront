import { CheckIcon } from "@heroicons/react/outline";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Link from "next/link";
import React from "react";

import { BaseTemplate } from "@/components";
import { useOrderDetailsQuery } from "@/saleor/api";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      orderToken: context.params?.token?.toString(),
    },
  };
};

const OrderDetailsPage = ({
  orderToken,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { loading, error, data } = useOrderDetailsQuery({
    variables: { token: orderToken || "" },
    skip: !orderToken,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!data || !data.orderByToken) {
    return null;
  }

  const order = data.orderByToken;

  return (
    <BaseTemplate>
      <main className="max-w-7xl mx-auto pt-8 px-8">
        <CheckIcon className="text-green-700" />
        <div className="font-semibold text-3xl">Your order is completed!</div>
        <p className="mt-3  ">Order number: #{order?.number}</p>
        <p className="mt-2">
          To check the other details,
          <Link href={`/account/orders/${orderToken}`}> click here.</Link>
        </p>
      </main>
    </BaseTemplate>
  );
};

export default OrderDetailsPage;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
