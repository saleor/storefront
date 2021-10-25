import { OrderDetailsFragment } from "@/saleor/api";
import { useRouter } from "next/router";

interface OrdersTableProps {
  orders: OrderDetailsFragment[];
}
const OrdersTable: React.VFC<OrdersTableProps> = ({ orders }) => {
  const router = useRouter();

  return (
    <table className="w-full divide-y bg-white rounded-md ">
      <thead className="text-center h-16">
        <tr>
          <th className="w-1/4 font-semibold text-md">Number</th>
          <th className="w-1/4 font-semibold text-md">Creation Date</th>
          <th className="w-1/4 font-semibold text-md md:text-center hidden md:table-cell">
            Status
          </th>
          <th className="w-1/4 font-semibold text-md">Total</th>
        </tr>
      </thead>
      <tbody className="text-center divide-y">
        {orders?.map((order) => {
          return (
            <tr
              className="h-16 cursor-pointer"
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
              <td className="hidden md:table-cell">{order.status}</td>
              <td>{order.total.gross.localizedAmount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrdersTable;
