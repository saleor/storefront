"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Activity, AlertTriangle, X, ChevronDown, ChevronUp } from "lucide-react";

/**
 * GraphQL Request Monitor for Development
 *
 * Shows a floating widget that tracks:
 * - Total request count
 * - Requests per second (detects loops!)
 * - Errors
 * - Most frequent operations
 *
 * Alerts when request rate exceeds threshold (likely infinite loop).
 */

type RequestSource = "storefront" | "checkout";

interface RequestLog {
	operation: string;
	timestamp: number;
	duration?: number;
	error?: string;
	errorCode?: string;
	variables?: Record<string, unknown>;
	source?: RequestSource;
	isRetry?: boolean;
	retryCount?: number;
}

interface ErrorLog {
	operation: string;
	error: string;
	errorCode?: string;
	timestamp: number;
	variables?: Record<string, unknown>;
}

interface OperationStats {
	count: number;
	errors: number;
	retries: number;
	avgDuration: number;
	lastSeen: number;
}

interface SourceStats {
	total: number;
	errors: number;
}

// Global store for request logs (persists across re-renders)
const requestLogs: RequestLog[] = [];
const errorLogs: ErrorLog[] = [];
const operationStats = new Map<string, OperationStats>();
const sourceStats: Record<RequestSource, SourceStats> = {
	storefront: { total: 0, errors: 0 },
	checkout: { total: 0, errors: 0 },
};
let totalRequests = 0;
let totalErrors = 0;
let totalRetries = 0;

// Track recent failed operations for retry detection
const recentFailedOps = new Map<string, { timestamp: number; count: number }>();
const RETRY_WINDOW_MS = 5000; // Consider it a retry if same operation fails within 5s

// Thresholds for alerts
const RATE_ALERT_THRESHOLD = 5; // requests/second
const WINDOW_SIZE_MS = 5000; // 5 second window for rate calculation

// Dev testing: simulate random failures
let simulateFailureRate = 0; // 0 = disabled, 0.5 = 50% failure rate
export function setSimulateFailureRate(rate: number) {
	simulateFailureRate = Math.max(0, Math.min(1, rate));
}
export function getSimulateFailureRate() {
	return simulateFailureRate;
}

/**
 * Call this from your GraphQL client to log requests.
 * Works with any client (urql, Apollo, fetch).
 */
export function logGraphQLRequest(log: RequestLog) {
	if (process.env.NODE_ENV !== "development") return;

	// Detect if this is a retry (same operation failed recently)
	const recentFailed = recentFailedOps.get(log.operation);
	const now = log.timestamp;
	let isRetry = false;
	let retryCount = 0;

	if (recentFailed && now - recentFailed.timestamp < RETRY_WINDOW_MS) {
		isRetry = true;
		retryCount = recentFailed.count + 1;
		totalRetries++;
	}

	// Update recent failed ops tracking
	if (log.error) {
		recentFailedOps.set(log.operation, {
			timestamp: now,
			count: isRetry ? retryCount : 1,
		});
	} else {
		// Success clears the retry tracking for this operation
		recentFailedOps.delete(log.operation);
	}

	// Add retry info to log
	const enrichedLog: RequestLog = {
		...log,
		isRetry,
		retryCount: isRetry ? retryCount : undefined,
	};

	requestLogs.push(enrichedLog);
	totalRequests++;

	if (log.error) {
		totalErrors++;
		// Track error details
		errorLogs.push({
			operation: log.operation,
			error: log.error,
			errorCode: log.errorCode,
			timestamp: log.timestamp,
			variables: log.variables,
		});
		// Keep only last 50 errors
		if (errorLogs.length > 50) {
			errorLogs.shift();
		}
	}

	// Track by source
	if (log.source) {
		sourceStats[log.source].total++;
		if (log.error) sourceStats[log.source].errors++;
	}

	// Keep only last 1000 logs
	if (requestLogs.length > 1000) {
		requestLogs.shift();
	}

	// Update operation stats
	const stats = operationStats.get(log.operation) || {
		count: 0,
		errors: 0,
		retries: 0,
		avgDuration: 0,
		lastSeen: 0,
	};
	stats.count++;
	if (log.error) stats.errors++;
	if (isRetry) stats.retries++;
	if (log.duration) {
		stats.avgDuration = (stats.avgDuration * (stats.count - 1) + log.duration) / stats.count;
	}
	stats.lastSeen = log.timestamp;
	operationStats.set(log.operation, stats);

	// Dispatch custom event for React components to listen to
	window.dispatchEvent(new CustomEvent("graphql-request", { detail: enrichedLog }));
}

type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * Helper to wrap fetch for automatic logging
 * @param originalFetch - The fetch function to wrap
 * @param source - Tag requests with their source ("storefront" or "checkout")
 */
export function createMonitoredFetch(originalFetch: FetchFn, source?: RequestSource): FetchFn {
	return async (input, init) => {
		const body = init?.body;
		let operation = "unknown";
		let variables: Record<string, unknown> | undefined;

		// Parse GraphQL operation name from body
		if (typeof body === "string") {
			try {
				const parsed = JSON.parse(body) as { query?: string; variables?: Record<string, unknown> };
				const match = parsed.query?.match(/(?:query|mutation)\s+(\w+)/);
				operation = match?.[1] || "anonymous";
				variables = parsed.variables;
			} catch {
				// Not JSON, ignore
			}
		}

		// Dev testing: simulate random failures
		if (simulateFailureRate > 0 && Math.random() < simulateFailureRate) {
			const error = "Simulated network failure (dev testing)";
			logGraphQLRequest({
				operation,
				timestamp: Date.now(),
				duration: 50,
				error,
				variables,
				source,
			});
			throw new Error(error);
		}

		const start = performance.now();
		let error: string | undefined;
		let errorCode: string | undefined;
		let wasAborted = false;

		try {
			const response = await originalFetch(input, init);

			// Check for GraphQL errors in response
			if (response.headers.get("content-type")?.includes("application/json")) {
				const clone = response.clone();
				try {
					const json = (await clone.json()) as {
						errors?: Array<{ message: string }>;
						data?: Record<string, { errors?: Array<{ message?: string; code?: string }> }>;
					};
					// Top-level GraphQL errors
					if (json.errors?.length) {
						error = json.errors[0].message;
					}
					// Saleor mutation errors (in data.mutationName.errors)
					if (json.data) {
						for (const val of Object.values(json.data)) {
							if (val?.errors?.length) {
								error = val.errors[0].message || error;
								errorCode = val.errors[0].code;
								break;
							}
						}
					}
				} catch {
					// Ignore parse errors
				}
			}

			return response;
		} catch (e) {
			// Don't log abort signals as errors - these are expected in React Strict Mode
			// or when components unmount during fetch
			const isAbort =
				(e instanceof DOMException && e.name === "AbortError") ||
				(e instanceof Error && e.message.includes("abort"));

			if (isAbort) {
				wasAborted = true;
				throw e;
			}

			error = e instanceof Error ? e.message : "Network error";
			throw e;
		} finally {
			// Skip logging aborted requests - they're expected in dev (React Strict Mode)
			if (!wasAborted) {
				const duration = performance.now() - start;
				logGraphQLRequest({
					operation,
					timestamp: Date.now(),
					duration,
					error,
					errorCode,
					variables,
					source,
				});
			}
		}
	};
}

export function GraphQLMonitor() {
	const [isOpen, setIsOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [stats, setStats] = useState({
		total: 0,
		errors: 0,
		retries: 0,
		rate: 0,
		storefront: { total: 0, errors: 0 },
		checkout: { total: 0, errors: 0 },
		operations: [] as [string, OperationStats][],
		recentErrors: [] as ErrorLog[],
		recentRequests: [] as RequestLog[],
	});
	const [showErrors, setShowErrors] = useState(false);
	const [showRequests, setShowRequests] = useState(false);
	const [expandedError, setExpandedError] = useState<ErrorLog | null>(null);
	const [expandedRequest, setExpandedRequest] = useState<RequestLog | null>(null);
	const [alert, setAlert] = useState<string | null>(null);
	const lastAlertRef = useRef<number>(0);

	// Calculate request rate over sliding window
	const calculateRate = useCallback(() => {
		const now = Date.now();
		const windowStart = now - WINDOW_SIZE_MS;
		const recentRequests = requestLogs.filter((log) => log.timestamp > windowStart);
		return recentRequests.length / (WINDOW_SIZE_MS / 1000);
	}, []);

	// Update stats periodically
	useEffect(() => {
		if (process.env.NODE_ENV !== "development") return;

		const updateStats = () => {
			const rate = calculateRate();
			const sortedOps = Array.from(operationStats.entries()).sort((a, b) => b[1].count - a[1].count);

			setStats({
				total: totalRequests,
				errors: totalErrors,
				retries: totalRetries,
				rate,
				storefront: { ...sourceStats.storefront },
				checkout: { ...sourceStats.checkout },
				operations: sortedOps.slice(0, 10),
				recentErrors: [...errorLogs].reverse().slice(0, 10),
				recentRequests: [...requestLogs].reverse().slice(0, 20),
			});

			// Alert on high request rate (likely infinite loop!)
			const now = Date.now();
			if (rate > RATE_ALERT_THRESHOLD && now - lastAlertRef.current > 10000) {
				lastAlertRef.current = now;
				const topOp = sortedOps[0];
				setAlert(
					`⚠️ High request rate: ${rate.toFixed(1)}/sec!\n` +
						`Most frequent: ${topOp?.[0]} (${topOp?.[1].count} calls)\n` +
						`Possible infinite loop detected!`,
				);
				setIsOpen(true);
			}
		};

		// Listen for new requests
		const handleRequest = () => updateStats();
		window.addEventListener("graphql-request", handleRequest);

		// Periodic update for rate decay
		const interval = setInterval(updateStats, 1000);

		return () => {
			window.removeEventListener("graphql-request", handleRequest);
			clearInterval(interval);
		};
	}, [calculateRate]);

	// Don't render in production
	if (process.env.NODE_ENV !== "development") return null;

	// Minimized state - just show icon
	if (!isOpen) {
		return (
			<button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-4 right-4 z-[9999] flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition-transform hover:scale-110"
				title="GraphQL Monitor"
			>
				<Activity className="h-5 w-5" />
				{stats.rate > RATE_ALERT_THRESHOLD && (
					<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px]">
						!
					</span>
				)}
			</button>
		);
	}

	return (
		<div className="fixed bottom-4 right-4 z-[9999] w-80 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-xs text-white shadow-2xl">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 px-3 py-2">
				<div className="flex items-center gap-2">
					<Activity className="h-4 w-4 text-green-400" />
					<span className="font-semibold">GraphQL Monitor</span>
				</div>
				<div className="flex items-center gap-1">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="rounded p-1 hover:bg-zinc-700"
						title={isExpanded ? "Collapse" : "Expand"}
					>
						{isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
					</button>
					<button onClick={() => setIsOpen(false)} className="rounded p-1 hover:bg-zinc-700" title="Minimize">
						<X className="h-4 w-4" />
					</button>
				</div>
			</div>

			{/* Alert banner */}
			{alert && (
				<div className="flex items-start gap-2 border-b border-red-800 bg-red-900/50 px-3 py-2">
					<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
					<div className="flex-1 whitespace-pre-wrap text-red-200">{alert}</div>
					<button onClick={() => setAlert(null)} className="shrink-0 text-red-400 hover:text-red-200">
						<X className="h-3 w-3" />
					</button>
				</div>
			)}

			{/* Stats */}
			<div className="grid grid-cols-4 gap-2 border-b border-zinc-700 px-3 py-2">
				<div>
					<div className="text-zinc-400">Requests</div>
					<div className="text-lg font-bold">{stats.total}</div>
				</div>
				<div>
					<div className="text-zinc-400">Errors</div>
					<div className={`text-lg font-bold ${stats.errors > 0 ? "text-red-400" : ""}`}>{stats.errors}</div>
				</div>
				<div>
					<div className="text-zinc-400">Retries</div>
					<div className={`text-lg font-bold ${stats.retries > 0 ? "text-yellow-400" : ""}`}>
						{stats.retries}
					</div>
				</div>
				<div>
					<div className="text-zinc-400">Rate</div>
					<div className={`text-lg font-bold ${stats.rate > RATE_ALERT_THRESHOLD ? "text-red-400" : ""}`}>
						{stats.rate.toFixed(1)}/s
					</div>
				</div>
			</div>

			{/* Errors section (clickable) */}
			{stats.errors > 0 && (
				<button
					onClick={() => setShowErrors(!showErrors)}
					className="flex w-full items-center justify-between border-b border-zinc-700 bg-red-900/20 px-3 py-2 text-left hover:bg-red-900/30"
				>
					<span className="flex items-center gap-2 text-red-400">
						<AlertTriangle className="h-3.5 w-3.5" />
						<span>{stats.recentErrors.length} recent errors</span>
					</span>
					{showErrors ? (
						<ChevronUp className="h-4 w-4 text-red-400" />
					) : (
						<ChevronDown className="h-4 w-4 text-red-400" />
					)}
				</button>
			)}

			{/* Recent errors list */}
			{showErrors && stats.recentErrors.length > 0 && !expandedError && (
				<div className="max-h-48 overflow-y-auto border-b border-zinc-700 bg-red-950/20">
					{stats.recentErrors.map((err, i) => (
						<button
							key={`${err.timestamp}-${i}`}
							onClick={() => setExpandedError(err)}
							className="block w-full border-t border-red-900/30 px-3 py-2 text-left hover:bg-red-900/20"
						>
							<div className="flex items-center justify-between">
								<span className="font-medium text-red-300">{err.operation}</span>
								{err.errorCode && (
									<span className="rounded bg-red-900/50 px-1.5 py-0.5 text-[10px] text-red-300">
										{err.errorCode}
									</span>
								)}
							</div>
							<div className="mt-1 truncate text-red-400/80">{err.error}</div>
							<div className="mt-1 text-[10px] text-zinc-500">
								{new Date(err.timestamp).toLocaleTimeString()} · Click for details
							</div>
						</button>
					))}
				</div>
			)}

			{/* Expanded error detail */}
			{expandedError && (
				<div className="border-b border-zinc-700 bg-red-950/30">
					<div className="flex items-center justify-between border-b border-red-900/30 px-3 py-2">
						<span className="font-medium text-red-300">{expandedError.operation}</span>
						<button
							onClick={() => setExpandedError(null)}
							className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
					<div className="space-y-2 p-3">
						{expandedError.errorCode && (
							<div>
								<div className="text-[10px] uppercase text-zinc-500">Error Code</div>
								<div className="rounded bg-red-900/50 px-2 py-1 font-mono text-red-300">
									{expandedError.errorCode}
								</div>
							</div>
						)}
						<div>
							<div className="text-[10px] uppercase text-zinc-500">Message</div>
							<div className="whitespace-pre-wrap break-words rounded bg-zinc-800 p-2 text-red-300">
								{expandedError.error}
							</div>
						</div>
						{expandedError.variables && Object.keys(expandedError.variables).length > 0 && (
							<div>
								<div className="text-[10px] uppercase text-zinc-500">Variables</div>
								<pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words rounded bg-zinc-800 p-2 text-zinc-300">
									{JSON.stringify(expandedError.variables, null, 2)}
								</pre>
							</div>
						)}
						<div className="text-[10px] text-zinc-500">
							{new Date(expandedError.timestamp).toLocaleString()}
						</div>
					</div>
				</div>
			)}

			{/* Recent requests toggle */}
			<button
				onClick={() => {
					setShowRequests(!showRequests);
					setExpandedRequest(null);
				}}
				className="flex w-full items-center justify-between border-b border-zinc-700 px-3 py-2 text-left hover:bg-zinc-800"
			>
				<span className="text-zinc-400">Recent requests</span>
				{showRequests ? (
					<ChevronUp className="h-4 w-4 text-zinc-400" />
				) : (
					<ChevronDown className="h-4 w-4 text-zinc-400" />
				)}
			</button>

			{/* Recent requests list */}
			{showRequests && !expandedRequest && (
				<div className="max-h-48 overflow-y-auto border-b border-zinc-700">
					{stats.recentRequests.map((req, i) => (
						<button
							key={`${req.timestamp}-${i}`}
							onClick={() => setExpandedRequest(req)}
							className={`block w-full border-t border-zinc-800 px-3 py-2 text-left hover:bg-zinc-800 ${
								req.error ? "bg-red-950/20" : ""
							} ${req.isRetry ? "bg-yellow-950/20" : ""}`}
						>
							<div className="flex items-center justify-between">
								<span className="flex items-center gap-2">
									<span className={`font-medium ${req.error ? "text-red-300" : "text-zinc-200"}`}>
										{req.operation}
									</span>
									{req.isRetry && (
										<span className="rounded bg-yellow-900/50 px-1.5 py-0.5 text-[10px] text-yellow-300">
											retry #{req.retryCount}
										</span>
									)}
								</span>
								<span className="text-[10px] text-zinc-500">
									{req.duration ? `${req.duration.toFixed(0)}ms` : ""}
								</span>
							</div>
							{req.error && <div className="mt-1 truncate text-xs text-red-400/80">{req.error}</div>}
							<div className="mt-1 text-[10px] text-zinc-500">
								{new Date(req.timestamp).toLocaleTimeString()}
							</div>
						</button>
					))}
					{stats.recentRequests.length === 0 && (
						<div className="px-3 py-4 text-center text-zinc-500">No requests yet</div>
					)}
				</div>
			)}

			{/* Expanded request detail */}
			{expandedRequest && (
				<div className="border-b border-zinc-700 bg-zinc-800/50">
					<div className="flex items-center justify-between border-b border-zinc-700 px-3 py-2">
						<span className={`font-medium ${expandedRequest.error ? "text-red-300" : "text-zinc-200"}`}>
							{expandedRequest.operation}
						</span>
						<button
							onClick={() => setExpandedRequest(null)}
							className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
					<div className="space-y-2 p-3">
						<div className="flex flex-wrap gap-4 text-xs">
							{expandedRequest.duration && (
								<div>
									<span className="text-zinc-500">Duration: </span>
									<span className="text-green-400">{expandedRequest.duration.toFixed(0)}ms</span>
								</div>
							)}
							<div>
								<span className="text-zinc-500">Status: </span>
								<span className={expandedRequest.error ? "text-red-400" : "text-green-400"}>
									{expandedRequest.error ? "Error" : "Success"}
								</span>
							</div>
							{expandedRequest.isRetry && (
								<div>
									<span className="text-zinc-500">Retry: </span>
									<span className="text-yellow-400">#{expandedRequest.retryCount}</span>
								</div>
							)}
						</div>
						{expandedRequest.error && (
							<div>
								<div className="text-[10px] uppercase text-zinc-500">Error</div>
								<div className="whitespace-pre-wrap break-words rounded bg-red-950/30 p-2 text-xs text-red-300">
									{expandedRequest.errorCode && (
										<span className="mr-2 rounded bg-red-900/50 px-1.5 py-0.5 text-[10px]">
											{expandedRequest.errorCode}
										</span>
									)}
									{expandedRequest.error}
								</div>
							</div>
						)}
						{expandedRequest.variables && Object.keys(expandedRequest.variables).length > 0 && (
							<div>
								<div className="text-[10px] uppercase text-zinc-500">Variables</div>
								<pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words rounded bg-zinc-900 p-2 text-xs text-zinc-300">
									{JSON.stringify(expandedRequest.variables, null, 2)}
								</pre>
							</div>
						)}
						<div className="text-[10px] text-zinc-500">
							{new Date(expandedRequest.timestamp).toLocaleString()}
						</div>
					</div>
				</div>
			)}

			{/* Operations list (expanded) */}
			{isExpanded && (
				<div className="max-h-64 overflow-y-auto">
					<div className="px-3 py-2 text-zinc-400">Top Operations</div>
					{stats.operations.map(([name, opStats]) => (
						<div key={name} className="flex items-center justify-between border-t border-zinc-800 px-3 py-2">
							<div className="truncate">
								<div className="font-medium">{name}</div>
								<div className="text-zinc-500">
									{opStats.avgDuration > 0 && `${opStats.avgDuration.toFixed(0)}ms avg`}
								</div>
							</div>
							<div className="text-right">
								<div className={opStats.count > 100 ? "text-yellow-400" : ""}>{opStats.count}</div>
								{opStats.errors > 0 && <div className="text-red-400">{opStats.errors} err</div>}
								{opStats.retries > 0 && <div className="text-yellow-400">{opStats.retries} retry</div>}
							</div>
						</div>
					))}
					{stats.operations.length === 0 && (
						<div className="px-3 py-4 text-center text-zinc-500">No requests yet</div>
					)}
				</div>
			)}

			{/* Footer */}
			<div className="flex items-center justify-between border-t border-zinc-700 bg-zinc-800 px-3 py-1.5 text-zinc-500">
				<span className="text-[10px]">Dev mode only</span>
				<div className="flex items-center gap-2">
					<button
						onClick={() => {
							const current = getSimulateFailureRate();
							const next = current === 0 ? 0.5 : 0;
							setSimulateFailureRate(next);
							// Force re-render
							setAlert(next > 0 ? `🧪 Failure simulation ON (${next * 100}%)` : null);
						}}
						className={`rounded px-2 py-0.5 text-[10px] ${
							getSimulateFailureRate() > 0
								? "bg-red-700 text-white hover:bg-red-600"
								: "bg-zinc-700 hover:bg-zinc-600"
						}`}
					>
						{getSimulateFailureRate() > 0 ? "Chaos: ON" : "Chaos: OFF"}
					</button>
				</div>
			</div>
		</div>
	);
}
