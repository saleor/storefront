import { describe, it, expect } from "vitest";
import { isEditorJSContent, parseEditorJSToHtml, parseEditorJSToText } from "./editorjs";

// =============================================================================
// Fixtures
// =============================================================================
const validEditorJS = JSON.stringify({
	time: 1700000000000,
	blocks: [
		{ type: "paragraph", data: { text: "Hello world" } },
		{ type: "paragraph", data: { text: "Second paragraph" } },
	],
	version: "2.28.0",
});

const editorJSWithHtml = JSON.stringify({
	blocks: [{ type: "paragraph", data: { text: "Text with <b>bold</b> and <i>italic</i>" } }],
});

const editorJSWithXss = JSON.stringify({
	blocks: [
		{ type: "paragraph", data: { text: '<script>alert("xss")</script>Safe text' } },
		{ type: "paragraph", data: { text: '<img src=x onerror="alert(1)">After image' } },
		{ type: "paragraph", data: { text: 'Click <a href="javascript:alert(1)">here</a>' } },
	],
});

const emptyBlocks = JSON.stringify({ blocks: [] });

// =============================================================================
// isEditorJSContent
// =============================================================================
describe("isEditorJSContent", () => {
	it("returns true for valid EditorJS JSON", () => {
		expect(isEditorJSContent(validEditorJS)).toBe(true);
	});

	it("returns true for minimal EditorJS (just blocks array)", () => {
		expect(isEditorJSContent(emptyBlocks)).toBe(true);
	});

	it("returns false for plain text", () => {
		expect(isEditorJSContent("Just a plain string")).toBe(false);
	});

	it("returns false for null", () => {
		expect(isEditorJSContent(null)).toBe(false);
	});

	it("returns false for undefined", () => {
		expect(isEditorJSContent(undefined)).toBe(false);
	});

	it("returns false for empty string", () => {
		expect(isEditorJSContent("")).toBe(false);
	});

	it("returns false for JSON without blocks", () => {
		expect(isEditorJSContent(JSON.stringify({ time: 123 }))).toBe(false);
	});

	it("returns false for JSON where blocks is not an array", () => {
		expect(isEditorJSContent(JSON.stringify({ blocks: "not array" }))).toBe(false);
	});

	it("returns false for JSON array (not object)", () => {
		expect(isEditorJSContent(JSON.stringify([1, 2, 3]))).toBe(false);
	});
});

// =============================================================================
// parseEditorJSToHtml
// =============================================================================
describe("parseEditorJSToHtml", () => {
	it("parses paragraphs to HTML", () => {
		const result = parseEditorJSToHtml(validEditorJS);
		expect(result).toHaveLength(2);
		expect(result?.[0]).toContain("Hello world");
		expect(result?.[1]).toContain("Second paragraph");
	});

	it("preserves safe HTML tags", () => {
		const result = parseEditorJSToHtml(editorJSWithHtml);
		expect(result?.[0]).toContain("<b>bold</b>");
		expect(result?.[0]).toContain("<i>italic</i>");
	});

	it("neutralizes script tags (XSS prevention)", () => {
		const result = parseEditorJSToHtml(editorJSWithXss);
		expect(result?.[0]).not.toContain("<script>");
		expect(result?.[0]).toContain("Safe text");
	});

	it("strips onerror attributes from img tags", () => {
		const result = parseEditorJSToHtml(editorJSWithXss);
		expect(result?.[1]).not.toContain("onerror");
		expect(result?.[1]).not.toContain("alert");
	});

	it("strips javascript: URLs", () => {
		const result = parseEditorJSToHtml(editorJSWithXss);
		expect(result?.[2]).not.toContain("javascript:");
	});

	it("returns null for null input", () => {
		expect(parseEditorJSToHtml(null)).toBeNull();
	});

	it("returns null for undefined input", () => {
		expect(parseEditorJSToHtml(undefined)).toBeNull();
	});

	it("returns null for plain text (not valid EditorJS)", () => {
		expect(parseEditorJSToHtml("just text")).toBeNull();
	});

	it("returns empty array for empty blocks", () => {
		const result = parseEditorJSToHtml(emptyBlocks);
		expect(result).toEqual([]);
	});
});

// =============================================================================
// parseEditorJSToText
// =============================================================================
describe("parseEditorJSToText", () => {
	it("extracts plain text from EditorJS blocks", () => {
		const result = parseEditorJSToText(validEditorJS);
		expect(result).toBe("Hello world Second paragraph");
	});

	it("strips HTML tags from block text", () => {
		const result = parseEditorJSToText(editorJSWithHtml);
		expect(result).toContain("bold");
		expect(result).toContain("italic");
		expect(result).not.toContain("<b>");
		expect(result).not.toContain("<i>");
	});

	it("strips XSS payloads", () => {
		const result = parseEditorJSToText(editorJSWithXss);
		expect(result).not.toContain("<script>");
		expect(result).not.toContain("alert");
		expect(result).toContain("Safe text");
	});

	it("returns null for null input", () => {
		expect(parseEditorJSToText(null)).toBeNull();
	});

	it("returns null for undefined input", () => {
		expect(parseEditorJSToText(undefined)).toBeNull();
	});

	it("returns plain text as-is when not EditorJS JSON", () => {
		expect(parseEditorJSToText("Just a description")).toBe("Just a description");
	});

	it("returns null for empty blocks", () => {
		const result = parseEditorJSToText(emptyBlocks);
		expect(result).toBeNull();
	});
});
