import BaseTemplate from "@/components/BaseTemplate";
import AddressDisplay from "@/components/checkout/AddressDisplay";
import { useOrderDetailsByTokenQuery } from "@/saleor/api";
import { useAuthState } from "@saleor/sdk";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/image";

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
  const { authenticated } = useAuthState();
  const { loading, error, data } = useOrderDetailsByTokenQuery({
    variables: { token: token },
    skip: !token || !authenticated,
  });

  if (loading) return <BaseTemplate isLoading={true}></BaseTemplate>;
  if (error) return <div>Error : {error.message}</div>;
  if (!data) {
    return null;
  }
  let order = data?.orderByToken;

  return (
    <BaseTemplate>
      <h1 className="text-2xl ml-20 mt-5 font-bold text-gray-800 mb-2">
        Your order number : {order?.number}
      </h1>
      <h1 className="text-1xl ml-20 font-semibold text-gray-600 mb-4">
        Status : {order?.status}
      </h1>
      <div className="grid grid-cols-4 mb-20 mt-10 ml-20 max-w-7xl h-full">
        <div className="col-span-4">
          <table className="w-full divide-y">
            <thead className="text-center">
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
                  <tr key={line?.id} className="h-16">
                    <td className="my-3">
                      <div className="flex flex-row justify-center">
                        <Image
                          src={line?.thumbnail?.url || "/"}
                          alt={line?.thumbnail?.alt || " "}
                          width={70}
                          height={70}
                        ></Image>
                        <div className="flex flex-col justify-center">
                          <div>{line?.productName}</div>
                          <div className="text-xs text-gray-600">
                            {line?.variantName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{line?.unitPrice.gross.localizedAmount}</td>
                    <td>{line?.quantity}</td>
                    <td>{line?.totalPrice.gross.localizedAmount}</td>
                  </tr>
                );
              })}
              <tr />
            </tbody>
          </table>
        </div>
        <div className="text-md font-semibold h-16">
          <div className="mt-5 text-center">Subtotal</div>
        </div>
        <div className="text-md font-semibold col-start-4 text-center">
          <p className="mt-5 text-center">
            {order?.subtotal.net.localizedAmount}
          </p>
        </div>
        <div className="col-span-4 border-b"></div>
        <div className="text-md font-semibold text-center h-16">
          <p className="mt-5 text-center">Shipping Prince</p>
        </div>
        <div className="text-md font-semibold col-start-4 text-center">
          <p className="mt-5 text-center">
            {order?.shippingPrice.gross.localizedAmount}
          </p>
        </div>
        <div className="col-span-4 border-b"></div>
        <div className="my-3 text-md font-semibold text-center">Total</div>
        <div className="my-3 text-md font-semibold col-start-4 text-center">
          {order?.total.gross.localizedAmount}
        </div>

        {!!order?.billingAddress && (
          <div className="mx-5 my-1 checkout-section-container shadow-md">
            <h2 className="font-semibold">Billing Address </h2>
            <AddressDisplay address={order.billingAddress}></AddressDisplay>
          </div>
        )}

        {!!order?.shippingAddress && (
          <div className="mx-5 my-1 checkout-section-container shadow-md">
            <h2 className="font-semibold">Shipping Address </h2>
            <AddressDisplay address={order.shippingAddress}></AddressDisplay>
          </div>
        )}
      </div>
    </BaseTemplate>
  );
};

export default OrderDetailsPage;

{
  /* <div className="flex flex-col max-w-7xl h-full justify-between mb-20 mt-10 ml-28">

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
</div> */
}
