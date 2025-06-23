"use client";

export default function Page() {
	return (
		<section className="p-8">
			<h1 className="mb-4 text-2xl">Open Storefront App</h1>
			<p>
				Once you install this app, a new option will appear that lets you preview the product you’re currently
				editing directly in the storefront.
			</p>
			<p>
				<a
					className="cursor-pointer text-blue-600 underline hover:text-blue-800"
					onClick={(e) => {
						e.preventDefault();
						window.parent.postMessage(
							{
								type: "redirect",
								payload: {
									to: "https://docs.saleor.io/developer/extending/apps/extending-dashboard-with-apps",
									newContext: true,
								},
							},
							"*",
						);
					}}
				>
					Read Dashboard Extensions documentation
				</a>{" "}
				to learn more about integrating with Dashboard UI.
			</p>
		</section>
	);
}
