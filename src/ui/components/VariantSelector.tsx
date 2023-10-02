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

	return (
		<div className="my-4">
			<div className="sr-only">Variant</div>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{variants.map((variant) => {
					// searchParams is `Readonly`
					const params = new URLSearchParams(searchParams);
					params.set("variant", variant.id);

					const variantPathname = createPathname(pathname, params);

					return (
						<button
							key={variant.id}
							type="button"
							onClick={() => {
								router.replace(variantPathname, { scroll: false });
							}}
							className={clsx(
								searchParams.get("variant") === variant.id
									? "border-transparent bg-slate-600 text-white hover:bg-slate-500"
									: "border-slate-200 bg-white text-slate-900 hover:bg-slate-100",
								"flex items-center justify-center rounded border p-3 text-sm font-semibold uppercase",
							)}
							// disabled={!size.inStock}
						>
							{variant.name}
						</button>
					);
				})}
			</div>
		</div>
	);
}
