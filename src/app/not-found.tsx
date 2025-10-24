import Image from "next/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { Header } from "@/ui/components/Header";
import { Footer } from "@/ui/components/Footer";
import NotFoundImage from "@/images/404.jpg";

export const metadata: Metadata = {
	title: "Page Not Found | 404",
	description:
		"The page you're looking for doesn't exist. Please check the URL or return to the homepage.",
};

export default function NotFound() {
	return (
		<>
			<Header />
			<div className="flex min-h-[calc(100dvh-5rem)] flex-col">
				<main id="main-content" className="flex-1" role="main">
					<section className="pb-12 pt-32">
						<div className="mx-auto max-w-7xl px-6 lg:px-12">
							<div className="relative isolate flex flex-col items-start overflow-hidden bg-black p-8 lg:p-12">
								{/* Background Image */}
								<Image
									src={NotFoundImage}
									alt="404 background"
									fill
									className="absolute inset-0 -z-10 size-full object-cover object-top"
									priority
								/>

								{/* Gradient Overlay */}
								<div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/95 to-black/20" />

								{/* Content */}
								<div className="flex h-full flex-col justify-between gap-20 text-white lg:gap-10">
									{/* Header Section */}
									<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
										{/* Large 404 */}
										<h3 className="row-start-1 font-display text-8xl font-light text-white md:text-9xl">
											404
										</h3>

										{/* Main Message */}
										<div className="font-light lg:col-span-2">
											<p className="text-xl">
												Oops! It looks like you ended up in the wrong place.{" "}
												<span className="italic text-base-200">
													Don&apos;t worry, we&apos;re nice and we put a button to take you
													back to safe shores.
												</span>
											</p>
										</div>

										{/* Extended Description */}
										<div className="col-span-full lg:row-start-2">
											<h3 className="indent-8 font-display text-4xl font-light leading-tight tracking-tight text-white lg:indent-48 lg:text-5xl lg:leading-tight">
												Feel free to head back to our homepage to explore our latest news and
												products.
											</h3>
											<p className="mt-4 text-base-300">
												Still stuck or found a bug? Reach out to us, and we&apos;ll help you get
												back on track.
											</p>
										</div>
									</div>

									{/* CTA Button */}
									<div className="lg:ml-auto">
										<LinkWithChannel
											href="/"
											className="btn-primary inline-block px-8 py-3 text-lg"
											aria-label="Return to homepage"
										>
											Go back home
										</LinkWithChannel>
									</div>
								</div>
							</div>
						</div>
					</section>
				</main>
				<Suspense
					fallback={
						<footer className="mt-24 border-t border-base-900 bg-base-950">
							<div className="mx-auto max-w-7xl px-6 lg:px-12">
								<div className="grid grid-cols-1 gap-12 py-20 md:grid-cols-3 md:gap-16">
									<div className="h-32 animate-pulse rounded bg-base-800" />
									<div className="h-32 animate-pulse rounded bg-base-800" />
									<div className="h-32 animate-pulse rounded bg-base-800" />
								</div>
							</div>
						</footer>
					}
				>
					<Footer />
				</Suspense>
			</div>
		</>
	);
}
