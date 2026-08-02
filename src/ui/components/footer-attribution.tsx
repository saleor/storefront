const attributionLinkClass = "text-inverse-subtle transition-colors hover:text-inverse";

/** Paper storefront attribution — remove or edit when forking for a custom brand. */
export function FooterAttribution() {
	return (
		<p className="text-xs text-inverse-muted">
			Powered by{" "}
			<a href="https://saleor.io/" target="_blank" rel="noopener noreferrer" className={attributionLinkClass}>
				Saleor
			</a>{" "}
			and{" "}
			<a
				href="https://github.com/saleor/storefront"
				target="_blank"
				rel="noopener noreferrer"
				className={attributionLinkClass}
			>
				Paper
			</a>
			. Built for humans and AI.
		</p>
	);
}
