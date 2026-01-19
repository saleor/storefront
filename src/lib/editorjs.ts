import edjsHTML from "editorjs-html";
import xss from "xss";

const parser = edjsHTML();

interface EditorJSBlock {
	type: string;
	data: {
		text?: string;
		[key: string]: unknown;
	};
}

interface EditorJSContent {
	time?: number;
	blocks: EditorJSBlock[];
	version?: string;
}

/**
 * Check if a string is EditorJS JSON format
 */
export function isEditorJSContent(content: string | null | undefined): boolean {
	if (!content) return false;
	try {
		const parsed = JSON.parse(content) as unknown;
		return (
			typeof parsed === "object" &&
			parsed !== null &&
			"blocks" in parsed &&
			Array.isArray((parsed as EditorJSContent).blocks)
		);
	} catch {
		return false;
	}
}

/**
 * Parse EditorJS JSON to an array of sanitized HTML strings
 */
export function parseEditorJSToHtml(content: string | null | undefined): string[] | null {
	if (!content) return null;

	try {
		const parsed = JSON.parse(content) as EditorJSContent;
		if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
			return null;
		}
		return parser.parse(parsed).map((html: string) => xss(html));
	} catch {
		// Not valid EditorJS JSON, return null
		return null;
	}
}

/**
 * Safely strip HTML tags from a string.
 * Uses xss library configured to strip all tags.
 */
function stripHtmlTags(html: string): string {
	return xss(html, {
		whiteList: {}, // Allow no tags
		stripIgnoreTag: true, // Strip all tags not in whitelist
		stripIgnoreTagBody: ["script", "style"], // Remove script/style content entirely
	});
}

/**
 * Extract plain text from EditorJS JSON.
 * Useful for descriptions in hero sections, meta tags, etc.
 */
export function parseEditorJSToText(content: string | null | undefined): string | null {
	if (!content) return null;

	try {
		const parsed = JSON.parse(content) as EditorJSContent;
		if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
			// Not EditorJS format, return as-is
			return content;
		}

		// Extract text from all blocks
		const texts = parsed.blocks
			.map((block) => {
				if (block.data?.text) {
					return stripHtmlTags(block.data.text);
				}
				return "";
			})
			.filter(Boolean);

		return texts.join(" ") || null;
	} catch {
		// Not valid JSON, return as-is (might be plain text)
		return content;
	}
}
