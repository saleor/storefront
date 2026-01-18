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

function FooterSkeleton() {
	return (
		<footer className="border-t border-border bg-card py-8">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="h-20 animate-pulse rounded bg-muted" />
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
