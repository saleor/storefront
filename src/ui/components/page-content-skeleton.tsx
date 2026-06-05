export function PageContentSkeleton() {
	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			<div className="h-9 w-2/3 max-w-lg animate-pulse rounded bg-secondary" />
			<div className="prose mt-6 space-y-3">
				<div className="h-4 w-full animate-pulse rounded bg-secondary" />
				<div className="h-4 w-full animate-pulse rounded bg-secondary" />
				<div className="h-4 w-5/6 animate-pulse rounded bg-secondary" />
			</div>
		</div>
	);
}
