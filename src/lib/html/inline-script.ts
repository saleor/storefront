const INLINE_SCRIPT_UNSAFE_CHARS: Record<string, string> = {
	"<": "\\u003C",
	">": "\\u003E",
	"/": "\\u002F",
	"\u2028": "\\u2028",
	"\u2029": "\\u2029",
};

/**
 * Serialize a value to JSON for safe embedding inside an inline HTML `<script>`.
 *
 * `JSON.stringify` escapes quotes and backslashes but NOT characters that are significant
 * to the HTML parser inside a `<script>` element. A value containing `</script>` would
 * terminate the script element early, and `U+2028`/`U+2029` are valid JSON yet invalid in
 * a JS string literal in older engines — both are code-injection / breakage vectors when
 * the value originates from CMS content. Escaping them as `\uXXXX` keeps the JSON valid
 * while preventing breakout.
 */
export function serializeForInlineScript(value: unknown): string {
	return JSON.stringify(value).replace(
		/[<>/\u2028\u2029]/g,
		(char) => INLINE_SCRIPT_UNSAFE_CHARS[char] ?? char,
	);
}
