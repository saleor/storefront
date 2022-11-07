import { useAuthState } from "@saleor/sdk";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/legacy/image";
import { ReactElement } from "react";

import { AccountLayout, Spinner } from "@/components";
import { AddressDisplay } from "@/components/checkout/AddressDisplay";
import { useRegions } from "@/components/RegionsProvider";
import { useOrderDetailsByTokenQuery } from "@/saleor/api";

export const getStaticProps = async (context: GetStaticPropsContext) => ({
  props: {
    token: context.params?.token?.toString(),
  },
});

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function OrderDetailsPage({ token }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { formatPrice } = useRegions();
  const { authenticated } = useAuthState();
  const { loading, error, data } = useOrderDetailsByTokenQuery({
    variables: { token: token! },
    skip: !token || !authenticated,
  });

  if (loading) return <Spinner />;
  if (error) {
    return <div>Error :{error.message}</div>;
  }

  if (!data || !data.orderByToken) {
    return null;
  }
  const order = data.orderByToken;

  return (
    <>
      <h1 className="text-2xl ml-2 md:ml-20 mt-5 font-bold text-gray-800 mb-2">
        Your order number : {order?.number}
      </h1>
      <h1 className="text-1xl ml-2 md:ml-20 font-semibold text-gray-600 mb-4">
        Status : {order?.status}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 mb-20 mt-10 ml-2 md:ml-20 max-w-6xl h-full">
        <div className="col-span-2 md:col-span-4">
          <table className="w-full divide-y table-fixed">
            <thead className="text-center">
              <tr>
                <td className="md:w-1/4 font-semibold text-md md:text-center text-left">Items</td>
                <td className="md:w-1/4 font-semibold text-md">Price</td>
                <td className="md:w-1/4 font-semibold text-md">Quantity</td>
                <td className="md:w-1/4 font-semibold text-md text-right">
                  <p className="mr-3 md:mr-10">Total</p>
                </td>
              </tr>
            </thead>
            <tbody className="text-center divide-y">
              {order?.lines.map((line) => (
                <tr key={line?.id} className="h-16">
                  <td className="my-3">
                    <div className="flex flex-row justify-center">
                      <Image
                        src={line?.thumbnail?.url || "/"}
                        alt={line?.thumbnail?.alt || " "}
                        width={70}
                        height={70}
                      />
                      <div className="flex flex-col justify-center">
                        <div>{line?.productName}</div>
                        <div className="text-xs text-left text-gray-600">{line?.variantName}</div>
                      </div>
                    </div>
                  </td>
                  <td>{formatPrice(line?.unitPrice.gross)}</td>
                  <td>{line?.quantity}</td>
                  <td>
                    <p className="mr-3 md:mr-10 text-right">
                      {formatPrice(line?.totalPrice.gross)}
                    </p>
                  </td>
                </tr>
              ))}
              <tr />
            </tbody>
          </table>
        </div>
        <div className="md:col-start-3 text-md h-16">
          <div className="mt-5 text-left md:text-center">Subtotal</div>
        </div>
        <div className="text-md text-center">
          <p className="mt-5 text-right mr-3 md:mr-10">{formatPrice(order?.subtotal.net)}</p>
        </div>
        <div className="md:col-start-3 col-span-2 border-t" />
        <div className="md:col-start-3 text-md h-16">
          <div className="mt-5 text-left md:text-center">Shipping Price</div>
        </div>
        <div className="text-md text-center">
          <p className="mt-5 text-right mr-3 md:mr-10">{formatPrice(order?.shippingPrice.gross)}</p>
        </div>
        <div className="md:col-start-3 col-span-2 border-t" />
        <div className="md:col-start-3 text-md font-semibold h-16">
          <div className="mt-5 text-left md:text-center">Total</div>
        </div>
        <div className="text-md font-semibold text-center">
          <p className="mt-5 text-right mr-3 md:mr-10">{formatPrice(order?.total.gross)}</p>
        </div>

        {!!order?.billingAddress && (
          <div className="col-span-2 mr-2 my-2 p-4 rounded shadow-xs bg-white border md:w-1/2 md:col-span-2 md:w-full">
            <h2 className="font-semibold text-lg mb-2">Billing Address </h2>
            <AddressDisplay address={order.billingAddress} />
          </div>
        )}

        {!!order?.shippingAddress && (
          <div className="col-span-2 mr-2 md:ml-2 my-2 p-4 shadow-xs rounded bg-white border md:w-1/2 md:col-start-3 md:col-span-2 md:w-full">
            <h2 className="font-semibold text-lg mb-2">Shipping Address </h2>
            <AddressDisplay address={order.shippingAddress} />
          </div>
        )}
      </div>
    </>
  );
}

export default OrderDetailsPage;

OrderDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};
