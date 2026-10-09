/**
 * Paper data-layer boundaries.
 *
 * Each rule's message names the canonical API and the allowlist to edit.
 * Adding a path to an allowlist is a reviewed exception, same as NEXT_IMAGE_ALLOWED_FILES.
 */

/** @param {string} filename */
function rel(filename) {
	return filename.replaceAll("\\", "/").replace(/^.*\/storefront\//, "");
}

/** @param {string} file */
function inKernel(file) {
	return file.startsWith("src/lib/saleor/");
}

/** Layers allowed to import the public `@/lib/saleor` barrel. */
const SALEOR_IMPORT_ALLOW = [
	/^src\/lib\/saleor\//,
	/^src\/lib\/(catalog|menus|channels|content|search|account|auth|custom)\//,
	/^src\/lib\/checkout\.ts$/,
	/^src\/checkout\/lib\/server\//,
	/^src\/app\/api\//,
	/^src\/app\/actions\.ts$/,
	/^src\/app\/.*\/actions\.ts$/,
	/\.test\.tsx?$/,
];

/**
 * `src/lib` still imports a few presentation helpers. Each path is a deliberate
 * exception until those helpers move into `src/lib/catalog`.
 */
const LIB_UI_ALLOW = new Set([
	"src/lib/catalog/fetch-filtered-listing.ts",
	"src/lib/catalog/listing-query.ts",
	"src/lib/search/saleor-provider.ts",
	"src/lib/cart-checkout.ts",
]);

const LOADER_DIRS = [
	"src/lib/catalog/",
	"src/lib/menus/",
	"src/lib/channels/",
	"src/lib/content/",
	"src/lib/search/",
	"src/lib/account/",
	"src/lib/custom/",
];

/** Presence checks and the one raw app-token query that is not a codegen document. */
/** Untyped queries. Anywhere else must use mutate() so the registry applies. */
const RAW_MUTATION_ALLOW = new Set([
	"src/lib/auth/confirm-account.ts",
	"src/app/api/auth/register/route.ts",
	"src/app/api/auth/reset-password/route.ts",
	"src/app/(checkout)/actions.ts",
	"src/checkout/lib/server/fetch-channel-default-country.ts",
]);

const TOKEN_READ_ALLOW = new Set([
	"src/lib/channels/get-channels-data.ts",
	"src/checkout/lib/server/fetch-order-by-number.ts",
	"src/checkout/lib/server/fetch-channel-default-country.ts",
	"src/config/channels.ts",
	"src/config/channels.test.ts",
]);

const CACHE_DIRECTIVE_BANNED = new Set([
	"cookies",
	"headers",
	"draftMode",
	"connection",
	"liveQuery",
	"sessionQuery",
	"mutate",
]);

/** @param {import("eslint").Rule.Node} node */
function isUseCacheFunction(node) {
	const body = node.body;
	if (!body || body.type !== "BlockStatement") return false;
	return body.body.some(
		(statement) =>
			statement.type === "ExpressionStatement" &&
			statement.expression.type === "Literal" &&
			statement.expression.value === "use cache",
	);
}

/** @param {import("eslint").Rule.Node | null | undefined} node */
function enclosingUseCache(node) {
	let current = node;
	while (current) {
		if (
			(current.type === "FunctionDeclaration" ||
				current.type === "FunctionExpression" ||
				current.type === "ArrowFunctionExpression") &&
			isUseCacheFunction(current)
		) {
			return current;
		}
		current = current.parent;
	}
	return null;
}

/** @param {string} file */
function hasUseServer(fileText) {
	return fileText.includes('"use server"') || fileText.includes("'use server'");
}

/** @param {string} file */
function hasUseClient(fileText) {
	return /^\s*["']use client["']/.test(fileText);
}

const plugin = {
	meta: { name: "paper-data-layer" },
	rules: {
		"saleor-access": {
			meta: {
				type: "problem",
				docs: { description: "Only loaders, actions, and API routes import the Saleor kernel." },
				schema: [],
				messages: {
					internal:
						"Import the public barrel `@/lib/saleor`, not `{{source}}`. Kernel internals stay in src/lib/saleor/. See rules/data-access.md.",
					layer:
						"Only catalog/content loaders, server actions, checkout server loaders, and API routes may import `@/lib/saleor`. Call a loader instead. To allow this file, add it to SALEOR_IMPORT_ALLOW in eslint/paper-data-layer.mjs.",
				},
			},
			create(context) {
				const file = rel(context.filename);
				return {
					ImportDeclaration(node) {
						const source = node.source.value;
						if (
							typeof source !== "string" ||
							(source !== "@/lib/saleor" && !source.startsWith("@/lib/saleor/"))
						)
							return;
						if (source !== "@/lib/saleor" && !inKernel(file)) {
							context.report({ node, messageId: "internal", data: { source } });
							return;
						}
						if (source === "@/lib/saleor" && !SALEOR_IMPORT_ALLOW.some((pattern) => pattern.test(file))) {
							context.report({ node, messageId: "layer" });
						}
					},
				};
			},
		},
		"no-direct-saleor": {
			meta: {
				type: "problem",
				docs: { description: "Saleor is reached only through the kernel." },
				schema: [],
				messages: {
					client:
						"Do not call Saleor from the browser ({{name}}). Use a loader on `@/lib/saleor` via a Server Component or server action. See rules/data-access.md.",
					token:
						"Read SALEOR_APP_TOKEN only inside src/lib/saleor. Callers use cachedQuery/liveQuery; the registry picks app auth.",
					hooks:
						"Do not import checkout urql hooks. Checkout reads go through server actions and `@/lib/saleor`.",
					fetch:
						"Do not fetch NEXT_PUBLIC_SALEOR_API_URL directly. Use cachedQuery, liveQuery, sessionQuery, or mutate from `@/lib/saleor`. See rules/data-access.md.",
					raw: "rawMutation skips the operation registry. Use mutate() with a .graphql document. Auth BFF exceptions are listed in RAW_MUTATION_ALLOW in eslint/paper-data-layer.mjs.",
				},
			},
			create(context) {
				const file = rel(context.filename);
				if (file.startsWith("src/checkout/graphql/generated/")) return {};
				return {
					ImportDeclaration(node) {
						const source = node.source.value;
						if (typeof source !== "string") return;
						if (source === "urql" || source === "graphql-request" || source.startsWith("@apollo/")) {
							context.report({ node, messageId: "client", data: { name: source } });
						}
						if (
							source === "@/checkout/graphql/generated" ||
							source.endsWith("/checkout/graphql/generated/index")
						) {
							context.report({ node, messageId: "hooks" });
						}
					},
					CallExpression(node) {
						if (inKernel(file) || file.endsWith(".test.ts")) return;
						const callee = node.callee;
						if (
							callee.type === "Identifier" &&
							callee.name === "rawMutation" &&
							!RAW_MUTATION_ALLOW.has(file)
						) {
							context.report({ node, messageId: "raw" });
						}
						if (callee.type === "Identifier" && callee.name === "fetch") {
							const arg = node.arguments[0];
							const text = arg ? context.sourceCode.getText(arg) : "";
							if (text.includes("SALEOR_API_URL")) {
								context.report({ node, messageId: "fetch" });
							}
						}
					},
					MemberExpression(node) {
						if (inKernel(file) || TOKEN_READ_ALLOW.has(file)) return;
						if (
							node.property.type === "Identifier" &&
							node.property.name === "SALEOR_APP_TOKEN" &&
							node.object.type === "MemberExpression" &&
							node.object.property.type === "Identifier" &&
							node.object.property.name === "env"
						) {
							context.report({ node, messageId: "token" });
						}
					},
				};
			},
		},
		"cache-api": {
			meta: {
				type: "problem",
				docs: { description: "cacheLife, cacheTag, and invalidation APIs stay in the kernel." },
				schema: [],
				messages: {
					life: 'Do not call cacheLife/cacheTag here. Use cachedQuery() or bindCacheProfile() from `@/lib/saleor` inside "use cache". See rules/data-caching.md.',
					revalidate:
						"revalidateTag/revalidatePath/updateTag are only for shared catalog webhooks in src/app/api/revalidate. Per-user mutations use refresh(). See paper-vercel-cost.",
					refresh:
						"refresh() is for server actions that changed the acting user's private state. Do not call it from a render or a cached loader.",
					banned: 'Do not use {{name}}. Paper uses "use cache" plus the manifest. See rules/data-caching.md.',
					private:
						'Do not use "use cache: private" or "use cache: remote". Pass locale and channel as function arguments. See rules/data-caching.md.',
				},
			},
			create(context) {
				const file = rel(context.filename);
				const sourceText = context.sourceCode.getText();
				return {
					ImportDeclaration(node) {
						const source = node.source.value;
						if (source !== "next/cache") return;
						for (const spec of node.specifiers) {
							if (spec.type !== "ImportSpecifier" || spec.imported.type !== "Identifier") continue;
							const name = spec.imported.name;
							if ((name === "cacheLife" || name === "cacheTag") && !inKernel(file)) {
								context.report({ node: spec, messageId: "life" });
							}
							if (
								(name === "revalidateTag" || name === "revalidatePath" || name === "updateTag") &&
								!file.startsWith("src/lib/saleor/invalidation/") &&
								file !== "src/app/api/revalidate/route.ts"
							) {
								context.report({ node: spec, messageId: "revalidate" });
							}
							if (name === "refresh" && !hasUseServer(sourceText)) {
								context.report({ node: spec, messageId: "refresh" });
							}
							if (name === "unstable_cache" || name === "unstable_noStore") {
								context.report({ node: spec, messageId: "banned", data: { name } });
							}
						}
					},
					ExpressionStatement(node) {
						if (
							node.expression.type === "Literal" &&
							(node.expression.value === "use cache: private" ||
								node.expression.value === "use cache: remote")
						) {
							context.report({ node, messageId: "private" });
						}
					},
				};
			},
		},
		"use-cache-shape": {
			meta: {
				type: "problem",
				docs: { description: '"use cache" lives on loaders and cannot read the request.' },
				schema: [],
				messages: {
					place:
						'"use cache" belongs on a loader in src/lib/{catalog,menus,channels,content,search,account,custom}. See rules/data-caching.md.',
					request:
						'{{name}} cannot run inside "use cache" (it reads the request or skips the manifest). Pass plain arguments in, and use cachedQuery(). See rules/data-caching.md.',
				},
			},
			create(context) {
				const file = rel(context.filename);
				const allowed = LOADER_DIRS.some((dir) => file.startsWith(dir)) || file.includes(".test.");
				return {
					ExpressionStatement(node) {
						if (node.expression.type !== "Literal" || node.expression.value !== "use cache") return;
						if (!allowed) context.report({ node, messageId: "place" });
					},
					CallExpression(node) {
						if (!enclosingUseCache(node)) return;
						const callee = node.callee;
						const name =
							callee.type === "Identifier"
								? callee.name
								: callee.type === "MemberExpression" && callee.property.type === "Identifier"
									? callee.property.name
									: null;
						if (name && CACHE_DIRECTIVE_BANNED.has(name)) {
							context.report({ node, messageId: "request", data: { name } });
						}
					},
				};
			},
		},
		"surface-boundary": {
			meta: {
				type: "problem",
				docs: { description: "The storefront does not import the checkout surface." },
				schema: [],
				messages: {
					checkout:
						"Storefront code must not import `@/checkout/*`. Cross-surface URLs go through `@paper/session-bridge`. See paper-surfaces.",
				},
			},
			create(context) {
				const file = rel(context.filename);
				const storefront =
					file.startsWith("src/app/(storefront)/") ||
					file.startsWith("src/ui/") ||
					(file.startsWith("src/lib/") && !file.startsWith("src/lib/saleor/"));
				if (!storefront) return {};
				return {
					ImportDeclaration(node) {
						const source = node.source.value;
						if (typeof source === "string" && (source.startsWith("@/checkout/") || source === "@/checkout")) {
							context.report({ node, messageId: "checkout" });
						}
					},
				};
			},
		},
		"client-boundary": {
			meta: {
				type: "problem",
				docs: { description: "Client components do not import the Saleor kernel or cached loaders." },
				schema: [],
				messages: {
					client:
						"A client component cannot import {{source}}. Fetch in a Server Component or call a server action. See rules/data-access.md.",
				},
			},
			create(context) {
				const sourceText = context.sourceCode.getText();
				if (!hasUseClient(sourceText)) return {};
				return {
					ImportDeclaration(node) {
						const source = node.source.value;
						if (typeof source !== "string") return;
						if (
							source === "@/lib/saleor" ||
							source.startsWith("@/lib/saleor/") ||
							source.startsWith("@/lib/catalog/get-") ||
							source.startsWith("@/lib/menus/get-") ||
							source.startsWith("@/lib/channels/get-")
						) {
							context.report({ node, messageId: "client", data: { source } });
						}
					},
				};
			},
		},
		"no-lib-ui": {
			meta: {
				type: "problem",
				docs: { description: "The data layer does not import UI modules." },
				schema: [],
				messages: {
					ui: "src/lib must not import `@/ui`. Move the helper into src/lib or add this file to LIB_UI_ALLOW in eslint/paper-data-layer.mjs with a reason.",
				},
			},
			create(context) {
				const file = rel(context.filename);
				if (!file.startsWith("src/lib/") || LIB_UI_ALLOW.has(file)) return {};
				return {
					ImportDeclaration(node) {
						const source = node.source.value;
						if (typeof source === "string" && source.startsWith("@/ui/")) {
							context.report({ node, messageId: "ui" });
						}
					},
				};
			},
		},
	},
};

export default plugin;
