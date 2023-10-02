import clsx from "clsx";
import Link from "next/link";
import { ProductsPerPage } from "@/lib";

export async function Pagination({ page: currentPage, total }: { page: number; total: number }) {
	const pages = Math.ceil(total / ProductsPerPage);

	return (
		<nav className="flex items-center justify-center border-t border-slate-200 px-4">
			<div className="hidden md:-mt-px md:flex ">
				{[...Array(pages).keys()].map((page) => (
					<Link
						key={page + 1}
						href={{ pathname: "/products", query: { page: page + 1 } }}
						className={clsx(
							currentPage === page + 1 && "border-slate-600 bg-slate-50 text-slate-600",
							"inline-flex items-center border-t-2 px-4 py-2 text-sm font-medium ",
						)}
						aria-current="page"
					>
						{page + 1}
					</Link>
				))}
			</div>
		</nav>
	);
}
