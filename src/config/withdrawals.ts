/**
 * Withdrawal function
 *
 * Consumers in the EU and EEA withdraw from an online purchase through a function on the shop:
 * two labelled steps and an immediate receipt (Consumer Rights Directive Art. 11a, as amended by
 * Directive (EU) 2023/2673). Paper shows it on channels that ship to at least one EU or EEA
 * country, the same test that picks the prior-price rule (`src/config/pricing.ts`).
 *
 * Override per channel slug: `true` shows it on a channel that would not get it (for example a
 * voluntary returns policy in the UK), `false` hides it.
 *
 * Paper ships the screens with the `stub` provider: they end in an email to the seller, which is
 * not a withdrawal function on its own. A backend that records withdrawals and sends the receipt
 * plugs in as a provider (`src/lib/withdrawals`). See docs/selling-in-the-eu.md.
 */
export const withdrawalFunctionByChannel: Readonly<Record<string, boolean>> = {};
