import clsx from "clsx";
import React, { type PropsWithChildren } from "react";
import { type Classes } from "@/checkout/src/lib/globalTypes";
import { Text } from "@/checkout/ui-kit";

export const Title: React.FC<PropsWithChildren<Classes>> = ({ className, children }) => (
	<Text className={clsx("mb-2", className)} weight="bold">
		{children}
	</Text>
);
