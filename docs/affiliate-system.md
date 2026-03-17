# Affiliate System

## Overview

The affiliate system lets partners earn commissions by referring customers to InfinityBio Labs. It uses Saleor's voucher codes for attribution, a SQLite database for commission tracking, and a public application page for onboarding.

## Architecture

```
Customer visits ?ref=CODE
        │
        ▼
  Middleware sets cookie (30 days)
        │
        ▼
  Customer shops → goes to checkout
        │
        ▼
  useAffiliateCode hook auto-applies promo code
        │
        ▼
  Saleor validates voucher, applies discount
        │
        ▼
  Customer pays → Saleor fires ORDER_PAID webhook
        │
        ▼
  /api/affiliate/webhook records commission in SQLite
```

## Components

### Files

| File                                                      | Purpose                                                                     |
| --------------------------------------------------------- | --------------------------------------------------------------------------- |
| `src/middleware.ts`                                       | Captures `?ref=CODE` → sets `affiliate_code` cookie, redirects to clean URL |
| `src/lib/affiliate/types.ts`                              | TypeScript interfaces                                                       |
| `src/lib/affiliate/db.ts`                                 | SQLite database layer (tables, CRUD)                                        |
| `src/app/api/affiliate/apply/route.ts`                    | Public application endpoint (rate-limited)                                  |
| `src/app/api/affiliate/webhook/route.ts`                  | ORDER_PAID webhook handler (HMAC verified)                                  |
| `src/app/api/affiliate/admin/route.ts`                    | Admin API (Bearer token auth)                                               |
| `src/app/[channel]/(main)/affiliate/page.tsx`             | Public affiliate landing page                                               |
| `src/app/[channel]/(main)/affiliate/application-form.tsx` | Application form (client component)                                         |
| `src/checkout/hooks/use-affiliate-code.ts`                | Auto-applies promo code from cookie at checkout                             |

### Database Tables (SQLite)

**affiliates** — approved affiliate partners

- `id`, `code` (unique, maps to Saleor voucher), `name`, `email`, `commission_rate` (0–1), `active`, timestamps

**commissions** — commission records per order

- `id`, `affiliate_id`, `order_id` (unique, idempotent), `order_number`, `order_total`, `discount_amount`, `commission_amount`, `currency`, `status` (pending/approved/paid), timestamps

**affiliate_applications** — incoming applications

- `id`, `name`, `email` (unique), `website`, `social_media`, `promotion_plan`, `status` (pending/approved/rejected), `admin_notes`, timestamps

### Environment Variables

| Variable                 | Required | Description                                       |
| ------------------------ | -------- | ------------------------------------------------- |
| `AFFILIATE_ADMIN_SECRET` | Yes      | Bearer token for admin API                        |
| `AFFILIATE_DB_PATH`      | No       | SQLite file path (default: `./data/affiliate.db`) |
| `SALEOR_WEBHOOK_SECRET`  | Yes      | HMAC secret from Saleor webhook config            |

## Setup

### 1. Saleor Webhook

In Saleor Dashboard → Configuration → Webhooks:

- **Name**: Affiliate Commission Tracker
- **Target URL**: `https://infinitybiolabs.com/api/affiliate/webhook`
- **Events**: `ORDER_PAID`
- **Subscription query**:

```graphql
subscription {
	event {
		... on OrderPaid {
			order {
				id
				number
				total {
					gross {
						amount
						currency
					}
				}
				discounts {
					amount {
						amount
					}
				}
				voucher {
					code
				}
			}
		}
	}
}
```

After creating the webhook, copy the **secret key** and add it to `.env.prod`:

```
SALEOR_WEBHOOK_SECRET=<the-secret-from-saleor>
```

Then restart the storefront container.

### 2. Docker Volume

The `storefront-data` volume is already configured in `docker-compose.prod.yml`. The SQLite database persists at `/app/data/affiliate.db` inside the container.

### 3. Deploy

Push to `main` — the GitHub Actions workflow builds and deploys automatically.

## Affiliate Lifecycle

### 1. Application

Prospects visit `/default-channel/affiliate` and submit the application form. The application is stored in `affiliate_applications` with status `pending`.

### 2. Review & Approval

List pending applications:

```bash
curl -H "Authorization: Bearer $SECRET" \
  "https://infinitybiolabs.com/api/affiliate/admin?view=applications&status=pending"
```

Approve (this creates the affiliate record automatically):

```bash
curl -X POST -H "Authorization: Bearer $SECRET" -H "Content-Type: application/json" \
  "https://infinitybiolabs.com/api/affiliate/admin" \
  -d '{
    "action": "approve_application",
    "application_id": 1,
    "code": "JOHN10",
    "commission_rate": 0.15
  }'
```

Reject:

```bash
curl -X POST -H "Authorization: Bearer $SECRET" -H "Content-Type: application/json" \
  "https://infinitybiolabs.com/api/affiliate/admin" \
  -d '{
    "action": "reject_application",
    "application_id": 2,
    "notes": "Insufficient audience reach"
  }'
```

### 3. Create Matching Voucher in Saleor

After approving an application, create the voucher code in Saleor Dashboard:

1. Go to **Catalog → Vouchers → Create Voucher**
2. Set the **code** to the same value you used in approval (e.g., `JOHN10`)
3. Set the **discount type** (e.g., Percentage, 10% off)
4. Configure usage limits as desired (e.g., `applyOncePerCustomer: true`)
5. Save

### 4. Affiliate Shares Link

The affiliate shares their referral URL:

```
https://infinitybiolabs.com?ref=JOHN10
```

When a customer visits this URL:

1. Middleware captures `JOHN10` → sets `affiliate_code` cookie (30 days)
2. URL is cleaned to `https://infinitybiolabs.com` (redirect)
3. Cookie persists across browsing sessions

### 5. Auto-Apply at Checkout

When the customer reaches checkout:

1. `useAffiliateCode` hook reads the `affiliate_code` cookie
2. Calls `checkoutAddPromoCode` mutation with the code
3. Saleor validates and applies the discount
4. If the code is invalid/expired, the cookie is cleared silently

### 6. Commission Recording

When the order is paid:

1. Saleor fires `ORDER_PAID` webhook
2. Handler extracts the voucher code from the order
3. Looks up the affiliate by code
4. Calculates commission: `order_total × commission_rate`
5. Stores in `commissions` table with status `pending`
6. Idempotent — duplicate orders are ignored

### 7. Payout Management

List all affiliates with their commission stats:

```bash
curl -H "Authorization: Bearer $SECRET" \
  "https://infinitybiolabs.com/api/affiliate/admin?view=affiliates"
```

List commissions for a specific affiliate:

```bash
curl -H "Authorization: Bearer $SECRET" \
  "https://infinitybiolabs.com/api/affiliate/admin?view=commissions&affiliate_id=1"
```

Mark commissions as approved:

```bash
curl -X POST -H "Authorization: Bearer $SECRET" -H "Content-Type: application/json" \
  "https://infinitybiolabs.com/api/affiliate/admin" \
  -d '{"action": "update_commission_status", "ids": [1, 2, 3], "status": "approved"}'
```

Mark as paid (after sending payment):

```bash
curl -X POST -H "Authorization: Bearer $SECRET" -H "Content-Type: application/json" \
  "https://infinitybiolabs.com/api/affiliate/admin" \
  -d '{"action": "update_commission_status", "ids": [1, 2, 3], "status": "paid"}'
```

## Admin API Reference

All endpoints require `Authorization: Bearer <AFFILIATE_ADMIN_SECRET>` header.

### GET /api/affiliate/admin

| Parameter      | Values                                                | Description                     |
| -------------- | ----------------------------------------------------- | ------------------------------- |
| `view`         | `affiliates` (default), `commissions`, `applications` | Which data to return            |
| `status`       | `pending`, `approved`, `paid`, `rejected`             | Filter by status                |
| `affiliate_id` | number                                                | Filter commissions by affiliate |
| `limit`        | number (default 50, max 200)                          | Pagination                      |
| `offset`       | number (default 0)                                    | Pagination                      |

### POST /api/affiliate/admin

| Action                     | Fields                                                 | Description                   |
| -------------------------- | ------------------------------------------------------ | ----------------------------- |
| `create_affiliate`         | `code`, `name`, `email`, `commission_rate`             | Manually create affiliate     |
| `update_affiliate`         | `id`, `name?`, `email?`, `commission_rate?`, `active?` | Update affiliate              |
| `update_commission_status` | `ids[]`, `status`                                      | Bulk update commission status |
| `approve_application`      | `application_id`, `code`, `commission_rate`, `notes?`  | Approve + create affiliate    |
| `reject_application`       | `application_id`, `notes?`                             | Reject application            |

### POST /api/affiliate/apply (public, no auth)

| Field            | Required | Description                |
| ---------------- | -------- | -------------------------- |
| `name`           | Yes      | Applicant name             |
| `email`          | Yes      | Contact email              |
| `website`        | No       | Website/blog URL           |
| `social_media`   | No       | Social media handle or URL |
| `promotion_plan` | Yes      | How they plan to promote   |

Rate limited: 3 requests per 15 minutes per IP.

## Backup

The SQLite database is stored in the `storefront-data` Docker volume. To back it up:

```bash
# Find the volume mount point
docker volume inspect saleor_storefront-data --format '{{ .Mountpoint }}'

# Copy the DB file
cp /var/lib/docker/volumes/saleor_storefront-data/_data/affiliate.db /opt/saleor/backups/affiliate-$(date +%Y%m%d).db
```

Consider adding this to the existing `scripts/backup-db.sh` cron job.
