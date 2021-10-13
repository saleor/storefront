import { OrderDetailsFragment } from "@/saleor/api";
import { Button } from "@/components/Button";

interface OrdersTableProps {
  orders: OrderDetailsFragment[] | undefined;
}
const OrdersTable: React.VFC<OrdersTableProps> = ({ orders }) => {
  console.log(orders);
  return (
    <div className="container flex flex-col flex-1 items-center">
      <table className="rounded-xl w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th>Number</th>
            <th>Creation Date</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {orders?.map((order) => {
            return (
              <tr
                className="text-center divide-x divide-black bg-emerald-200 whitespace-normal"
                key={order.id}
                onClick={() => console.log("to order page")}
              >
                <td>{order?.number}</td>
                <td>{order.created.slice(0, 10)}</td>
                <td>{order.status}</td>
                <td>{order.total.gross.amount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button
        className="my-5 w-1/3 flex-none justify-self-center"
        onClick={() => console.log("load More")}
      >
        Load More
      </Button>
    </div>
  );
};

export default OrdersTable;
