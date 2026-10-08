/**
 * Paper data-layer boundaries.
 *
 * Each rule's message names the canonical API and the allowlist to edit.
 * Adding a path to an allowlist is a reviewed exception, same as NEXT_IMAGE_ALLOWED_FILES.
 */

/**
 * Repo-relative path.
 *
 * Worktrees are not always a directory named `storefront`, and `src/lib/storefront/`
 * contains that name again. Prefer ESLint's cwd. Fall back to the last `/src/`
 * segment so a greedy match cannot swallow `src/lib/storefront/`.
 *
 * @param {string} filename
 * @param {string} [cwd]
 */
function rel(filename, cwd) {
	const normalized = filename.replaceAll("\\", "/");
	const root = (cwd ?? "").replaceAll("\\", "/").replace(/\/$/, "");
	if (root && (normalized === root || normalized.startsWith(`${root}/`))) {
		return normalized.slice(root.length + 1);
	}
	const srcAt = normalized.lastIndexOf("/src/");
	if (srcAt !== -1) return normalized.slice(srcAt + 1);
	return normalized;
}

/** @param {string} file */
function inKernel(file) {
	return file.startsWith("src/lib/saleor/");
}

/** Layers allowed to import the public `@/lib/saleor` barrel. */
const SALEOR_IMPORT_ALLOW = [
	/^src\/lib\/saleor\//,
	/^src\/lib\/(catalog|menus|channels|content|listing|account|auth|custom)\//,
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
const LIB_UI_ALLOW = new Set(["src/lib/cart-checkout.ts"]);

const LOADER_DIRS = [
	"src/lib/catalog/",
	"src/lib/menus/",
	"src/lib/channels/",
	"src/lib/content/",
	"src/lib/listing/",
	"src/lib/account/",
	"src/lib/custom/",
];

/** Untyped queries. Anywhere else must use mutate() so the registry applies. */
const RAW_MUTATION_ALLOW = new Set([
	"src/lib/auth/confirm-account.ts",
	"src/app/api/auth/register/route.ts",
	"src/app/api/auth/reset-password/route.ts",
	"src/app/(checkout)/actions.ts",
	"src/checkout/lib/server/fetch-channel-default-country.ts",
]);

/**
 * Documents whose operation is registered with `auth: "app"` in src/lib/saleor/operations.ts.
 * The kernel attaches SALEOR_APP_TOKEN by operation name, so importing one of these
 * is the privilege. `data-layer.contract.test.ts` keeps this set equal to the registry.
 */
export const APP_AUTH_DOCUMENTS = new Set(["ChannelsListDocument", "OrdersByNumberDocument"]);

/** The only files that may run an app-token operation. Adding one is a reviewed exception. */
export const APP_AUTH_CALLERS = new Set([
	"src/lib/channels/get-channels-data.ts",
	"src/checkout/lib/server/fetch-order-by-number.ts",
]);

const TOKEN_READ_ALLOW = new Set([
	"src/lib/channels/get-channels-data.ts",
	"src/checkout/lib/server/fetch-order-by-number.ts",
	"src/checkout/lib/server/fetch-channel-default-country.ts",
	"src/config/channels.ts",
]);

/**
 * UI and templates that still import generated Saleor types. Burn this list down
 * by mapping those props through a view model. Do not add new paths.
 */
const GQL_UI_ALLOW = new Set([
	"src/ui/components/account/address-card.tsx",
	"src/ui/components/account/address-form-dialog.tsx",
	"src/ui/components/account/order-row.tsx",
	"src/ui/components/account/order-row-labels.ts",
	"src/ui/components/account/order-status-badge.tsx",
	"src/ui/components/account/order-status-config.ts",
	"src/ui/components/account/order-timeline.tsx",
	"src/ui/components/nav/components/user-menu/components/user-avatar.tsx",
	"src/ui/components/nav/components/user-menu/components/user-info.tsx",
	"src/ui/components/nav/components/user-menu/user-menu.tsx",
	"src/ui/components/order-list-item.tsx",
	"src/ui/components/payment-status.tsx",
]);

const TEMPLATE_REQUEST_IMPORTS = new Set(["cookies", "headers", "draftMode", "connection"]);

/** @param {string} source */
function isGqlOrKernelImport(source) {
	return (
		source === "@/gql/graphql" ||
		source.startsWith("@/gql/") ||
		source === "@/lib/saleor" ||
		source.startsWith("@/lib/saleor/")
	);
}

/** @param {string} source */
function isTemplateForbiddenImport(source) {
	if (source === "next/headers" || source === "next/server" || source === "next/cache") return true;
	if (source.startsWith("@/lib/catalog/")) return true;
	if (source.startsWith("@/lib/listing")) return true;
	if (source === "@/app/actions" || source.endsWith("/actions")) return source.startsWith("@/app/");
	return isGqlOrKernelImport(source);
}

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

const LISTING_GQL_NAMES = new Set([
	"ProductWhereInput",
	"ProductFilterInput",
	"ProductListPaginatedDocument",
	"ProductListByCategoryProductsDocument",
	"ProductListByCollectionProductsDocument",
	"SearchProductsDocument",
]);

/** @param {string} file */
function inListingProvider(file) {
	return /^src\/lib\/listing\/providers\/[^/]+\//.test(file);
}

/** @param {string} file */
function isPlpRouteFile(file) {
	return (
		/\/\(main\)\/products\/page\.tsx$/.test(file) ||
		/\/\(main\)\/products\/__canary-page\.tsx$/.test(file) ||
		/\/\(main\)\/search\/page\.tsx$/.test(file) ||
		/\/\(main\)\/search\/__canary-page\.tsx$/.test(file) ||
		/\/\(main\)\/categories\/\[slug\]\/page\.tsx$/.test(file) ||
		/\/\(main\)\/collections\/\[slug\]\/page\.tsx$/.test(file)
	);
}

/** @param {import("eslint").Rule.Node | null | undefined} node */
function insideRedirectCall(node) {
	let current = node;
	while (current) {
		if (
			current.type === "CallExpression" &&
			current.callee.type === "Identifier" &&
			current.callee.name === "redirectToCanonicalCatalogSlug"
		) {
			return true;
		}
		current = current.parent;
	}
	return false;
}

/** @param {import("eslint").Rule.Node | null | undefined} node */
function pageFunction(node) {
	let current = node?.parent;
	while (current) {
		if (
			(current.type === "FunctionDeclaration" ||
				current.type === "FunctionExpression" ||
				current.type === "ArrowFunctionExpression") &&
			current.id?.type === "Identifier" &&
			current.id.name === "Page"
		) {
			return current;
		}
		current = current.parent;
	}
	return null;
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
				const file = rel(context.filename, context.cwd);
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
				const file = rel(context.filename, context.cwd);
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
						if (inKernel(file) || TOKEN_READ_ALLOW.has(file) || /\.test\.tsx?$/.test(file)) return;
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
		"app-auth-callers": {
			meta: {
				type: "problem",
				docs: { description: "App-token operations run only from an allowlist of files." },
				schema: [],
				messages: {
					caller:
						"{{name}} runs with SALEOR_APP_TOKEN (auth: app in src/lib/saleor/operations.ts). Call the existing loader instead. To allow this file, add it to APP_AUTH_CALLERS in eslint/paper-data-layer.mjs.",
				},
			},
			create(context) {
				const file = rel(context.filename, context.cwd);
				if (inKernel(file) || /\.test\.tsx?$/.test(file) || APP_AUTH_CALLERS.has(file)) return {};
				if (file.startsWith("src/gql/") || file.startsWith("src/checkout/graphql/generated/")) return {};
				return {
					ImportDeclaration(node) {
						for (const spec of node.specifiers) {
							if (spec.type !== "ImportSpecifier") continue;
							const name = spec.imported.type === "Identifier" ? spec.imported.name : spec.imported.value;
							if (APP_AUTH_DOCUMENTS.has(name)) {
								context.report({ node: spec, messageId: "caller", data: { name } });
							}
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
				const file = rel(context.filename, context.cwd);
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
						'"use cache" belongs on a loader in src/lib/{catalog,menus,channels,content,listing,account,custom}. See rules/data-caching.md.',
					request:
						'{{name}} cannot run inside "use cache" (it reads the request or skips the manifest). Pass plain arguments in, and use cachedQuery(). See rules/data-caching.md.',
				},
			},
			create(context) {
				const file = rel(context.filename, context.cwd);
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
				const file = rel(context.filename, context.cwd);
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
				const file = rel(context.filename, context.cwd);
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
		"ui-no-gql": {
			meta: {
				type: "problem",
				docs: { description: "Templates and UI take view models, not generated Saleor types." },
				schema: [],
				messages: {
					gql: "Do not import {{source}} from UI or templates. Take a ProductView (or another view model) from the route. Existing exceptions are GQL_UI_ALLOW in eslint/paper-data-layer.mjs. See rules/ui-templates.md.",
				},
			},
			create(context) {
				const file = rel(context.filename, context.cwd);
				const inSurface = file.startsWith("src/ui/") || file.startsWith("src/templates/");
				if (!inSurface || GQL_UI_ALLOW.has(file)) return {};
				return {
					ImportDeclaration(node) {
						const source = node.source.value;
						if (typeof source === "string" && isGqlOrKernelImport(source)) {
							context.report({ node, messageId: "gql", data: { source } });
						}
					},
				};
			},
		},
		"template-purity": {
			meta: {
				type: "problem",
				docs: { description: "A template cannot read the request or call Saleor." },
				schema: [],
				messages: {
					import:
						"Templates cannot import {{source}}. Arrange `product` and `slots` only. Data is loaded in the route. See rules/ui-templates.md.",
					directive:
						'Templates cannot use "use cache" or cacheLife. The route owns caching. See rules/ui-templates.md.',
					request:
						"Templates cannot call {{name}}. That reads the request and collapses the PDP shell. See rules/ui-templates.md.",
				},
			},
			create(context) {
				const file = rel(context.filename, context.cwd);
				if (!file.startsWith("src/templates/")) return {};
				return {
					ImportDeclaration(node) {
						const source = node.source.value;
						if (typeof source !== "string") return;
						if (isTemplateForbiddenImport(source)) {
							context.report({ node, messageId: "import", data: { source } });
						}
						if (source === "next/headers" || source === "next/server" || source === "next/cache") {
							for (const spec of node.specifiers) {
								if (spec.type !== "ImportSpecifier" || spec.imported.type !== "Identifier") continue;
								if (spec.imported.name === "cacheLife" || spec.imported.name === "cacheTag") {
									context.report({ node: spec, messageId: "directive" });
								}
							}
						}
					},
					ExpressionStatement(node) {
						if (node.expression.type === "Literal" && node.expression.value === "use cache") {
							context.report({ node, messageId: "directive" });
						}
					},
					CallExpression(node) {
						const callee = node.callee;
						if (callee.type === "Identifier" && TEMPLATE_REQUEST_IMPORTS.has(callee.name)) {
							context.report({ node, messageId: "request", data: { name: callee.name } });
						}
					},
				};
			},
		},
		"listing-provider-boundary": {
			meta: {
				type: "problem",
				docs: {
					description:
						"Listing backends fetch. They do not own the cache, and Saleor filters stay inside a provider.",
				},
				schema: [],
				messages: {
					cache:
						'Listing providers cannot use "use cache" or next/cache. Cache policy lives in src/lib/listing/policy.ts.',
					gql: "Saleor listing filters and listing documents stay in src/lib/listing/providers/<id>/. Add a provider instead of importing {{name}} here.",
				},
			},
			create(context) {
				const file = rel(context.filename, context.cwd);
				if (inListingProvider(file)) {
					return {
						ImportDeclaration(node) {
							if (node.source.value === "next/cache") {
								context.report({ node, messageId: "cache" });
							}
						},
						ExpressionStatement(node) {
							if (node.expression.type === "Literal" && node.expression.value === "use cache") {
								context.report({ node, messageId: "cache" });
							}
						},
					};
				}
				if (file.includes(".test.")) return {};
				return {
					ImportDeclaration(node) {
						if (node.source.value !== "@/gql/graphql") return;
						for (const spec of node.specifiers) {
							if (spec.type !== "ImportSpecifier" || spec.imported.type !== "Identifier") continue;
							if (LISTING_GQL_NAMES.has(spec.imported.name)) {
								context.report({ node: spec, messageId: "gql", data: { name: spec.imported.name } });
							}
						}
					},
				};
			},
		},
		"plp-params-only": {
			meta: {
				type: "problem",
				docs: { description: "Listing pages do not await searchParams in the page component." },
				schema: [],
				messages: {
					params:
						"Do not await searchParams in the listing Page. Pass the promise into a Suspense child, or into redirectToCanonicalCatalogSlug. Filters go through /api/listing. See rules/plp-listing.md.",
				},
			},
			create(context) {
				const file = rel(context.filename, context.cwd);
				if (!isPlpRouteFile(file)) return {};
				return {
					AwaitExpression(node) {
						const arg = node.argument;
						const isSearchParams =
							arg.type === "MemberExpression" &&
							arg.property.type === "Identifier" &&
							arg.property.name === "searchParams";
						if (!isSearchParams) return;
						if (!pageFunction(node)) return;
						if (insideRedirectCall(node)) return;
						context.report({ node, messageId: "params" });
					},
				};
			},
		},
	},
};

export default plugin;
