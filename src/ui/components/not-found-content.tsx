import Link from "next/link";
import { Search, Home } from "lucide-react";
import { buttonClassName } from "@/ui/components/ui/button";

/** Shared 404 UI for per-root-group `not-found.tsx` boundaries. */
export function NotFoundContent() {
	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
			<div className="mx-auto max-w-md text-center">
				<span className="mb-4 inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
					404
				</span>

				<h1 className="mb-2 text-balance text-h1 text-foreground">Page Not Found</h1>

				<p className="mb-8 text-muted-foreground">
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>

				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link href="/" className={buttonClassName({ asLink: true })}>
						<Home className="h-4 w-4" />
						Go Home
					</Link>

					<Link href="/products" className={buttonClassName({ asLink: true, variant: "outline-solid" })}>
						<Search className="h-4 w-4" />
						Browse Products
					</Link>
				</div>
			</div>
		</div>
	);
}
