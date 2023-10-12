const footer = {
	home: [
		{ name: "Home", href: "/" },
		{ name: "Login", href: "/login" },
	],
	categories: [
		{ name: "All", href: "#" },
		{ name: "T-shirts", href: "#" },
		{ name: "Hoodies", href: "#" },
		{ name: "Accessories", href: "#" },
	],
};
export function Footer() {
	return (
		<footer className="border-t border-neutral-300 bg-neutral-50">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<div className="grid grid-cols-3 gap-8 py-16">
					<h2 className="sr-only">Quick links</h2>
					<div>
						<h3 className="text-sm font-medium text-neutral-900">Home</h3>
						<ul className="mt-4 space-y-4">
							{footer.home.map((item) => (
								<li key={item.name} className="text-sm">
									<a href={item.href} className="text-neutral-500 hover:text-neutral-600">
										{item.name}
									</a>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-medium text-neutral-900">Category</h3>
						<ul className="mt-4 space-y-4">
							{footer.categories.map((item) => (
								<li key={item.name} className="text-sm">
									<a href={item.href} className="text-neutral-500 hover:text-neutral-600">
										{item.name}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="flex flex-col justify-between border-t border-neutral-200 py-10 sm:flex-row">
					<p className="text-sm text-neutral-500">Copyright &copy; 2023 Your Store, Inc.</p>
					<p className="text-sm text-neutral-500">Powered by Saleor</p>
				</div>
			</div>
		</footer>
	);
}
