import { type MetadataRoute } from "next";
import { getBaseUrl, seoConfig } from "@/lib/seo";

function buildDisallowPaths() {
	const disallow = seoConfig.noIndexPaths.flatMap((path) => {
		if (path.startsWith("/api/")) {
			return [path];
		}

		return [path, `/*${path}`];
	});

	return [...new Set(disallow)];
}

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: buildDisallowPaths(),
			},
		],
		host: getBaseUrl(),
	};
}
