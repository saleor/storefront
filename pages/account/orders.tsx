import { useOrdersQuery } from "@/saleor/api";
import OrdersTable from "@/components/OrdersTable";
import { Pagination } from "@/components/Pagination";
import AccountBaseTemplate from "@/components/AccountBaseTemplate";
import Spinner from "@/components/Spinner";
import { useAuthState } from "@saleor/sdk";

const OrdersPage: React.VFC = () => {
  const { authenticated } = useAuthState();
  const {
    data: ordersCollection,
    loading,
    error,
    fetchMore,
  } = useOrdersQuery({
    skip: !authenticated,
  });

  if (loading) {
    return (
      <AccountBaseTemplate>
        <Spinner />
      </AccountBaseTemplate>
    );
  }

  if (error) return <p>Error {error.message}</p>;

  const orders =
    ordersCollection?.me?.orders?.edges.map((order) => {
      return order.node;
    }) || [];

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: ordersCollection?.me?.orders?.pageInfo.endCursor,
      },
    });
  };

  return (
    <AccountBaseTemplate>
      <OrdersTable orders={orders} />
      <Pagination
        onLoadMore={onLoadMore}
        pageInfo={ordersCollection?.me?.orders?.pageInfo}
        itemCount={ordersCollection?.me?.orders?.edges.length}
        totalCount={ordersCollection?.me?.orders?.totalCount || undefined}
      />
    </AccountBaseTemplate>
  );
};

export default OrdersPage;
