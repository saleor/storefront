/**
 * Mirrors the sidebar + overview layout to prevent CLS.
 * animate-skeleton-delayed (defined in tailwind config) adds 300ms
 * visibility delay to avoid flash on fast loads.
 */
export function AccountSkeleton() {
	return (
		<div className="mx-auto max-w-6xl animate-skeleton-delayed px-4 py-8 opacity-0 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-8 md:flex-row">
				<aside className="hidden shrink-0 md:block md:w-52">
					<div className="flex flex-col">
						<div className="mb-8 h-4 w-24 animate-pulse rounded bg-muted" />
						<div className="mb-3 h-11 w-11 animate-pulse rounded-full bg-muted" />
						<div className="mb-1 h-5 w-28 animate-pulse rounded bg-muted" />
						<div className="mb-8 h-4 w-36 animate-pulse rounded bg-muted" />
						<div className="space-y-1">
							<div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
							<div className="bg-muted/50 h-10 w-full animate-pulse rounded-lg" />
							<div className="bg-muted/50 h-10 w-full animate-pulse rounded-lg" />
							<div className="bg-muted/50 h-10 w-full animate-pulse rounded-lg" />
						</div>
					</div>
				</aside>

				<div className="flex gap-2 overflow-hidden md:hidden">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="h-10 w-24 shrink-0 animate-pulse rounded-lg bg-muted" />
					))}
				</div>

				<div className="min-w-0 flex-1 space-y-8">
					<div>
						<div className="h-8 w-56 animate-pulse rounded bg-muted" />
						<div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
					</div>

					<div>
						<div className="mb-4 flex items-center justify-between">
							<div className="h-6 w-32 animate-pulse rounded bg-muted" />
							<div className="h-4 w-16 animate-pulse rounded bg-muted" />
						</div>
						<div className="space-y-2">
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center gap-4 rounded-lg border p-4">
									<div className="flex -space-x-2">
										<div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
									</div>
									<div className="flex-1 space-y-1.5">
										<div className="h-4 w-28 animate-pulse rounded bg-muted" />
										<div className="h-3 w-20 animate-pulse rounded bg-muted" />
									</div>
									<div className="flex items-center gap-3">
										<div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
										<div className="h-4 w-14 animate-pulse rounded bg-muted" />
									</div>
								</div>
							))}
						</div>
					</div>

					<div>
						<div className="mb-4 flex items-center justify-between">
							<div className="h-6 w-36 animate-pulse rounded bg-muted" />
							<div className="h-4 w-16 animate-pulse rounded bg-muted" />
						</div>
						<div className="rounded-lg border p-4">
							<div className="space-y-2">
								<div className="h-5 w-24 animate-pulse rounded bg-muted" />
								<div className="h-4 w-40 animate-pulse rounded bg-muted" />
								<div className="h-4 w-32 animate-pulse rounded bg-muted" />
								<div className="h-4 w-36 animate-pulse rounded bg-muted" />
								<div className="h-4 w-28 animate-pulse rounded bg-muted" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
