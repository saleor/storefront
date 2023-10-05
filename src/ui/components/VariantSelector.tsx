"use client";

import { clsx } from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId } from "react";

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

	const selectVariant = useCallback(
		(variantID: string, replace = false) => {
			const params = new URLSearchParams(searchParams);
			params.set("variant", variantID);

			const variantPathname = createPathname(pathname, params);
			if (replace) {
				router.replace(variantPathname, { scroll: false });
			} else {
				router.push(variantPathname, { scroll: false });
			}
		},
		[pathname, router, searchParams],
	);

	useEffect(() => {
		if (variants.length === 1) {
			selectVariant(variants[0].id, true);
		}
	}, [selectVariant, variants]);

	const generatedId = useId();

	return (
		<div className="my-4" role="radiogroup" aria-labelledby={`${generatedId}-title`}>
			<div className="sr-only" id={`${generatedId}-title`}>
				Variants
			</div>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{variants.length > 1 &&
					variants.map((variant) => {
						return (
							<label
								key={variant.id}
								htmlFor={`${generatedId}-variant-${variant.id}`}
								className={clsx(
									searchParams.get("variant") === variant.id
										? "border-transparent bg-slate-600 text-white hover:bg-slate-500"
										: "border-slate-200 bg-white text-slate-900 hover:bg-slate-100",
									"flex items-center justify-center overflow-hidden text-ellipsis rounded border p-3 text-center text-sm font-semibold focus-within:outline focus-within:outline-2",
								)}
							>
								<input
									type="radio"
									name="variant"
									id={`${generatedId}-variant-${variant.id}`}
									className="sr-only"
									onClick={() => {
										selectVariant(variant.id);
									}}
								/>
								{variant.name}
							</label>
						);
					})}
			</div>
		</div>
	);
}
