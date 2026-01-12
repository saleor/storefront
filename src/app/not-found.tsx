import Link from "next/link";
import { Search, Home } from "lucide-react";

/**
 * Global 404 page.
 *
 * Shown when a route doesn't exist.
 */
export default function NotFound() {
	const buttonBase =
		"inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring";

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
			<div className="mx-auto max-w-md text-center">
				{/* 404 Badge */}
				<span className="mb-4 inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
					404
				</span>

				{/* Heading */}
				<h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Page Not Found</h1>

				{/* Message */}
				<p className="mb-8 text-muted-foreground">
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>

				{/* Actions */}
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link href="/" className={`${buttonBase} hover:bg-primary/90 bg-primary text-primary-foreground`}>
						<Home className="h-4 w-4" />
						Go Home
					</Link>

					<Link
						href="/products"
						className={`${buttonBase} border border-input bg-background hover:bg-accent hover:text-accent-foreground`}
					>
						<Search className="h-4 w-4" />
						Browse Products
					</Link>
				</div>
			</div>
		</div>
	);
}
