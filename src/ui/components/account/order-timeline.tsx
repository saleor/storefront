import { type OrderFullDetailsFragment } from "@/gql/graphql";
import { getTranslations } from "next-intl/server";
import { resolveLocaleFromSlug } from "@/config/locale";
import { formatDate } from "@/lib/utils";

type Props = {
	order: OrderFullDetailsFragment;
	localeSlug: string;
};

type TimelineEvent = {
	label: string;
	description: string;
	date: Date;
	isCurrent: boolean;
};

export async function OrderTimeline({ order, localeSlug }: Props) {
	const intlLocale = resolveLocaleFromSlug(localeSlug).bcp47;
	const t = await getTranslations({ locale: localeSlug, namespace: "account.fulfillment" });
	const tDetail = await getTranslations({ locale: localeSlug, namespace: "account.orderDetail" });

	const events: TimelineEvent[] = [];

	events.push({
		label: t("orderConfirmed"),
		description: t("orderConfirmedDescription"),
		date: new Date(order.created),
		isCurrent: false,
	});

	for (const fulfillment of order.fulfillments) {
		const statusKey = fulfillment.status;
		const label = t(statusKey);
		const baseDescription = t(`${statusKey}Description`);
		const itemCount = fulfillment.lines?.reduce((sum, l) => sum + l.quantity, 0) ?? 0;
		const description =
			itemCount > 0
				? t("descriptionWithItems", { description: baseDescription, count: itemCount })
				: baseDescription;

		events.push({
			label,
			description,
			date: new Date(fulfillment.created),
			isCurrent: false,
		});

		if (fulfillment.trackingNumber) {
			events.push({
				label: t("trackingUpdated"),
				description: t("trackingNumber", { number: fulfillment.trackingNumber }),
				date: new Date(fulfillment.created),
				isCurrent: false,
			});
		}
	}

	events.sort((a, b) => b.date.getTime() - a.date.getTime());

	if (events.length > 0) {
		events[0].isCurrent = true;
	}

	if (events.length === 0) return null;

	return (
		<div className="rounded-xl border">
			<div className="border-b px-5 py-4">
				<h2 className="text-sm font-semibold">{tDetail("timeline")}</h2>
			</div>
			<div className="px-5 py-4">
				<ol className="relative ml-3 border-l border-border">
					{events.map((event, i) => (
						<li key={i} className="relative mb-6 ml-6 last:mb-0">
							<span
								className={`absolute -left-[calc(1.5rem+5px)] top-1 h-2.5 w-2.5 rounded-full border-2 border-background ${
									event.isCurrent ? "bg-foreground" : "bg-muted-foreground/40"
								}`}
							/>
							<p
								className={`text-sm ${
									event.isCurrent ? "font-semibold" : "font-medium text-muted-foreground"
								}`}
							>
								{event.label}
							</p>
							{event.description && (
								<p className="mt-0.5 text-[13px] text-muted-foreground">{event.description}</p>
							)}
							<p className="mt-0.5 text-[13px] text-muted-foreground">
								<time dateTime={event.date.toISOString()}>
									{formatDate(event.date, undefined, intlLocale)}
								</time>
							</p>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}
