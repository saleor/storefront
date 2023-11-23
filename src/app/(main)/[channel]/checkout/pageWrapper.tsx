"use client";

import dynamic from "next/dynamic";

const Root = dynamic(() => import("@/checkout/Root").then((m) => m.Root), { ssr: false });

export const RootWrapper = ({ saleorApiUrl }: { saleorApiUrl: string }) => {
	if (!saleorApiUrl) {
		return null;
	}
	return <Root saleorApiUrl={saleorApiUrl} />;
};
