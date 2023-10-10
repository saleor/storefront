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
		<footer className="border-t border-slate-300 bg-slate-50">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<div className="grid grid-cols-3 gap-8 py-16">
					<h2 className="sr-only">Quick links</h2>
					<div>
						<h3 className="text-sm font-medium text-gray-900">Home</h3>
						<ul className="mt-4 space-y-4">
							{footer.home.map((item) => (
								<li key={item.name} className="text-sm">
									<a href={item.href} className="text-gray-500 hover:text-gray-600">
										{item.name}
									</a>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-medium text-gray-900">Category</h3>
						<ul className="mt-4 space-y-4">
							{footer.categories.map((item) => (
								<li key={item.name} className="text-sm">
									<a href={item.href} className="text-gray-500 hover:text-gray-600">
										{item.name}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="flex flex-col justify-between border-t border-gray-200 py-10 sm:flex-row">
					<p className="text-sm text-gray-500">Copyright &copy; 2023 Your Store, Inc.</p>
					<p className="text-sm text-gray-500">Powered by Saleor</p>
				</div>
			</div>
		</footer>
	);
}
