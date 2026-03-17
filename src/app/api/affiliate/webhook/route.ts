import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getAffiliateByCode, recordCommission, getCommissionByOrderId } from "@/lib/affiliate/db";

const WEBHOOK_SECRET = process.env.SALEOR_WEBHOOK_SECRET;

/**
 * Verify Saleor webhook HMAC signature.
 */
function verifySignature(payload: string, signature: string | null): boolean {
	if (!WEBHOOK_SECRET || !signature) return false;
	const hmac = createHmac("sha256", WEBHOOK_SECRET);
	hmac.update(payload);
	const expected = hmac.digest("hex");
	try {
		return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
	} catch {
		return false;
	}
}

/**
 * Webhook handler for ORDER_PAID events from Saleor.
 *
 * Configure in Saleor Dashboard → Configuration → Webhooks:
 *   URL: https://your-site.com/api/affiliate/webhook
 *   Events: ORDER_PAID
 *   Subscription query:
 *
 *   subscription {
 *     event {
 *       ... on OrderPaid {
 *         order {
 *           id
 *           number
 *           userEmail
 *           total { gross { amount currency } }
 *           discounts { amount { amount } }
 *           voucher { code }
 *           channel { slug }
 *         }
 *       }
 *     }
 *   }
 */
export async function POST(request: NextRequest) {
	const rawBody = await request.text();

	// Verify webhook signature
	const signature = request.headers.get("saleor-signature");
	if (!verifySignature(rawBody, signature)) {
		console.warn("[Affiliate Webhook] Invalid signature");
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	let payload: unknown;
	try {
		payload = JSON.parse(rawBody);
	} catch {
		return Response.json({ error: "Invalid JSON" }, { status: 400 });
	}

	// Extract order from Saleor webhook payload.
	// Saleor subscription webhooks wrap data differently than sync webhooks.
	const order = extractOrder(payload);
	if (!order) {
		console.log("[Affiliate Webhook] No order data in payload, skipping");
		return Response.json({ ok: true, skipped: true });
	}

	const voucherCode = order.voucher?.code;
	if (!voucherCode) {
		console.log(`[Affiliate Webhook] Order #${order.number} has no voucher, skipping`);
		return Response.json({ ok: true, skipped: true });
	}

	// Check if we already recorded a commission for this order (idempotency)
	const existing = getCommissionByOrderId(order.id);
	if (existing) {
		console.log(`[Affiliate Webhook] Commission already recorded for order ${order.id}`);
		return Response.json({ ok: true, skipped: true, reason: "duplicate" });
	}

	// Look up the affiliate by voucher code
	const affiliate = getAffiliateByCode(voucherCode);
	if (!affiliate) {
		console.log(`[Affiliate Webhook] Voucher "${voucherCode}" is not an affiliate code, skipping`);
		return Response.json({ ok: true, skipped: true });
	}

	if (!affiliate.active) {
		console.log(`[Affiliate Webhook] Affiliate "${affiliate.code}" is inactive, skipping`);
		return Response.json({ ok: true, skipped: true, reason: "inactive" });
	}

	// Calculate commission
	const orderTotal = order.total?.gross?.amount ?? 0;
	const currency = order.total?.gross?.currency ?? "USD";
	const discountAmount =
		order.discounts?.reduce(
			(sum: number, d: { amount?: { amount?: number } }) => sum + (d.amount?.amount ?? 0),
			0,
		) ?? 0;

	// Commission is calculated on the order total (after discount)
	const commissionAmount = Math.round(orderTotal * affiliate.commission_rate * 100) / 100;

	const commission = recordCommission({
		affiliate_id: affiliate.id,
		order_id: order.id,
		order_number: order.number ?? "",
		order_total: orderTotal,
		discount_amount: discountAmount,
		commission_amount: commissionAmount,
		currency,
	});

	const sanitizedCode = voucherCode.replace(/[\r\n]/g, "");
	const sanitizedNumber = (order.number ?? "").replace(/[\r\n]/g, "");
	console.log(
		`[Affiliate Webhook] Recorded commission: order #${sanitizedNumber}, ` +
			`affiliate "${sanitizedCode}", amount ${commissionAmount} ${currency}`,
	);

	return Response.json({
		ok: true,
		commission: {
			id: commission.id,
			order_number: order.number,
			affiliate_code: affiliate.code,
			commission_amount: commissionAmount,
			currency,
		},
	});
}

// ============================================================================
// Payload parsing
// ============================================================================

interface OrderPayload {
	id: string;
	number?: string;
	total?: { gross?: { amount?: number; currency?: string } };
	discounts?: Array<{ amount?: { amount?: number } }>;
	voucher?: { code?: string };
}

/**
 * Extract order data from various Saleor webhook payload formats.
 * Handles both subscription-based and legacy event payloads.
 */
function extractOrder(payload: unknown): OrderPayload | null {
	if (!payload || typeof payload !== "object") return null;
	const data = payload as Record<string, unknown>;

	// Subscription payload: { order: { ... } }
	if (data.order && typeof data.order === "object") {
		return data.order as OrderPayload;
	}

	// Legacy payload with event wrapper
	if (data.event && typeof data.event === "object") {
		const event = data.event as Record<string, unknown>;
		if (event.order && typeof event.order === "object") {
			return event.order as OrderPayload;
		}
	}

	return null;
}
