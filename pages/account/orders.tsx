import BaseTemplate from "@/components/BaseTemplate";
import { useOrdersQuery } from "@/saleor/api";
import { useAuthState } from "@saleor/sdk";
import OrdersTable from "@/components/OrdersTable";
import { Pagination } from "@/components/Pagination";

const OrdersPage: React.VFC = () => {
  const { authenticated } = useAuthState();
  const {
    data: ordersCollection,
    loading,
    error,
    fetchMore,
  } = useOrdersQuery({
    skip: !authenticated,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  if (loading) {
    return <BaseTemplate isLoading={true} />;
  }
  if (error) return <p>Error {error.message}</p>;

  const orders = ordersCollection?.me?.orders?.edges.map((order) => {
    return order.node;
  });

  const onLoadMore = async () => {
    await fetchMore({
      variables: {
        after: ordersCollection?.me?.orders?.pageInfo.endCursor,
      },
    });
  };

  return (
    <BaseTemplate>
      <div className="py-10">
        <header className="mb-4">
          <h1 className="max-w-7xl text-2xl mx-auto px-8">Account</h1>
        </header>
        <main className="flex max-w-7xl mx-auto px-8">
          <div className="flex-initial w-2/5">
            Navigation Panel
            {/* <NavigationPanel active={"Orders"} /> */}
          </div>
          <div className="border-r flex flex-auto flex-col px-4 pt-4 space-y-4 pb-4">
            <OrdersTable orders={orders} />
            <Pagination
              onLoadMore={onLoadMore}
              pageInfo={ordersCollection?.me?.orders?.pageInfo}
              itemCount={ordersCollection?.me?.orders?.edges.length}
              totalCount={ordersCollection?.me?.orders?.totalCount || undefined}
            />
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default OrdersPage;
