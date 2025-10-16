/**
 * Enhanced Editor.js parser with support for all block types
 * Extends editorjs-html with custom renderers for advanced blocks
 */

import edjsHTML from "editorjs-html";

// Custom parser configurations for new block types
const customParsers = {
	table: (block: any) => {
		const content = block.data?.content || [];
		if (!content.length) return "";

		const withHeadings = block.data?.withHeadings || false;

		let html = '<table class="editorjs-table">';

		content.forEach((row: string[], index: number) => {
			html += "<tr>";
			const tag = withHeadings && index === 0 ? "th" : "td";
			row.forEach((cell: string) => {
				html += `<${tag}>${cell}</${tag}>`;
			});
			html += "</tr>";
		});

		html += "</table>";
		return html;
	},

	checklist: (block: any) => {
		const items = block.data?.items || [];
		if (!items.length) return "";

		let html = '<ul class="editorjs-checklist">';
		items.forEach((item: { text: string; checked: boolean }) => {
			const checked = item.checked ? "checked" : "";
			html += `<li class="editorjs-checklist-item ${checked}">`;
			html += `<input type="checkbox" ${checked} disabled />`;
			html += `<span>${item.text}</span>`;
			html += "</li>";
		});
		html += "</ul>";
		return html;
	},

	code: (block: any) => {
		const code = block.data?.code || "";
		// Escape HTML to prevent XSS
		const escaped = code
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");

		return `<pre class="editorjs-code"><code>${escaped}</code></pre>`;
	},

	delimiter: () => {
		return '<div class="editorjs-delimiter">* * *</div>';
	},

	warning: (block: any) => {
		const title = block.data?.title || "";
		const message = block.data?.message || "";

		return `
			<div class="editorjs-warning">
				${title ? `<div class="editorjs-warning-title">${title}</div>` : ""}
				${message ? `<div class="editorjs-warning-message">${message}</div>` : ""}
			</div>
		`;
	},

	attaches: (block: any) => {
		const file = block.data?.file || {};
		const title = block.data?.title || file.name || "Download";

		if (!file.url) return "";

		const size = file.size ? ` (${formatFileSize(file.size)})` : "";

		return `
			<div class="editorjs-attaches">
				<a href="${file.url}" target="_blank" rel="noopener noreferrer" class="editorjs-attaches-link">
					<svg class="editorjs-attaches-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z" fill="currentColor"/>
					</svg>
					<span class="editorjs-attaches-title">${title}</span>
					${size ? `<span class="editorjs-attaches-size">${size}</span>` : ""}
				</a>
			</div>
		`;
	},

	raw: (block: any) => {
		// Raw HTML - already sanitized by backend
		return block.data?.html || "";
	},

	image: (block: any) => {
		const file = block.data?.file || {};
		const caption = block.data?.caption || "";
		const withBorder = block.data?.withBorder || false;
		const withBackground = block.data?.withBackground || false;
		const stretched = block.data?.stretched || false;

		if (!file.url) return "";

		const classes = [
			"editorjs-image",
			withBorder && "editorjs-image-border",
			withBackground && "editorjs-image-background",
			stretched && "editorjs-image-stretched",
		]
			.filter(Boolean)
			.join(" ");

		return `
			<figure class="${classes}">
				<img src="${file.url}" alt="${caption}" />
				${caption ? `<figcaption>${caption}</figcaption>` : ""}
			</figure>
		`;
	},

	embed: (block: any) => {
		const { embed, width, height, caption } = block.data || {};

		if (!embed) return "";

		return `
			<div class="editorjs-embed">
				<div class="editorjs-embed-content" style="${width ? `width: ${width}px;` : ""} ${height ? `height: ${height}px;` : ""}">
					${embed}
				</div>
				${caption ? `<div class="editorjs-embed-caption">${caption}</div>` : ""}
			</div>
		`;
	},
};

/**
 * Format file size to human-readable format
 */
function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Create enhanced Editor.js HTML parser
 */
export const createEditorJsParser = () => {
	return edjsHTML(customParsers);
};

/**
 * Parse Editor.js JSON to HTML
 */
export const parseEditorJsToHTML = (data: string | object): string[] => {
	try {
		const parser = createEditorJsParser();
		const jsonData = typeof data === "string" ? JSON.parse(data) : data;
		return parser.parse(jsonData);
	} catch (error) {
		console.error("Failed to parse Editor.js content:", error);
		return [];
	}
};
