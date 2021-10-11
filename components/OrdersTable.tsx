import { Order } from "@/saleor/api";

interface OrderTableProps {
  orders: Order[];
}
const OrderTable: React.VFC<OrderTableProps> = ({ orders }) => {
  return <div>OrdersTable</div>;
};

export default OrderTable;
