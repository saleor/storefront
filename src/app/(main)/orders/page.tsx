"use client";

import dynamic from "next/dynamic";

const OrderList = dynamic(() => import("../../../ui/components/OrderList").then((m) => m.OrderList), {
	ssr: false,
});

export default function OrderPage() {
	return <OrderList />;
}
