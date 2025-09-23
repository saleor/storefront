/**
 * Stripe Payment Manager
 *
 * Handles proper idempotency, payment intent lifecycle, and transaction management
 * following the refined Stripe app integration flow.
 */

// Simple UUID v4 generator without external dependency
function generateUuid(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

interface PaymentSession {
	checkoutId: string;
	amount: number;
	currency: string;
	publishableKey: string | null;
	clientSecret: string | null;
	transactionId: string | null;
	idempotencyKey: string;
	paymentIntentId: string | null;
	initialized: boolean;
	lastInitializedAmount: number;
	createdAt: number;
}

interface InitializationLock {
	checkoutId: string;
	promise: Promise<PaymentSession>;
	timestamp: number;
}

/**
 * Manages Stripe payment sessions with proper idempotency and lifecycle management
 */
export class StripePaymentManager {
	private static instance: StripePaymentManager;
	private sessions = new Map<string, PaymentSession>();
	private initializationLocks = new Map<string, InitializationLock>();

	// Session expiry time (30 minutes)
	private readonly SESSION_EXPIRY_MS = 30 * 60 * 1000;
	// Lock timeout (10 seconds)
	private readonly LOCK_TIMEOUT_MS = 10 * 1000;

	private constructor() {
		// Cleanup expired sessions every 5 minutes
		setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
	}

	static getInstance(): StripePaymentManager {
		if (!StripePaymentManager.instance) {
			StripePaymentManager.instance = new StripePaymentManager();
		}
		return StripePaymentManager.instance;
	}

	/**
	 * Get or create a payment session with proper idempotency
	 */
	getOrCreateSession(checkoutId: string, amount: number, currency: string): PaymentSession {
		const sessionKey = this.getSessionKey(checkoutId);
		const existingSession = this.sessions.get(sessionKey);
		const now = Date.now();

		// Check if existing session is valid and for the same amount
		if (existingSession && !this.isSessionExpired(existingSession) && existingSession.amount === amount) {
			console.log("StripePaymentManager: Reusing existing session", { checkoutId, amount, existingSession });
			return existingSession;
		}

		// Create new session with fresh idempotency key
		const newSession: PaymentSession = {
			checkoutId,
			amount,
			currency,
			publishableKey: null,
			clientSecret: null,
			transactionId: null,
			idempotencyKey: this.generateIdempotencyKey(checkoutId, amount),
			paymentIntentId: null,
			initialized: false,
			lastInitializedAmount: amount,
			createdAt: now,
		};

		this.sessions.set(sessionKey, newSession);
		console.log("StripePaymentManager: Created new session", { checkoutId, amount, newSession });

		return newSession;
	}

	/**
	 * Update session with initialization results
	 */
	updateSession(
		checkoutId: string,
		updates: Partial<
			Pick<
				PaymentSession,
				"publishableKey" | "clientSecret" | "transactionId" | "paymentIntentId" | "initialized"
			>
		>,
	): PaymentSession | null {
		const sessionKey = this.getSessionKey(checkoutId);
		const session = this.sessions.get(sessionKey);

		if (!session) {
			console.warn("StripePaymentManager: Attempted to update non-existent session", { checkoutId });
			return null;
		}

		const updatedSession = { ...session, ...updates };
		this.sessions.set(sessionKey, updatedSession);

		console.log("StripePaymentManager: Updated session", { checkoutId, updates, updatedSession });
		return updatedSession;
	}

	/**
	 * Get existing session without creating new one
	 */
	getSession(checkoutId: string): PaymentSession | null {
		const sessionKey = this.getSessionKey(checkoutId);
		const session = this.sessions.get(sessionKey);

		if (!session || this.isSessionExpired(session)) {
			return null;
		}

		return session;
	}

	/**
	 * Clear session (e.g., on checkout completion or cancellation)
	 */
	clearSession(checkoutId: string): void {
		const sessionKey = this.getSessionKey(checkoutId);
		this.sessions.delete(sessionKey);
		this.initializationLocks.delete(sessionKey);
		console.log("StripePaymentManager: Cleared session", { checkoutId });
	}

	/**
	 * Acquire initialization lock to prevent concurrent API calls
	 */
	async acquireInitializationLock<T>(checkoutId: string, initializationFn: () => Promise<T>): Promise<T> {
		const lockKey = this.getSessionKey(checkoutId);
		const existingLock = this.initializationLocks.get(lockKey);
		const now = Date.now();

		// If there's an existing lock and it's not expired, wait for it
		if (existingLock && now - existingLock.timestamp < this.LOCK_TIMEOUT_MS) {
			console.log("StripePaymentManager: Waiting for existing initialization lock", { checkoutId });
			try {
				return (await existingLock.promise) as T;
			} catch (error) {
				console.warn("StripePaymentManager: Existing lock failed, acquiring new one", { checkoutId, error });
			}
		}

		// Create new lock
		const lockPromise = this.executeWithLock(initializationFn);
		const lock: InitializationLock = {
			checkoutId,
			promise: lockPromise as Promise<PaymentSession>,
			timestamp: now,
		};

		this.initializationLocks.set(lockKey, lock);

		try {
			const result = await lockPromise;
			return result;
		} finally {
			// Clean up lock after completion
			this.initializationLocks.delete(lockKey);
		}
	}

	/**
	 * Check if session needs reinitialization (amount changed, expired, etc.)
	 */
	shouldReinitialize(checkoutId: string, amount: number): boolean {
		const session = this.getSession(checkoutId);

		if (!session) {
			return true; // No session exists
		}

		if (this.isSessionExpired(session)) {
			return true; // Session expired
		}

		if (session.amount !== amount) {
			return true; // Amount changed
		}

		if (!session.initialized || !session.clientSecret) {
			return true; // Session not properly initialized
		}

		return false;
	}

	private async executeWithLock<T>(fn: () => Promise<T>): Promise<T> {
		return fn();
	}

	private generateIdempotencyKey(checkoutId: string, amount: number): string {
		// Include timestamp to ensure uniqueness across sessions but consistency within session
		const timestamp = Math.floor(Date.now() / 1000); // Round to seconds
		return `stripe_payment_${checkoutId}_${amount}_${timestamp}_${generateUuid().substring(0, 8)}`;
	}

	private getSessionKey(checkoutId: string): string {
		return `stripe_session_${checkoutId}`;
	}

	private isSessionExpired(session: PaymentSession): boolean {
		return Date.now() - session.createdAt > this.SESSION_EXPIRY_MS;
	}

	private cleanupExpiredSessions(): void {
		const now = Date.now();
		let cleanedCount = 0;

		for (const [key, session] of this.sessions.entries()) {
			if (this.isSessionExpired(session)) {
				this.sessions.delete(key);
				cleanedCount++;
			}
		}

		// Cleanup expired locks
		for (const [key, lock] of this.initializationLocks.entries()) {
			if (now - lock.timestamp > this.LOCK_TIMEOUT_MS) {
				this.initializationLocks.delete(key);
			}
		}

		if (cleanedCount > 0) {
			console.log("StripePaymentManager: Cleaned up expired sessions", { cleanedCount });
		}
	}

	/**
	 * Get debug info about current sessions
	 */
	getDebugInfo() {
		return {
			sessionsCount: this.sessions.size,
			locksCount: this.initializationLocks.size,
			sessions: Array.from(this.sessions.entries()).map(([key, session]) => ({
				key,
				checkoutId: session.checkoutId,
				amount: session.amount,
				initialized: session.initialized,
				hasClientSecret: !!session.clientSecret,
				age: Date.now() - session.createdAt,
				idempotencyKey: session.idempotencyKey,
			})),
		};
	}
}
