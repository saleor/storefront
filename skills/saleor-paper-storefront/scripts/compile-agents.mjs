#!/usr/bin/env node
/**
 * Regenerate AGENTS.md from rules/*.md (source of truth).
 * Run: node skills/saleor-paper-storefront/scripts/compile-agents.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillRoot = join(__dirname, "..");
const rulesDir = join(skillRoot, "rules");
const outPath = join(skillRoot, "AGENTS.md");

const RULE_COUNT = 31;

const catalog = [
	{
		num: 0,
		title: "Architecture",
		impact: "CRITICAL",
		intro:
			"North-star conventions for canonical Next.js App Router patterns. Read before unfamiliar changes; task rules below cover implementation detail.",
		rules: [{ num: "0.1", file: "paper-architecture.md", title: "Paper Architecture" }],
	},
	{
		num: 1,
		title: "Data Layer",
		impact: "CRITICAL",
		intro:
			"The data layer controls caching, GraphQL type generation, and API communication. Getting this wrong causes stale content, type errors, or permission failures.",
		rules: [
			{ num: "1.1", file: "data-caching.md", title: "Caching Strategy" },
			{ num: "1.2", file: "data-graphql.md", title: "GraphQL Workflow" },
			{ num: "1.3", file: "data-auth-routes.md", title: "Auth Routes (BFF)" },
			{ num: "1.4", file: "data-redirect-security.md", title: "Redirect URL Security" },
			{ num: "1.5", file: "data-storefront-content.md", title: "Storefront Content Layer" },
			{ num: "1.6", file: "data-storefront-content-saleor.md", title: "Storefront Content (Saleor Models)" },
			{ num: "1.7", file: "data-storefront-content-attributes.md", title: "Storefront Content Attributes" },
		],
	},
	{
		num: 2,
		title: "Product Pages",
		impact: "HIGH",
		intro:
			"Product pages are the core shopping experience. PDP layout, variant selection, and filtering directly affect conversion and usability.",
		rules: [
			{ num: "2.1", file: "product-pdp.md", title: "Product Detail Page" },
			{ num: "2.2", file: "product-variants.md", title: "Variant Selection" },
			{ num: "2.3", file: "product-high-cardinality.md", title: "High-Cardinality Attributes" },
			{ num: "2.4", file: "product-filtering.md", title: "Product Filtering" },
		],
	},
	{
		num: 3,
		title: "Checkout Flow",
		impact: "HIGH",
		intro:
			"Checkout handles payment and order completion. Bugs here directly cause lost revenue and poor user experience.",
		rules: [
			{ num: "3.1", file: "paper-surfaces.md", title: "Paper Surfaces" },
			{ num: "3.2", file: "checkout-design-principles.md", title: "Checkout Design Principles" },
			{ num: "3.3", file: "checkout-management.md", title: "Checkout Management" },
			{ num: "3.4", file: "checkout-payment-gateways.md", title: "Payment Gateways" },
			{ num: "3.5", file: "checkout-components.md", title: "Checkout Components" },
		],
	},
	{
		num: 4,
		title: "Design & Composition",
		impact: "HIGH",
		intro:
			"How agents (and hand-coders) mold PDP and homepage at world-class quality without breaking PPR, caching, or mobile: the token design system, a design-quality bar, the marketing-section catalog, page composition within the PPR rails, designing from a prompt or image, and verification gates.",
		rules: [
			{ num: "4.1", file: "ui-design-system.md", title: "UI Design System" },
			{ num: "4.2", file: "design-quality-rubric.md", title: "Design Quality Rubric" },
			{ num: "4.3", file: "ui-sections.md", title: "UI Sections (Marketing Blocks)" },
			{ num: "4.4", file: "page-composition.md", title: "Page Composition (PDP & Homepage)" },
			{ num: "4.5", file: "design-from-image.md", title: "Design From Prompt or Image" },
			{ num: "4.6", file: "design-verification.md", title: "Design Verification Gates" },
		],
	},
	{
		num: 5,
		title: "UI & Channels",
		impact: "MEDIUM",
		intro: "UI components and channel configuration control the visual layer and multi-currency support.",
		rules: [
			{ num: "5.1", file: "ui-components.md", title: "UI Components" },
			{ num: "5.2", file: "ui-channels.md", title: "Channels & Multi-Currency" },
			{ num: "5.3", file: "ui-locale-routing.md", title: "Locale & Channel URL Routing" },
			{ num: "5.4", file: "ui-i18n.md", title: "next-intl (Code-Owned UI Strings)" },
		],
	},
	{
		num: 6,
		title: "SEO",
		impact: "MEDIUM",
		intro:
			"Search engine optimization, structured data, and social sharing metadata help drive organic traffic and improve click-through rates.",
		rules: [{ num: "6.1", file: "seo-metadata.md", title: "SEO & Metadata" }],
	},
	{
		num: 7,
		title: "Development",
		impact: "MEDIUM",
		intro: "Local dev environment gotchas and Saleor API investigation when documentation is unclear.",
		rules: [
			{ num: "7.1", file: "dev-local.md", title: "Local Development & Mobile Testing" },
			{ num: "7.2", file: "dev-investigation.md", title: "Saleor API Investigation" },
			{ num: "7.3", file: "third-party-embeds.md", title: "Third-Party Widget Embeds" },
		],
	},
];

function anchorId(ruleNum, title) {
	return `${ruleNum.replace(".", "")}-${title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")}`;
}

function stripFrontmatter(content) {
	if (!content.startsWith("---\n")) {
		return content;
	}
	const end = content.indexOf("\n---", 4);
	if (end === -1) {
		return content;
	}
	// Drop the closing fence line, then any leading blank lines.
	const afterFence = content.slice(content.indexOf("\n", end + 1) + 1);
	return afterFence.replace(/^\n+/, "");
}

function stripRuleTitle(content) {
	const lines = stripFrontmatter(content).split("\n");
	if (lines[0]?.startsWith("# ")) {
		return lines.slice(1).join("\n").replace(/^\n+/, "");
	}
	return content;
}

function buildToc() {
	const lines = ["## Table of Contents", ""];
	for (const section of catalog) {
		lines.push(
			`${section.num}. [${section.title}](#${section.num}-${section.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "")}) — **${section.impact}**`,
		);
		for (const rule of section.rules) {
			lines.push(`   - ${rule.num} [${rule.title}](#${anchorId(rule.num, rule.title)})`);
		}
		lines.push("");
	}
	return lines.join("\n");
}

function buildBody() {
	const parts = [];
	for (const section of catalog) {
		const sectionAnchor = `${section.num}-${section.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "")}`;
		parts.push(`## ${section.num}. ${section.title}`);
		parts.push("");
		parts.push(`**Impact: ${section.impact}**`);
		parts.push("");
		parts.push(section.intro);
		parts.push("");

		for (const rule of section.rules) {
			const raw = readFileSync(join(rulesDir, rule.file), "utf8");
			parts.push(`### ${rule.num} ${rule.title}`);
			parts.push("");
			parts.push(stripRuleTitle(raw).trimEnd());
			parts.push("");
			parts.push("---");
			parts.push("");
		}
	}
	return parts.join("\n");
}

const footer = `## Project-Specific Gotchas

### React Anti-patterns Seen in This Codebase

**State-to-state sync in effects:**

\`\`\`tsx
// BAD - derived state in effect
useEffect(() => {
	setDerivedValue(computeFrom(sourceValue));
}, [sourceValue]);

// GOOD - compute inline or in the handler
const derivedValue = computeFrom(sourceValue);
\`\`\`

**Child updating parent state via effect:**

\`\`\`tsx
// BAD - child uses effect to update parent
useEffect(() => {
	onLayoutChange(true); // parent setState
}, []);

// GOOD - parent derives state from what it knows, or callback on user action
\`\`\`

These patterns cause extra renders and make data flow hard to trace.

---

## References

1. [Saleor API Reference](https://docs.saleor.io/api-reference)
2. [Next.js Documentation](https://nextjs.org/docs)
3. [React Documentation](https://react.dev)
4. [Agent Skills Specification](https://agentskills.io)
`;

const header = `# Saleor Paper Storefront

**Version 1.8.0**  
Saleor Paper  
June 2026

> ⚠️ **Generated artifact — do not load this file in an agent session.** It concatenates
> all ${RULE_COUNT} rules (~75k tokens) and exists only for humans reading offline and for
> single-file skill export. **Agents:** read \`SKILL.md\`, then the **one** \`rules/<task>.md\`
> whose frontmatter \`description\` matches the task. Never read this compiled file to "get oriented".
>
> **Source of truth:** Individual rule files in \`rules/\` are updated first. Regenerate this file with:
> \`node skills/saleor-paper-storefront/scripts/compile-agents.mjs\`

---

## Abstract

Comprehensive guide for AI agents and LLMs maintaining the Saleor Paper storefront — a Next.js 16 e-commerce application with TypeScript, Tailwind CSS, and the Saleor GraphQL API. Covers ${RULE_COUNT} rules across 8 categories: architecture (canonical Next.js), data layer (caching, auth, GraphQL), product pages (PDP, variants, high-cardinality, filtering), checkout flow (surfaces, management, payments, components), design & composition (token system, design quality, section catalog, page composition, design-from-image, verification), UI & i18n, SEO, and development practices. Each rule includes architecture diagrams, code examples, file locations, and anti-patterns.

---

${buildToc()}
---

${buildBody().trimEnd()}

---

${footer}`;

if (process.argv.includes("--check")) {
	let current = "";
	try {
		current = readFileSync(outPath, "utf8");
	} catch {
		// missing file → treated as drift below
	}
	if (current !== header) {
		console.error(
			`✗ ${outPath} is out of date with rules/.\n  Run: node skills/saleor-paper-storefront/scripts/compile-agents.mjs`,
		);
		process.exit(1);
	}
	console.log(`✓ AGENTS.md is in sync with ${RULE_COUNT} rules`);
} else {
	writeFileSync(outPath, header);
	console.log(`Wrote ${outPath} (${RULE_COUNT} rules)`);
}
