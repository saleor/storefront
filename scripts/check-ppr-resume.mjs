#!/usr/bin/env node
/**
 * Fail when a prerendered route cannot be resumed at request time.
 *
 *   pnpm build && pnpm check:ppr-resume
 *
 * Starts `next start`, requests a few routes that share the browse layout, and scans the
 * server output for React's resume failure ("Couldn't find all resumable slots"). That
 * error means the request render no longer matches the prerendered shell (for example a
 * `new Date()` during prerender). React then client-renders the boundary, and the shopper
 * sees an empty nav or `<main>`. The ◐ route symbol stays green either way, and the check
 * does not need products in the store.
 *
 * Routes: PPR_RESUME_ROUTES (comma-separated) or a default set for NEXT_PUBLIC_DEFAULT_CHANNEL.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = process.env.PPR_RESUME_PORT ?? "3029";
const BASE = `http://127.0.0.1:${PORT}`;
const channel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel";
const browse = `/en/${channel}`;
const routes = process.env.PPR_RESUME_ROUTES?.split(",").filter(Boolean) ?? [
	browse,
	`${browse}/products`,
	`${browse}/search?query=a`,
	`${browse}/cart`,
	`${browse}/pages/about`,
];

const FAILURE = /Couldn't find all resumable slots/;

let output = "";
const server = spawn("pnpm", ["exec", "next", "start", "-p", PORT], {
	env: process.env,
	stdio: ["ignore", "pipe", "pipe"],
	detached: process.platform !== "win32",
});
server.stdout.on("data", (chunk) => (output += chunk));
server.stderr.on("data", (chunk) => (output += chunk));

function stop() {
	try {
		// Kill the whole group: `pnpm exec` starts `next start` as a child.
		process.kill(process.platform === "win32" ? server.pid : -server.pid, "SIGTERM");
	} catch {
		// Already gone.
	}
}

async function waitForReady() {
	for (let attempt = 0; attempt < 120; attempt++) {
		try {
			await fetch(`${BASE}${browse}`);
			return;
		} catch {
			await sleep(500);
		}
	}
	throw new Error(`next start did not answer on ${BASE} within 60s:\n${output}`);
}

let failed = false;
try {
	await waitForReady();
	for (const route of routes) {
		const response = await fetch(`${BASE}${route}`);
		await response.text();
		console.log(`${response.status} ${route}`);
	}
	// Resume errors are logged while the response streams; give the last one a moment.
	await sleep(1000);
	const hits = output.split("\n").filter((line) => FAILURE.test(line));
	if (hits.length > 0) {
		failed = true;
		console.error(
			`\n${hits.length} PPR resume failure(s). A request render no longer matches its prerendered shell.\n` +
				"Look for a clock or random read (new Date(), Date.now(), Math.random()) during render without io(),\n" +
				"or data that differs between prerender and request. Server output:\n",
		);
		console.error(output);
	} else {
		console.log(`PPR resume: ${routes.length} route(s) resumed without a mismatch.`);
	}
} catch (error) {
	failed = true;
	console.error(error instanceof Error ? error.message : error);
} finally {
	stop();
}

process.exit(failed ? 1 : 0);
