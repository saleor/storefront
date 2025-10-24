export interface SEOProps {
	title?: string;
	description?: string;
	canonical?: string;
	image?: string;
	imageAlt?: string;
	noindex?: boolean;
	nofollow?: boolean;
	type?: "website" | "article" | "product" | "profile";
	publishedTime?: string;
	modifiedTime?: string;
	author?: string;
}

export interface OpenGraphProps {
	title: string;
	description: string;
	url: string;
	image: string;
	imageAlt?: string;
	type: string;
	siteName: string;
	locale?: string;
	imageWidth?: number;
	imageHeight?: number;
}

export interface TwitterCardProps {
	card: "summary" | "summary_large_image" | "app" | "player";
	site?: string;
	creator?: string;
	title: string;
	description: string;
	image: string;
	imageAlt?: string;
}

export interface AlternateLanguage {
	lang: string;
	href: string;
}

export interface StructuredDataProps {
	"@context": string;
	"@type": string;
	[key: string]: any;
}

export interface MetaTagsResult {
	title: string;
	description: string;
	canonical?: string;
	robots?: string;
	openGraph: OpenGraphProps;
	twitter: TwitterCardProps;
}
