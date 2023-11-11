import dynamic from "next/dynamic";

const OrderList = dynamic(() => import("../../../ui/components/OrderList"), { ssr: false });

export default function OrderPage() {
	return <OrderList />;
}
