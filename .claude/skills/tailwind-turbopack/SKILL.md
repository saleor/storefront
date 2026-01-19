---
name: tailwind-turbopack
description: Handle Tailwind CSS with Turbopack limitations. Use when CSS classes aren't being generated, needing dynamic styles, or encountering Turbopack CSS issues.
---

# Tailwind CSS + Turbopack

## Avoid Inline Styles

**Never use inline `style={}` props.** Always use Tailwind classes or CSS in stylesheets.

For dynamic values that can't be expressed as Tailwind classes, define CSS classes with data attributes in a stylesheet:

```css
/* In stylesheet */
.collapsible[data-expanded="false"] {
	grid-template-rows: 0fr;
}
.collapsible[data-expanded="true"] {
	grid-template-rows: 1fr;
}
```

```jsx
/* In component */
<div className="collapsible" data-expanded={isExpanded}>
```

## Known Issue

Turbopack may fail to generate CSS for some Tailwind utility classes (especially arbitrary values in responsive variants like `max-md:grid-rows-[0fr]`). Classes appear in HTML but the CSS rules are missing from the bundle.

**Workaround:** Use Webpack for development or define complex styles in CSS files:

```bash
pnpm dev:webpack
```
