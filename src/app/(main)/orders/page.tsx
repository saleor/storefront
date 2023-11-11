import dynamic from "next/dynamic";

export default function OrderPage() {
	const OrderList = dynamic(() => import("../../../ui/components/OrderList"), { ssr: false });

	return <OrderList />;
}
