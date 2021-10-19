import { OrderDetailsFragment } from "@/saleor/api";
import { useRouter } from "next/router";

interface OrdersTableProps {
  orders: OrderDetailsFragment[];
}
const OrdersTable: React.VFC<OrdersTableProps> = ({ orders }) => {
  const router = useRouter();

  return (
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
              onClick={() =>
                router.push({
                  pathname: "/account/orders/[token]",
                  query: { token: order.token },
                })
              }
            >
              <td>{order?.number}</td>
              <td>{order.created.slice(0, 10)}</td>
              <td>{order.status}</td>
              <td>{order.total.gross.localizedAmount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrdersTable;
