"use client";

import { clsx } from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const createPathname = (pathname: string, params: URLSearchParams) => {
	const paramsString = params.toString();
	const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

	return `${pathname}${queryString}`;
};

export function VariantSelector(props: { variants: { id: string; name: string }[] }) {
	const { variants } = props;

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	function selectVariant(variantID: string, replace = false) {
		const params = new URLSearchParams(searchParams);
		params.set("variant", variantID);

		const variantPathname = createPathname(pathname, params);
		if (replace) {
			router.replace(variantPathname, { scroll: false });
		} else {
			router.push(variantPathname, { scroll: false });
		}
	}

	if (variants.length === 1) {
		selectVariant(variants[0].id, true);
	}

	return (
		<div className="my-4">
			<div className="sr-only">Variants</div>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{variants.length > 1 &&
					variants.map((variant) => {
						return (
							<button
								key={variant.id}
								type="button"
								onClick={() => {
									selectVariant(variant.id);
								}}
								className={clsx(
									searchParams.get("variant") === variant.id
										? "border-transparent bg-slate-600 text-white hover:bg-slate-500"
										: "border-slate-200 bg-white text-slate-900 hover:bg-slate-100",
									"block overflow-hidden text-ellipsis rounded border p-3 text-sm font-semibold",
								)}
							>
								{variant.name}
							</button>
						);
					})}
			</div>
		</div>
	);
}
