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
					// Strip HTML tags from text content
					return block.data.text.replace(/<[^>]*>/g, "");
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
