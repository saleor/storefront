import BaseTemplate from "@/components/BaseTemplate";
import { useOrdersQuery } from "@/saleor/api";
//import { NavigationPanel } from "@/components/NavigationPanel";

const OrdersPage: React.VFC = () => {
  const { data: ordersCollection, loading, error } = useOrdersQuery();

  if (loading) {
    return <BaseTemplate isLoading={true} />;
  }

  if (error) return <p>Error {error.message}</p>;

  const orders = ordersCollection?.me?.orders;

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
            <div>Orders Component goes here</div>
            {console.log(orders)}
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default OrdersPage;
