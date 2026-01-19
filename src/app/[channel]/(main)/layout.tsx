import { type ReactNode, Suspense } from "react";
import { Footer } from "@/ui/components/footer";
import { Header } from "@/ui/components/header";
import { CartProvider, CartDrawerWrapper } from "@/ui/components/cart";
import { AuthProvider } from "@/lib/auth";
import { brandConfig } from "@/config/brand";
import { Logo } from "@/ui/components/shared/logo";

export const metadata = {
	title: brandConfig.siteName,
	description: brandConfig.description,
};

function HeaderSkeleton() {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-4">
					<div className="flex shrink-0 items-center">
						<Logo className="h-7 w-auto" />
					</div>
					<div className="hidden flex-1 justify-center md:flex">
						<div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-secondary" />
					</div>
					<div className="flex items-center gap-1">
						<div className="h-10 w-10" />
						<div className="h-10 w-10" />
					</div>
				</div>
			</div>
		</header>
	);
}

/**
 * Footer skeleton that matches actual footer dimensions to prevent CLS.
 * Matches: pb-24 pt-12 sm:pb-12 lg:py-16 from Footer component.
 * Uses delayed visibility to avoid flash on fast loads.
 */
function FooterSkeleton() {
	return (
		<footer className="animate-skeleton-delayed bg-foreground text-background opacity-0">
			<div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-12 lg:px-8 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					{/* Brand column */}
					<div className="col-span-2 md:col-span-1">
						<div className="mb-4 h-7 w-24 animate-pulse rounded bg-neutral-700" />
						<div className="mt-4 space-y-2">
							<div className="h-4 w-full max-w-xs animate-pulse rounded bg-neutral-700" />
							<div className="h-4 w-3/4 max-w-xs animate-pulse rounded bg-neutral-700" />
						</div>
					</div>
					{/* Link columns */}
					{[1, 2, 3].map((i) => (
						<div key={i} className="hidden md:block">
							<div className="mb-4 h-4 w-20 animate-pulse rounded bg-neutral-700" />
							<div className="space-y-3">
								{[1, 2, 3, 4].map((j) => (
									<div key={j} className="h-4 w-24 animate-pulse rounded bg-neutral-700" />
								))}
							</div>
						</div>
					))}
				</div>
				{/* Bottom bar */}
				<div className="mt-12 flex items-center justify-between border-t border-neutral-800 pt-8">
					<div className="h-3 w-32 animate-pulse rounded bg-neutral-700" />
					<div className="flex gap-6">
						<div className="h-3 w-20 animate-pulse rounded bg-neutral-700" />
						<div className="h-3 w-24 animate-pulse rounded bg-neutral-700" />
					</div>
				</div>
			</div>
		</footer>
	);
}

export default async function RootLayout(props: {
	children: ReactNode;
	params: Promise<{ channel: string }>;
}) {
	const channel = (await props.params).channel;

	return (
		<AuthProvider>
			<CartProvider>
				<Suspense fallback={<HeaderSkeleton />}>
					<Header channel={channel} />
				</Suspense>
				<div className="flex min-h-[calc(100dvh-64px)] flex-col">
					<main className="flex-1">
						<Suspense>{props.children}</Suspense>
					</main>
					<Suspense fallback={<FooterSkeleton />}>
						<Footer channel={channel} />
					</Suspense>
				</div>
				<Suspense fallback={null}>
					<CartDrawerWrapper channel={channel} />
				</Suspense>
			</CartProvider>
		</AuthProvider>
	);
}
