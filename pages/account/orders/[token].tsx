import BaseTemplate from "@/components/BaseTemplate";
import AddressDisplay from "@/components/checkout/AddressDisplay";
import { useOrderDetailsByTokenQuery } from "@/saleor/api";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      token: context.params?.token?.toString(),
    },
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

const OrderDetailsPage: React.VFC<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ token }) => {
  const { loading, error, data } = useOrderDetailsByTokenQuery({
    variables: { token: "53d82eb1-b2e7-40dc-91ac-fb62abac0d4c" },
    skip: !token,
  });

  if (loading) return <BaseTemplate isLoading={true}></BaseTemplate>;
  if (error) return <div>Error : {error.message}</div>;
  if (!data) {
    return null;
  }
  let order = data?.orderByToken;

  return (
    <BaseTemplate>
      <div className="flex flex-col max-w-7xl h-full justify-between mb-20 mt-10 ml-28">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Your order number : {order?.number}
        </h1>
        <h1 className="text-1xl font-semibold text-gray-600 mb-4">
          Status : {order?.status}
        </h1>
        <table className="w-full divide-y">
          <thead className="bg-gray-50 text-center">
            <tr>
              <td className="w-1/4 font-semibold text-md">Items</td>
              <td className="w-1/4 font-semibold text-md">Price</td>
              <td className="w-1/4 font-semibold text-md">Quantity</td>
              <td className="w-1/4 font-semibold text-md">Total</td>
            </tr>
          </thead>
          <tbody className="text-center divide-y">
            {order?.lines.map((line) => {
              return (
                <tr key={line?.id} className="divide-y">
                  <td>{line?.productName}</td>
                  <td>{line?.unitPrice.gross.localizedAmount}</td>
                  <td>{line?.quantity}</td>
                  <td>{line?.totalPrice.gross.localizedAmount}</td>
                </tr>
              );
            })}
            <tr></tr>
            <tr className=" text-center font-semibold text-md mt-5">
              <td className="">Subtotal</td>
              <td></td>
              <td></td>
              <td>{order?.subtotal.net.localizedAmount}</td>
            </tr>
            <tr className=" text-center font-semibold text-md">
              <td className="">Shipping Price</td>
              <td></td>
              <td></td>
              <td>{order?.shippingPrice.gross.localizedAmount}</td>
            </tr>
            <tr className=" text-center font-semibold text-md">
              <td className="">Total</td>
              <td></td>
              <td></td>
              <td>{order?.total.gross.localizedAmount}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex flex-row mt-5">
          {!!order?.billingAddress && (
            <div className="mt-5 checkout-section-container mr-5">
              <h2 className="font-semibold">Billing Address </h2>
              <AddressDisplay address={order.billingAddress}></AddressDisplay>
            </div>
          )}
          {!!order?.shippingAddress && (
            <div className="mt-5 checkout-section-container">
              <h2 className="font-semibold">Shipping Address </h2>
              <AddressDisplay address={order.shippingAddress}></AddressDisplay>
            </div>
          )}
        </div>
      </div>
    </BaseTemplate>
  );
};

export default OrderDetailsPage;
