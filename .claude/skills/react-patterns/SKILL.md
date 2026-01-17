---
name: react-patterns
description: Write idiomatic React with proper hooks and render purity. Use when writing components, fixing hook-related lint errors, or deciding where to put logic (render vs effect vs handler).
---

# React Patterns

> **Source**: [React Documentation](https://react.dev/learn) — Official React mental model
>
> **Philosophy**: Generic principles, informed by anti-patterns we've seen in this codebase. Timeless rules, not line-number references.

## The Golden Rule

**Write idiomatic React.** Respect the component lifecycle (mount → update → unmount), keep renders pure, and use hooks correctly (`useEffect`, `useCallback`, `useRef`, `useMemo`).

React will call your component multiple times, in any order, at any time. Code that works "by accident" will break unpredictably.

## When to Use This Skill

- Writing or reviewing React components
- Fixing lint errors related to hooks or purity
- Deciding where to put logic (render vs effect vs handler)

## Key Principles

### 1. Renders Must Be Pure

No side effects during render. Same props + state = same output.

```tsx
// ❌ Impure - different result each render
const now = Date.now();

// ✅ Pure - computed once on mount
const [now] = useState(() => Date.now());
```

### 2. Effects Are for External Sync

Effects connect React to external systems (APIs, DOM, subscriptions). Not for derived state.

```tsx
// ❌ Wrong - derived state in effect
useEffect(() => {
	setFullName(first + " " + last);
}, [first, last]);

// ✅ Right - compute during render
const fullName = first + " " + last;
```

### 3. Respect the Lifecycle

- **Mount**: Component appears, effects run
- **Update**: Props/state change, component re-renders
- **Unmount**: Component disappears, cleanup runs

Always return cleanup functions from effects that subscribe to things.

### 4. Use the Right Hook

| Hook          | Purpose                                       |
| ------------- | --------------------------------------------- |
| `useState`    | State that triggers re-renders                |
| `useEffect`   | Sync with external systems                    |
| `useRef`      | Mutable value that persists without re-render |
| `useMemo`     | Cache expensive computation                   |
| `useCallback` | Stable function reference for child props     |

## Anti-patterns

❌ **Don't fight React** - If it feels hacky, you're probably doing it wrong  
❌ **Don't ignore the linter** - It knows React's rules better than you  
❌ **Don't put everything in effects** - Most logic belongs in render or handlers  
❌ **Don't forget cleanup** - Subscriptions, timers, event listeners need cleanup

### State Sync Anti-patterns

These are common mistakes that technically work but violate React's mental model:

```tsx
// ❌ State-to-state sync in effect
useEffect(() => {
	setDerivedValue(computeFrom(sourceValue));
}, [sourceValue]);

// ✅ Compute inline or in the handler that changes source
const derivedValue = computeFrom(sourceValue);
// OR: in the handler
const handleSourceChange = (newValue) => {
	setSourceValue(newValue);
	setDerivedValue(computeFrom(newValue));
};
```

```tsx
// ❌ Child updating parent state via effect
useEffect(() => {
	onLayoutChange(true); // parent setState
}, []);

// ✅ Parent derives state from what it knows
// OR: callback on user action, not on mount
```

**Why this matters:** Effects run after render. State-to-state effects cause extra renders and make data flow hard to trace. Prefer computing values inline or updating in event handlers.
