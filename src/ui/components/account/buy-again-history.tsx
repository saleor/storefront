"use client";

import { SaleorImage } from "@/ui/atoms/saleor-image";
import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
	ArrowRight,
	Check,
	CheckCircle2,
	ChevronDown,
	Clock3,
	Layers3,
	Loader2,
	Package,
	RotateCcw,
	ShoppingBag,
} from "lucide-react";
import { buyAgain, type BuyAgainResult } from "@/app/actions";
import type { RepeatOrder } from "@/lib/custom/buy-again";
import { bumpChromeVersion } from "@/lib/chrome-sync";
import { formatDate, formatMoney, cn } from "@/lib/utils";
import { resolveLocaleFromSlug } from "@/config/locale";
import { useCart } from "@/ui/components/cart/cart-context";
import { Button } from "@/ui/components/ui/button";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

export type BuyAgainApproach = "compact" | "preview" | "shelf";

export function BuyAgainHistory({
	orders,
	channel,
	localeSlug,
	review = false,
	initialApproach = "compact",
}: {
	orders: RepeatOrder[];
	channel: string;
	localeSlug: string;
	review?: boolean;
	initialApproach?: BuyAgainApproach;
}) {
	const t = useTranslations("buyAgain");
	const [approach, setApproach] = useState(initialApproach);
	const [result, setResult] = useState<{ orderId: string; value: BuyAgainResult } | null>(null);
	const [active, setActive] = useState<string | null>(null);
	const [pending, startTransition] = useTransition();
	const locked = useRef(false);
	const { openCart } = useCart();
	const locale = resolveLocaleFromSlug(localeSlug).bcp47;
	const approaches = [
		{ id: "compact" as const, icon: RotateCcw, title: t("compact"), description: t("compactDescription") },
		{ id: "preview" as const, icon: Package, title: t("preview"), description: t("previewDescription") },
		{ id: "shelf" as const, icon: Layers3, title: t("shelf"), description: t("shelfDescription") },
	];

	function repeat(order: RepeatOrder) {
		if (locked.current) return;
		locked.current = true;
		setActive(order.id);
		setResult(null);
		startTransition(async () => {
			try {
				const value = await buyAgain({
					channel,
					localeSlug,
					lines: order.lines.map(({ variantId, quantity }) => ({ variantId, quantity })),
				});
				setResult({ orderId: order.id, value });
				bumpChromeVersion();
				if (value.ok && approach === "preview") openCart();
			} catch {
				setResult({ orderId: order.id, value: { ok: false, error: "uncertain" } });
			} finally {
				locked.current = false;
				setActive(null);
			}
		});
	}

	function feedback(order: RepeatOrder) {
		if (result?.orderId !== order.id) return null;
		return (
			<div
				role="status"
				aria-live="polite"
				className={cn(
					"mt-4 rounded-lg border p-4 text-sm",
					result.value.ok
						? "border-border bg-secondary text-secondary-foreground"
						: "border-destructive text-destructive",
				)}
			>
				{result.value.ok ? (
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex items-start gap-2">
							<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
							<div>
								<p className="font-medium">{t("added", { count: result.value.added })}</p>
								{result.value.skipped > 0 && (
									<p className="mt-1 text-muted-foreground">
										{t("skipped", { count: result.value.skipped })}
									</p>
								)}
							</div>
						</div>
						<Button variant="ghost" size="sm" className="min-h-11" onClick={openCart}>
							{t("viewBag")}
							<ArrowRight className="h-4 w-4" />
						</Button>
					</div>
				) : (
					t(result.value.error)
				)}
			</div>
		);
	}

	function action(order: RepeatOrder, wide = false) {
		const available = order.lines.some((line) => line.variantId && line.available > 0);
		const otherChannel = order.channel !== channel;
		const added = result?.orderId === order.id && result.value.ok;
		return (
			<Button
				className={wide ? "min-h-11 w-full" : "min-h-11 w-full sm:w-auto"}
				disabled={pending || !available || otherChannel || order.lines.length > 100}
				onClick={() => repeat(order)}
				aria-label={`${t("buyAgain")} · ${t("order", { number: order.number })}`}
			>
				{pending && active === order.id ? (
					<Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
				) : added ? (
					<Check className="h-4 w-4" />
				) : (
					<RotateCcw className="h-4 w-4" />
				)}
				{otherChannel
					? t("otherChannel")
					: !available
						? t("notAvailable")
						: pending && active === order.id
							? t("adding")
							: added
								? t("addAgain")
								: t("buyAgain")}
			</Button>
		);
	}

	function thumbnails(order: RepeatOrder, large = false) {
		return (
			<div className={cn("flex", large ? "gap-3" : "-space-x-3")}>
				{order.lines.slice(0, 3).map((line, index) => (
					<div
						key={`${line.variantId}-${index}`}
						className={cn(
							"relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-background bg-muted",
							large ? "h-20 w-20 sm:h-24 sm:w-24" : "h-14 w-14 border-2",
						)}
					>
						{line.image ? (
							<SaleorImage
								src={line.image}
								srcSet={`${line.image} 256w`}
								sizes="96px"
								alt={line.name}
								className={cn("h-full w-full object-contain", !line.available && "opacity-40")}
							/>
						) : (
							<Package className="h-6 w-6 text-muted-foreground" />
						)}
						{large && (
							<span className="absolute bottom-1 right-1 rounded bg-background px-1.5 text-xs font-medium">
								×{line.quantity}
							</span>
						)}
					</div>
				))}
			</div>
		);
	}

	function items(order: RepeatOrder) {
		return (
			<ul className="divide-y divide-border">
				{order.lines.map((line, index) => (
					<li key={`${line.variantId}-${index}`} className="flex items-center gap-4 py-4">
						<div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
							{line.image ? (
								<SaleorImage
									src={line.image}
									srcSet={`${line.image} 256w`}
									sizes="64px"
									alt=""
									className={cn("h-full w-full object-contain", !line.available && "opacity-40")}
								/>
							) : (
								<Package className="h-5 w-5 text-muted-foreground" />
							)}
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-medium">{line.name}</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{line.variant} · {t("quantity", { count: line.quantity })}
							</p>
						</div>
						<span
							className={cn(
								"max-w-28 text-right text-xs",
								line.available ? "text-foreground" : "text-muted-foreground",
							)}
						>
							{line.available >= line.quantity
								? t("available")
								: line.available > 0
									? t("limited", { count: line.available })
									: t("unavailableItem")}
						</span>
					</li>
				))}
			</ul>
		);
	}

	function summary(order: RepeatOrder) {
		return (
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<h3 className="text-sm font-semibold">{t("order", { number: order.number })}</h3>
					<span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
						{order.status}
					</span>
				</div>
				<p className="mt-1.5 text-xs text-muted-foreground">
					<time dateTime={order.created}>{formatDate(new Date(order.created), undefined, locale)}</time>
					{" · "}
					{t("items", { count: order.lines.reduce((sum, line) => sum + line.quantity, 0) })}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{review && (
				<section aria-label={t("compare")} className="rounded-xl border bg-muted/40 p-2">
					<div className="grid gap-2 sm:grid-cols-3" role="group" aria-label={t("compare")}>
						{approaches.map(({ id, icon: Icon, title }, index) => (
							<button
								key={id}
								type="button"
								aria-pressed={approach === id}
								disabled={pending}
								onClick={() => {
									setApproach(id);
									const url = new URL(window.location.href);
									url.searchParams.set("approach", id);
									window.history.replaceState(null, "", url);
								}}
								className={cn(
									"flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
									approach === id
										? "bg-foreground text-background shadow-sm"
										: "text-muted-foreground hover:bg-background hover:text-foreground",
								)}
							>
								<span className="text-xs opacity-60">0{index + 1}</span>
								<Icon className="h-4 w-4" />
								<span className="font-medium">{title}</span>
							</button>
						))}
					</div>
					<p className="px-4 pb-2 pt-4 text-sm text-muted-foreground">
						{approaches.find((item) => item.id === approach)?.description}
					</p>
				</section>
			)}

			{approach === "shelf" && (
				<section className="space-y-4">
					<div className="flex items-end justify-between gap-3">
						<div>
							<p className="text-eyebrow text-muted-foreground">{t("shortcuts")}</p>
							<h2 className="mt-1 text-h3">{t("favorites")}</h2>
						</div>
						<RotateCcw className="h-5 w-5 text-muted-foreground" />
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						{orders.slice(0, 2).map((order) => (
							<article key={order.id} className="rounded-xl border bg-card p-5 text-card-foreground">
								{thumbnails(order, true)}
								<div className="mb-4 mt-5">{summary(order)}</div>
								<p className="mb-4 text-sm text-muted-foreground">
									{t("readyCount", {
										count: order.lines.reduce(
											(sum, line) => sum + Math.min(line.quantity, line.available),
											0,
										),
									})}
								</p>
								{action(order, true)}
								{feedback(order)}
							</article>
						))}
					</div>
					<h2 className="pt-4 text-h3">{t("allOrders")}</h2>
				</section>
			)}

			<div className="space-y-4">
				{orders.map((order) => (
					<article key={order.id} className="overflow-hidden rounded-xl border bg-card text-card-foreground">
						<div
							className={cn(
								"flex flex-wrap items-center gap-4 p-5 sm:p-6",
								approach === "preview" && "border-b bg-muted/30",
							)}
						>
							{approach !== "preview" && thumbnails(order)}
							{summary(order)}
							<div className="flex w-full items-center justify-between gap-3 text-right sm:block sm:w-auto">
								<p className="text-sm font-semibold tabular-nums">
									{formatMoney(order.total, order.currency, locale)}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">{t("originalTotal")}</p>
							</div>
							{approach !== "preview" && <div className="w-full sm:w-auto">{action(order)}</div>}
						</div>
						{approach === "preview" ? (
							<div className="px-5 pb-5 sm:px-6 sm:pb-6">
								{items(order)}
								<div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
									<p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
										{t("availabilityNote")}
									</p>
									{action(order)}
								</div>
								{feedback(order)}
							</div>
						) : (
							<div className="px-5 pb-5 sm:px-6">
								{feedback(order)}
								<details className="group">
									<summary className="flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 rounded text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
										<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
										{t("seeItems")}
									</summary>
									{items(order)}
								</details>
							</div>
						)}
						{!review && (
							<div className="border-t px-6 py-3">
								<LinkWithChannel
									href={`/account/orders/${order.number}`}
									className="inline-flex items-center gap-2 text-xs font-medium hover:underline"
								>
									{t("orderDetails")}
									<ArrowRight className="h-3 w-3" />
								</LinkWithChannel>
							</div>
						)}
					</article>
				))}
			</div>
			<div className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
				<ShoppingBag className="mt-0.5 h-4 w-4 shrink-0" />
				<p>{t("footnote")}</p>
			</div>
			{review && (
				<div className="flex items-center gap-2 border-t pt-5 text-xs text-muted-foreground">
					<Clock3 className="h-3.5 w-3.5" />
					{t("demoNote")}
				</div>
			)}
		</div>
	);
}
