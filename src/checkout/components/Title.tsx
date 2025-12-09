import clsx from "clsx";
import type { FC, PropsWithChildren } from "react";
import { type Classes } from "@/checkout/lib/globalTypes";

export const Title: FC<PropsWithChildren<Classes>> = ({ className, children }) => (
	<p className={clsx("mb-2 font-bold", className)}>{children}</p>
);
