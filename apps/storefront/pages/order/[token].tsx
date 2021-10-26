import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

import { Navbar } from "@/components";
import { useOrderDetailsQuery } from "@/saleor/api";
import { formatAsMoney } from "@/lib/util";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      orderToken: context.params?.token?.toString(),
    },
  };
};

const OrderDetailsPage = ({ orderToken }: InferGetStaticPropsType<typeof getStaticProps>) => {
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-8 px-8">
        <div className="grid grid-cols-2 gap-x-10 items-start">
          <p>
            Order #{order?.number} - {order?.statusDisplay}
          </p>
          <p>Lines: {order?.lines.length}</p>
          <p>
            Total:
            {formatAsMoney(
              order?.total.gross.amount,
              order?.total.gross.currency
            )}
          </p>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailsPage;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
