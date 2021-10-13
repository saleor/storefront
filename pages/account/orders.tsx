import BaseTemplate from "@/components/BaseTemplate";
import { useOrdersQuery } from "@/saleor/api";
import { useAuthState } from "@saleor/sdk";
import OrdersTable from "@/components/OrdersTable";

const OrdersPage: React.VFC = () => {
  const { authenticated } = useAuthState();
  const {
    data: ordersCollection,
    loading,
    error,
  } = useOrdersQuery({ skip: !authenticated });

  if (loading) {
    return <BaseTemplate isLoading={true} />;
  }

  if (error) return <p>Error {error.message}</p>;

  const orders = ordersCollection?.me?.orders?.edges.map((order) => {
    return order.node;
  });

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
          <div className="border-r flex flex-auto flex-col overflow-y-auto px-4 pt-4 space-y-4 pb-4">
            <OrdersTable orders={orders} />
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default OrdersPage;
