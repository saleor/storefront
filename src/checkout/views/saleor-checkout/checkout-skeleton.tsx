/**
 * Checkout loading skeleton.
 * Shows while checkout data is being fetched.
 */
export const CheckoutSkeleton = () => {
	return (
		<div className="min-h-screen bg-secondary">
			{/* Header skeleton */}
			<header className="bg-background md:border-b md:border-border">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<div className="h-5 w-20 animate-pulse rounded bg-muted" />
						<div className="hidden items-center gap-4 md:flex">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="flex items-center gap-2">
									<div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
									<div className="h-4 w-20 animate-pulse rounded bg-muted" />
								</div>
							))}
						</div>
						<div className="h-4 w-24 animate-pulse rounded bg-muted" />
					</div>
				</div>
			</header>

			{/* Content skeleton */}
			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
				<div className="flex flex-col gap-8 md:flex-row">
					{/* Left column - Form */}
					<div className="flex-1">
						<div className="rounded-lg border border-border bg-card p-6 md:p-8">
							<div className="space-y-8">
								{/* Express Checkout Section */}
								<div className="space-y-4">
									{/* Top divider with label */}
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t border-border" />
										</div>
										<div className="relative flex justify-center">
											<span className="bg-card px-4">
												<div className="h-3 w-28 animate-pulse rounded bg-muted" />
											</span>
										</div>
									</div>

									{/* Express payment buttons - 2 columns */}
									<div className="grid grid-cols-2 gap-3">
										<div className="h-12 animate-pulse rounded-md bg-muted" />
										<div className="h-12 animate-pulse rounded-md bg-muted" />
									</div>

									{/* Bottom divider with label */}
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t border-border" />
										</div>
										<div className="relative flex justify-center">
											<span className="bg-card px-4">
												<div className="h-3 w-32 animate-pulse rounded bg-muted" />
											</span>
										</div>
									</div>
								</div>

								{/* Contact Section */}
								<section className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="h-7 w-24 animate-pulse rounded bg-muted" />
										<div className="h-4 w-32 animate-pulse rounded bg-muted" />
									</div>
									{/* Email input */}
									<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
									{/* Checkboxes */}
									<div className="flex items-center gap-3">
										<div className="h-5 w-5 animate-pulse rounded bg-muted" />
										<div className="h-4 w-64 animate-pulse rounded bg-muted" />
									</div>
									<div className="flex items-center gap-3">
										<div className="h-5 w-5 animate-pulse rounded bg-muted" />
										<div className="h-4 w-48 animate-pulse rounded bg-muted" />
									</div>
								</section>

								{/* Shipping Address Section */}
								<section className="space-y-4">
									<div className="h-7 w-40 animate-pulse rounded bg-muted" />

									{/* Country selector */}
									<div className="space-y-1.5">
										<div className="h-4 w-28 animate-pulse rounded bg-muted" />
										<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
									</div>

									{/* Name row - First name / Last name */}
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div className="space-y-1.5">
											<div className="h-4 w-20 animate-pulse rounded bg-muted" />
											<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
										</div>
										<div className="space-y-1.5">
											<div className="h-4 w-20 animate-pulse rounded bg-muted" />
											<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
										</div>
									</div>

									{/* Address */}
									<div className="space-y-1.5">
										<div className="h-4 w-16 animate-pulse rounded bg-muted" />
										<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
									</div>

									{/* Apartment (optional) */}
									<div className="space-y-1.5">
										<div className="h-4 w-36 animate-pulse rounded bg-muted" />
										<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
									</div>

									{/* City / Postal code row */}
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div className="space-y-1.5">
											<div className="h-4 w-12 animate-pulse rounded bg-muted" />
											<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
										</div>
										<div className="space-y-1.5">
											<div className="h-4 w-24 animate-pulse rounded bg-muted" />
											<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
										</div>
									</div>

									{/* Phone */}
									<div className="space-y-1.5">
										<div className="h-4 w-32 animate-pulse rounded bg-muted" />
										<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
									</div>
								</section>

								{/* Continue button */}
								<div className="hidden h-14 w-full animate-pulse rounded-md bg-muted md:block" />
							</div>
						</div>
					</div>

					{/* Right column - Order Summary */}
					<div className="hidden md:block md:shrink-0 md:basis-[30%]">
						<div className="rounded-lg border border-border bg-card p-6">
							<div className="mb-4 h-6 w-28 animate-pulse rounded bg-muted" />
							<div className="space-y-3">
								{[1, 2].map((i) => (
									<div key={i} className="flex items-center gap-3">
										<div className="h-16 w-16 animate-pulse rounded bg-muted" />
										<div className="flex-1 space-y-2">
											<div className="h-4 w-full animate-pulse rounded bg-muted" />
											<div className="h-3 w-16 animate-pulse rounded bg-muted" />
										</div>
										<div className="h-4 w-16 animate-pulse rounded bg-muted" />
									</div>
								))}
							</div>
							<div className="mt-4 space-y-2 border-t border-border pt-4">
								<div className="flex justify-between">
									<div className="h-4 w-16 animate-pulse rounded bg-muted" />
									<div className="h-4 w-20 animate-pulse rounded bg-muted" />
								</div>
								<div className="flex justify-between">
									<div className="h-4 w-20 animate-pulse rounded bg-muted" />
									<div className="h-4 w-32 animate-pulse rounded bg-muted" />
								</div>
								<div className="flex justify-between pt-2">
									<div className="h-5 w-12 animate-pulse rounded bg-muted" />
									<div className="h-5 w-24 animate-pulse rounded bg-muted" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};
