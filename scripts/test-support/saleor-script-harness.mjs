/**
 * Test support for the scripts that talk to Saleor: an in-process fake GraphQL endpoint, and a
 * runner that starts a script as a child process pointed at it.
 *
 * The scripts read `.env.local` from the repo root for any variable that is not set. The runner
 * therefore sets every variable they read, and refuses to start without the fake's URL, so a
 * test can never reach the instance a developer has configured.
 */
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { isAbsolute, resolve } from "node:path";

const SCRIPTS_DIR = resolve(import.meta.dirname, "..");

/** A GraphQL connection holding all `nodes` in one page. */
export function connection(nodes) {
	return {
		pageInfo: { hasNextPage: false, endCursor: null },
		edges: nodes.map((node) => ({ node })),
	};
}

/**
 * Starts a fake Saleor. `resolve({ operation, query, variables, token })` answers each request:
 * return the `data` object, throw to answer with a GraphQL error, or return
 * `{ status, body }` for a plain HTTP response (a gateway error page).
 *
 * @returns {Promise<{url: string, requests: object[], close: () => Promise<void>}>}
 */
export async function startFakeSaleor(resolveRequest) {
	const requests = [];
	const server = createServer(async (req, res) => {
		let body = "";
		for await (const chunk of req) body += chunk;
		const { query, variables } = JSON.parse(body);
		const request = {
			operation: /\b(?:query|mutation)\s+(\w+)/.exec(query)?.[1] ?? null,
			query,
			variables: variables ?? {},
			token: req.headers.authorization?.replace(/^Bearer /, "") ?? null,
		};
		requests.push(request);

		let payload;
		try {
			const result = await resolveRequest(request);
			if (result && typeof result.status === "number") {
				res.writeHead(result.status, { "content-type": "text/html" });
				res.end(result.body ?? "");
				return;
			}
			payload = { data: result };
		} catch (error) {
			payload = { errors: [{ message: error.message }] };
		}
		res.writeHead(200, { "content-type": "application/json" });
		res.end(JSON.stringify(payload));
	});

	await new Promise((ready) => server.listen(0, "127.0.0.1", ready));
	return {
		url: `http://127.0.0.1:${server.address().port}/graphql/`,
		requests,
		close: () => new Promise((closed) => server.close(closed)),
	};
}

/**
 * Runs a script from `scripts/` (or an absolute path) and resolves with its exit code and output.
 * `apiUrl` must be a fake server's URL. `env` adds or replaces variables; `cleanEnv` drops the
 * defaults below, for a script copy that reads its own env file.
 *
 * @returns {Promise<{code: number, stdout: string, stderr: string}>}
 */
export function runScript(script, args, { apiUrl, env = {}, cleanEnv = false } = {}) {
	if (!cleanEnv && !apiUrl?.startsWith("http://127.0.0.1:")) {
		throw new Error("runScript needs the URL of a fake Saleor started by startFakeSaleor");
	}
	const defaults = cleanEnv
		? {}
		: {
				NEXT_PUBLIC_SALEOR_API_URL: apiUrl,
				NEXT_PUBLIC_DEFAULT_CHANNEL: "default-channel",
				NEXT_PUBLIC_DEFAULT_LOCALE: "en",
				// Empty counts as not set for the scripts, and keeps `.env.local` from filling them in.
				SALEOR_APP_TOKEN: "",
				SALEOR_ADMIN_TOKEN: "",
				SALEOR_CONFIGURATOR_TOKEN: "",
				SALEOR_MAX_CONCURRENT_REQUESTS: "3",
				SALEOR_MIN_REQUEST_DELAY_MS: "0",
				SALEOR_REQUEST_TIMEOUT_MS: "5000",
				NEXT_BUILD_RETRIES: "0",
			};

	return new Promise((done) => {
		execFile(
			process.execPath,
			[isAbsolute(script) ? script : resolve(SCRIPTS_DIR, script), ...args],
			{ env: { PATH: process.env.PATH, ...defaults, ...env }, maxBuffer: 32 * 1024 * 1024 },
			(error, stdout, stderr) => {
				done({ code: error ? (typeof error.code === "number" ? error.code : 1) : 0, stdout, stderr });
			},
		);
	});
}
