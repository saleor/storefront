"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import {
	ArrowRight,
	Check,
	CheckCircle2,
	Package,
	RotateCcw,
	ShoppingBag,
	SlidersHorizontal,
} from "lucide-react";
import { buyAgain } from "@/app/buy-again/actions";
import { type BuyAgainItem, type BuyAgainOrder } from "@/lib/custom/buy-again";
import { bumpChromeVersion } from "@/lib/chrome-sync";
import { cn, formatMoney } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { SaleorImage } from "@/ui/atoms/saleor-image";
import { Button } from "@/ui/components/ui/button";
import { useCart } from "@/ui/components/cart/cart-context";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetTitle,
	SheetDescription,
	SheetCloseButton,
} from "@/ui/components/ui/sheet";

const approaches = [
	{
		id: "quick",
		number: "01",
		name: "Quick add",
		description: "Your favorites, without the extra steps.",
		icon: RotateCcw,
	},
	{
		id: "inline",
		number: "02",
		name: "Pick your items",
		description: "Keep what you love. Leave the rest.",
		icon: CheckCircle2,
	},
	{
		id: "panel",
		number: "03",
		name: "Review panel",
		description: "A little more context. The same easy reorder.",
		icon: SlidersHorizontal,
	},
] as const;

export type BuyAgainApproach = (typeof approaches)[number]["id"];

export function BuyAgainHistory({
	orders,
	locale,
	approach,
	demo = false,
}: {
	orders: BuyAgainOrder[];
	locale: string;
	approach: BuyAgainApproach;
	demo?: boolean;
}) {
	const selected = approaches.find((item) => item.id === approach) ?? approaches[0];
	return (
		<div className="space-y-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="mb-2 text-eyebrow uppercase tracking-widest text-muted-foreground">
						Made for your next order
					</p>
					<h1 className="text-h1 tracking-tight">Order history</h1>
					<p className="mt-2 text-sm text-muted-foreground">Good things are worth coming back to.</p>
				</div>
				<LinkWithChannel href="/products" className="inline-flex items-center gap-2 text-sm font-medium">
					Continue shopping <ArrowRight className="h-4 w-4" />
				</LinkWithChannel>
			</div>
			<nav
				aria-label="Buy again approaches"
				className="grid gap-2 rounded-xl bg-secondary/60 p-2 sm:grid-cols-3"
			>
				{approaches.map(({ id, number, name, icon: Icon }) => (
					<LinkWithChannel
						key={id}
						href={`${demo ? "/buy-again" : "/account/orders"}?approach=${id}`}
						aria-current={approach === id ? "page" : undefined}
						className={cn(
							"flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
							approach === id
								? "bg-background font-semibold shadow-sm"
								: "text-muted-foreground hover:bg-background/60",
						)}
					>
						<span className="text-xs tabular-nums text-muted-foreground">{number}</span>
						<Icon className="h-4 w-4" />
						{name}
						{approach === id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
					</LinkWithChannel>
				))}
			</nav>
			<div className="flex items-start justify-between gap-4 border-b pb-5">
				<div>
					<h2 className="text-h3">{selected.name}</h2>
					<p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
				</div>
				<span className="shrink-0 rounded-full border px-3 py-1 text-xs text-muted-foreground">
					{orders.length} orders
				</span>
			</div>
			<div className="space-y-5">
				{orders.map((order) => (
					<BuyAgainOrderCard
						key={`${approach}-${order.id}`}
						order={order}
						locale={locale}
						approach={approach}
						demo={demo}
					/>
				))}
			</div>
			<p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
				<ShoppingBag className="h-4 w-4 shrink-0" />
				Items are added to your existing cart at today’s prices. Cart discounts are applied in your bag.
				Unavailable items are skipped. Nothing is purchased until checkout.
			</p>
		</div>
	);
}

function ItemImage({ item, large = false }: { item: BuyAgainItem; large?: boolean }) {
	return (
		<div
			className={cn(
				"relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary/60",
				large ? "h-20 w-20" : "h-14 w-14",
			)}
		>
			{item.image ? (
				<SaleorImage src={item.image} alt={item.name} sizes="80px" className="object-contain p-1" />
			) : (
				<Package className="h-6 w-6 text-muted-foreground" strokeWidth={1.25} />
			)}
		</div>
	);
}

function BuyAgainOrderCard({
	order,
	locale,
	approach,
	demo,
}: {
	order: BuyAgainOrder;
	locale: string;
	approach: BuyAgainApproach;
	demo: boolean;
}) {
	const available = order.items.filter((item) => item.variantId && item.available > 0 && item.price !== null);
	const [selection, setSelection] = useState(() => new Set(available.map((item) => item.key)));
	const [panelOpen, setPanelOpen] = useState(false);
	const [pending, startTransition] = useTransition();
	const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
	const { openCart } = useCart();
	const { channel } = useParams<{ channel: string }>();
	const differentMarket = channel !== order.channel;
	const picked = available.filter((item) => selection.has(item.key));
	const units = picked.reduce((sum, item) => sum + Math.min(item.quantity, item.available), 0);
	const subtotal = picked.reduce(
		(sum, item) => sum + (item.price ?? 0) * Math.min(item.quantity, item.available),
		0,
	);
	const unavailable = order.items.length - available.length;
	const limited = available.some((item) => item.available < item.quantity);
	const originalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);

	function addItems() {
		setFeedback(null);
		startTransition(async () => {
			try {
				const result = await buyAgain({
					channel: order.channel,
					locale,
					lines: picked.flatMap((item) =>
						item.variantId ? [{ variantId: item.variantId, quantity: item.quantity }] : [],
					),
				});
				if (!result.ok) {
					setFeedback({ ok: false, message: result.message });
					return;
				}
				const skipped = unavailable + result.skipped;
				setFeedback({
					ok: true,
					message: `${result.added} ${result.added === 1 ? "item" : "items"} added to your cart.${skipped ? " Unavailable quantities were skipped." : ""}`,
				});
				bumpChromeVersion();
			} catch {
				setFeedback({
					ok: false,
					message: "We could not confirm the update. Check your cart before trying again.",
				});
			}
		});
	}

	const addButton = (
		<Button
			onClick={addItems}
			disabled={pending || units === 0 || picked.length > 50 || differentMarket}
			className="min-w-36"
		>
			{pending ? (
				<RotateCcw className="h-4 w-4 animate-spin motion-reduce:animate-none" />
			) : (
				<RotateCcw className="h-4 w-4" />
			)}
			{pending
				? "Adding…"
				: units === 0
					? available.length
						? "Select items"
						: "Unavailable"
					: approach === "inline" || panelOpen
						? `Add ${units} ${units === 1 ? "item" : "items"}`
						: "Buy again"}
		</Button>
	);

	const feedbackBlock = feedback && (
		<div
			role={feedback.ok ? "status" : "alert"}
			className={cn(
				"flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm",
				feedback.ok ? "bg-secondary/50" : "text-destructive",
			)}
		>
			<span className="flex items-center gap-2">
				{feedback.ok && <Check className="h-4 w-4" />}
				{feedback.message}
			</span>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => {
					setPanelOpen(false);
					openCart();
				}}
			>
				View cart <ArrowRight className="h-4 w-4" />
			</Button>
		</div>
	);

	const itemPicker = (
		<div className="divide-y">
			{order.items.map((item) => {
				const enabled = available.some((candidate) => candidate.key === item.key);
				return (
					<label
						key={item.key}
						className={cn(
							"flex items-center gap-4 py-4",
							!enabled && "opacity-60",
							enabled && "cursor-pointer",
						)}
					>
						<input
							type="checkbox"
							checked={enabled && selection.has(item.key)}
							disabled={!enabled || pending}
							aria-label={`Select ${item.name}`}
							className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
							onChange={() =>
								setSelection((current) => {
									const next = new Set(current);
									if (next.has(item.key)) next.delete(item.key);
									else next.add(item.key);
									return next;
								})
							}
						/>
						<ItemImage item={item} />
						<span className="min-w-0 flex-1">
							<span className="block text-sm font-medium">{item.name}</span>
							<span className="mt-1 block text-xs text-muted-foreground">
								{item.option || "Original variant"} · Qty {item.quantity}
							</span>
							<span className="mt-1 block text-xs text-muted-foreground">
								{enabled
									? item.available < item.quantity
										? `Only ${item.available} available`
										: "Available to buy again"
									: "No longer available · skipped"}
							</span>
						</span>
						{enabled && item.price !== null && (
							<span className="text-sm font-medium tabular-nums">
								{formatMoney(item.price * Math.min(item.quantity, item.available), item.currency)}
							</span>
						)}
					</label>
				);
			})}
		</div>
	);

	return (
		<Sheet open={panelOpen} onOpenChange={setPanelOpen}>
			<article
				className="overflow-hidden rounded-xl border bg-background"
				aria-label={`Order ${order.number}`}
			>
				<div className="flex flex-wrap items-center justify-between gap-3 border-b bg-secondary/30 px-5 py-4">
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
						<span className="text-sm font-semibold">Order #{order.number}</span>
						<time dateTime={order.date} className="text-xs text-muted-foreground">
							{new Intl.DateTimeFormat("en", {
								month: "short",
								day: "numeric",
								year: "numeric",
								timeZone: "UTC",
							}).format(new Date(order.date))}
						</time>
					</div>
					<span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs">
						<CheckCircle2 className="h-3.5 w-3.5" />
						{order.status}
					</span>
				</div>
				<div className="space-y-5 p-5 sm:p-6">
					{approach === "inline" ? (
						itemPicker
					) : (
						<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
							<div className="flex min-w-0 items-center gap-4">
								<div className="flex -space-x-2">
									{order.items.slice(0, 3).map((item) => (
										<div key={item.key} className="rounded-lg border-2 border-background">
											<ItemImage item={item} large />
										</div>
									))}
								</div>
								<div className="min-w-0">
									<p className="text-sm font-medium">
										{originalUnits} {originalUnits === 1 ? "item" : "items"}
									</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{available.length
											? `${available.length} of ${order.items.length} products available`
											: "These items are no longer available"}
									</p>
									{limited && (
										<p className="mt-1 text-xs text-muted-foreground">Some quantities are limited</p>
									)}
								</div>
							</div>
							<div className="shrink-0">
								<p className="text-xs text-muted-foreground">Original total</p>
								<p className="mt-1 text-lg font-semibold tabular-nums">
									{formatMoney(order.total, order.currency)}
								</p>
							</div>
						</div>
					)}
					<div className="flex flex-wrap items-center justify-between gap-4 border-t pt-5">
						<div>
							<p className="text-sm">
								{units ? (
									<>
										<span className="font-semibold tabular-nums">
											{formatMoney(subtotal, order.currency)}
										</span>
										<span className="text-muted-foreground">
											{" "}
											today · {units} {units === 1 ? "item" : "items"}
										</span>
									</>
								) : (
									<span className="text-sm text-muted-foreground">
										{available.length ? "Select at least one item" : "Nothing available to reorder"}
									</span>
								)}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{unavailable
									? `${unavailable} unavailable ${unavailable === 1 ? "product will" : "products will"} be skipped`
									: "Original quantities · current prices"}
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							{approach === "panel" && (
								<SheetTrigger asChild>
									<Button variant="outline-solid">Review items</Button>
								</SheetTrigger>
							)}
							{!demo && (
								<LinkWithChannel
									href={`/account/orders/${order.number}`}
									className="px-2 text-xs underline underline-offset-4"
								>
									Order details
								</LinkWithChannel>
							)}
							{addButton}
						</div>
					</div>
					{feedbackBlock}
					{differentMarket && (
						<a
							href={`/${locale}/${order.channel}/account/orders`}
							className="block text-sm underline underline-offset-4"
						>
							Switch to the {order.channel} market to buy these items again.
						</a>
					)}
				</div>
				{approach === "panel" && (
					<SheetContent className="flex flex-col">
						<div className="border-b p-6">
							<div className="flex items-center justify-between">
								<SheetTitle>Make it yours, again.</SheetTitle>
								<SheetCloseButton />
							</div>
							<SheetDescription className="mt-2">
								Order #{order.number} · Select the items you want to bring back.
							</SheetDescription>
						</div>
						<div className="flex-1 overflow-y-auto px-6">{itemPicker}</div>
						<div className="space-y-4 border-t bg-background p-6">
							<div className="flex items-center justify-between text-sm">
								<span>
									{units} {units === 1 ? "item" : "items"} at today’s prices
								</span>
								<strong className="tabular-nums">{formatMoney(subtotal, order.currency)}</strong>
							</div>
							<p className="text-xs text-muted-foreground">
								Cart discounts apply in your bag. Shipping and taxes are confirmed at checkout.
							</p>
							<div className="flex justify-end">{addButton}</div>
							{feedbackBlock}
						</div>
					</SheetContent>
				)}
			</article>
		</Sheet>
	);
}
