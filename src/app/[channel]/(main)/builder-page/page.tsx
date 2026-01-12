import { BuilderIntegration } from "@/components/builder-io/BuilderIntegration";

export const metadata = {
	title: "Builder Page · Saleor Storefront example",
	description: "Dynamic page using Builder.io and GraphQL data",
};

export default async function BuilderPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	return (
		<div className="min-h-screen">
			<header className="border-b p-4">
				<h1>Builder.io Integration Demo</h1>
			</header>

			<main className="p-4">
				{/* This is where you would render your Builder.io content */}
				<BuilderIntegration pageId="builder-demo-page" channel={params.channel} />

				<div className="mt-8 rounded bg-gray-50 p-4">
					<h2>How This Integration Works:</h2>
					<ul className="mt-2 list-disc pl-5">
						<li>Builder.io content is loaded dynamically</li>
						<li>GraphQL data from Saleor is passed to Builder.io components</li>
						<li>Drag-and-drop interface allows UI design without code changes</li>
						<li>Components can access both Builder.io content and Saleor data</li>
					</ul>

					<div className="mt-4 rounded bg-blue-50 p-4">
						<h3>Next Steps:</h3>
						<p className="mt-2">1. Set up your Builder.io API key in environment variables</p>
						<p>2. Create pages in Builder.io with your desired layout</p>
						<p>3. Use the pageId to load content dynamically</p>
					</div>
				</div>
			</main>
		</div>
	);
}
