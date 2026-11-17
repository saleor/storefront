"use client";

import {
	startTransition,
	useActionState,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
	type FormEvent,
	type ReactNode,
} from "react";
import { useTranslations } from "next-intl";

import { withdrawAction } from "@/app/(storefront)/[locale]/[channel]/(main)/withdraw/actions";
import type {
	WithdrawContext,
	WithdrawField,
	WithdrawFieldError,
	WithdrawNotice,
	WithdrawOrderView,
	WithdrawState,
	WithdrawValues,
} from "@/lib/withdrawals/flow-types";
import { cn } from "@/lib/utils";
import { SaleorImage } from "@/ui/atoms/saleor-image";
import { Button, buttonClassName } from "@/ui/components/ui/button";
import { Checkbox } from "@/ui/components/ui/checkbox";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

const fieldId = (field: WithdrawField) => `withdraw-${field}`;
const noSubscribe = () => () => {};
/** False in the server HTML and until hydration: submit buttons wait, so an early tap never sends the form. */
const useHydrated = () =>
	useSyncExternalStore(
		noSubscribe,
		() => true,
		() => false,
	);
const errorId = (field: WithdrawField) => `withdraw-${field}-error`;
const SUMMARY_FIELDS: WithdrawField[] = ["orderId", "name", "orderNumber", "email", "lines", "itemsText"];

/**
 * The withdraw screens: details, review and confirm, then the receipt (or the email route).
 * Plain forms posting to a server action, so every step also works without JavaScript; with it,
 * changing the scope refreshes the statement in place.
 */
export function WithdrawFlow({ initialState }: { initialState: WithdrawState }) {
	const [state, dispatch, pending] = useActionState(withdrawAction, initialState);
	// Submitted by hand rather than through <form action>: React resets a form after an action,
	// which would put the scope choices back to their first values mid-selection.
	const formAction = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const submitter = (event.nativeEvent as SubmitEvent).submitter;
		const formData = new FormData(event.currentTarget, submitter ?? undefined);
		startTransition(() => dispatch(formData));
	};
	const headingRef = useRef<HTMLHeadingElement>(null);
	const summaryRef = useRef<HTMLDivElement>(null);
	const firstRender = useRef(true);

	// `?order=` is a Saleor order ID, which works like a key: once read, take it off the address
	// bar so it does not stay in the browser history.
	useEffect(() => {
		const url = new URL(window.location.href);
		if (!url.searchParams.has("order")) return;
		url.searchParams.delete("order");
		window.history.replaceState(window.history.state, "", url);
	}, []);

	// Each step change is announced: focus the error summary when there is one, else the heading.
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		// A statement refresh while choosing items keeps focus where the customer is.
		if (state.step === "review" && state.quiet) return;
		(summaryRef.current ?? headingRef.current)?.focus();
	}, [state, headingRef, summaryRef]);

	switch (state.step) {
		case "details":
			return (
				<DetailsStep
					state={state}
					formAction={formAction}
					pending={pending}
					headingRef={headingRef}
					summaryRef={summaryRef}
				/>
			);
		case "review":
			return (
				<ReviewStep
					state={state}
					formAction={formAction}
					pending={pending}
					headingRef={headingRef}
					summaryRef={summaryRef}
				/>
			);
		case "receipt":
			return <ReceiptView state={state} headingRef={headingRef} />;
		case "email":
			return <EmailView state={state} headingRef={headingRef} summaryRef={summaryRef} />;
	}
}

type StepProps<S extends WithdrawState["step"]> = {
	state: Extract<WithdrawState, { step: S }>;
	formAction: (event: FormEvent<HTMLFormElement>) => void;
	pending: boolean;
	headingRef: React.RefObject<HTMLHeadingElement | null>;
	summaryRef: React.RefObject<HTMLDivElement | null>;
};

function ContextFields({ context }: { context: WithdrawContext }) {
	return (
		<>
			<input type="hidden" name="locale" value={context.locale} />
			<input type="hidden" name="channel" value={context.channel} />
			<input type="hidden" name="mode" value={context.mode} />
			<input type="hidden" name="integration" value={context.provider} />
		</>
	);
}

function StepHeading({
	step,
	children,
	headingRef,
}: {
	step?: 1 | 2;
	children: ReactNode;
	headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
	const t = useTranslations("withdraw");
	return (
		<div className="grid gap-2">
			{step ? <p className="text-sm text-muted-foreground">{t("step", { step })}</p> : null}
			<h1 ref={headingRef} tabIndex={-1} className="text-balance text-h1 text-foreground outline-none">
				{children}
			</h1>
		</div>
	);
}

function ErrorSummary({
	notice,
	fieldErrors,
	summaryRef,
}: {
	notice: WithdrawNotice | null;
	fieldErrors: Partial<Record<WithdrawField, WithdrawFieldError>>;
	summaryRef: React.RefObject<HTMLDivElement | null>;
}) {
	const t = useTranslations("withdraw");
	const fields = SUMMARY_FIELDS.filter((field) => fieldErrors[field] && fieldErrors[field] !== "notMatched");
	if (!notice && fields.length === 0) return null;
	const informational = notice === "statementUpdated" || notice === "noOrders";
	return (
		<div
			ref={summaryRef}
			tabIndex={-1}
			role={informational ? "status" : "alert"}
			className={cn(
				"grid gap-2 rounded-lg border p-4 text-sm outline-none",
				informational ? "border-border bg-muted" : "border-destructive bg-destructive/5",
			)}
		>
			{notice ? (
				<p className={cn(!informational && "font-medium text-foreground")}>{t(`notices.${notice}`)}</p>
			) : (
				<p className="font-medium text-foreground">{t("errors.summary")}</p>
			)}
			{fields.length > 0 ? (
				<ul className="grid gap-1">
					{fields.map((field) => (
						<li key={field}>
							<a href={`#${fieldId(field)}`} className="text-destructive underline underline-offset-2">
								{t(`errors.${fieldErrors[field]!}`)}
							</a>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}

function TextField(props: {
	field: "name" | "email" | "orderNumber";
	label: string;
	value: string;
	error?: WithdrawFieldError;
	hint?: string;
	autoComplete?: string;
	type?: string;
	inputMode?: "text" | "email" | "numeric";
}) {
	const t = useTranslations("withdraw");
	const describedBy = [
		props.error ? errorId(props.field) : null,
		props.hint ? `${fieldId(props.field)}-hint` : null,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<div className="grid gap-1.5">
			<Label htmlFor={fieldId(props.field)}>{props.label}</Label>
			<Input
				id={fieldId(props.field)}
				name={props.field}
				type={props.type ?? "text"}
				inputMode={props.inputMode}
				defaultValue={props.value}
				autoComplete={props.autoComplete}
				aria-invalid={props.error ? true : undefined}
				aria-describedby={describedBy || undefined}
				className={cn("h-12", props.error && "border-destructive")}
			/>
			{props.hint ? (
				<p id={`${fieldId(props.field)}-hint`} className="text-sm text-muted-foreground">
					{props.hint}
				</p>
			) : null}
			{props.error ? (
				<p id={errorId(props.field)} className="text-sm text-destructive">
					{t(`errors.${props.error}`)}
				</p>
			) : null}
		</div>
	);
}

function PeriodNote({ order }: { order: WithdrawOrderView }) {
	const t = useTranslations("withdraw");
	if (order.period.kind === "endsOn")
		return <p className="text-sm text-muted-foreground">{t("period.endsOn", { date: order.period.date })}</p>;
	if (order.period.kind === "unknown") return null;
	if (order.period.kind === "notStarted")
		return <p className="text-sm text-muted-foreground">{t("period.notStarted")}</p>;
	return (
		<p className="border-l-2 border-foreground pl-3 text-sm text-foreground">{t("period.mayHaveEnded")}</p>
	);
}

function LineThumb({ url, alt }: { url: string | null; alt: string | null }) {
	return (
		<span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
			{url ? <SaleorImage src={url} alt={alt ?? ""} sizes="40px" className="object-cover" /> : null}
		</span>
	);
}

function OrderCard({ order }: { order: WithdrawOrderView }) {
	const t = useTranslations("withdraw");
	return (
		<div className="grid gap-3 rounded-lg border border-border bg-card p-4">
			<div className="flex flex-wrap justify-between gap-2 text-sm">
				<span className="font-medium text-foreground">{t("orderLabel", { number: order.number })}</span>
				<span className="text-muted-foreground">{order.createdAtLabel}</span>
			</div>
			{order.earlier.map((earlier) => (
				<p
					key={`${earlier.date}-${earlier.time}`}
					className="border-l-2 border-foreground pl-3 text-sm text-foreground"
				>
					{t("earlier", earlier)}
				</p>
			))}
			<ul className="grid gap-2">
				{order.lines.map((line) => (
					<li key={line.id} className="flex items-center gap-3 text-sm">
						<LineThumb url={line.thumbnailUrl} alt={line.thumbnailAlt} />
						<span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
							{line.productName}
							{line.variantName ? (
								<span className="block text-muted-foreground">{line.variantName}</span>
							) : null}
						</span>
						<span className="whitespace-nowrap text-muted-foreground">{line.quantity}×</span>
					</li>
				))}
			</ul>
			{order.fullyWithdrawn ? (
				<p className="text-sm text-foreground">{t("fullyWithdrawn")}</p>
			) : (
				<PeriodNote order={order} />
			)}
		</div>
	);
}

function ValueFields({ values }: { values: WithdrawValues }) {
	return (
		<>
			<input type="hidden" name="name" value={values.name} />
			<input type="hidden" name="email" value={values.email} />
			<input type="hidden" name="orderNumber" value={values.orderNumber} />
			<input type="hidden" name="orderId" value={values.orderId} />
		</>
	);
}

function DetailsStep({ state, formAction, pending, headingRef, summaryRef }: StepProps<"details">) {
	const t = useTranslations("withdraw");
	const hydrated = useHydrated();
	const { context, values, orders, fieldErrors } = state;
	const single = orders.length === 1 ? orders[0] : null;
	const blocked = single?.fullyWithdrawn ?? false;

	return (
		<form method="post" onSubmit={formAction} noValidate className="grid gap-6">
			<ContextFields context={context} />
			<input type="hidden" name="intent" value="details" />
			<input type="hidden" name="ordersToken" value={state.ordersToken} />
			<input type="hidden" name="token" value={state.token} />
			<StepHeading step={1} headingRef={headingRef}>
				{t("entry")}
			</StepHeading>
			<ErrorSummary notice={state.notice} fieldErrors={fieldErrors} summaryRef={summaryRef} />
			<p className="text-pretty text-muted-foreground">{t("intro")}</p>

			{single ? (
				<>
					<input type="hidden" name="orderId" value={single.id} />
					<OrderCard order={single} />
				</>
			) : null}

			{orders.length > 1 ? (
				<fieldset
					className="grid gap-3"
					aria-describedby={fieldErrors.orderId ? errorId("orderId") : undefined}
				>
					<legend className="mb-2 text-sm font-medium text-foreground">{t("whichOrder")}</legend>
					{orders.map((order, index) => (
						<label
							key={order.id}
							className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 has-[:checked]:border-foreground has-[:checked]:ring-1 has-[:checked]:ring-foreground"
						>
							<input
								type="radio"
								name="orderId"
								value={order.id}
								id={index === 0 ? fieldId("orderId") : undefined}
								defaultChecked={values.orderId === order.id}
								disabled={order.fullyWithdrawn}
								className="mt-1 h-4 w-4 accent-foreground"
							/>
							<span className="grid gap-1 text-sm">
								<span className="font-medium text-foreground">
									{t("orderLabel", { number: order.number })} · {order.createdAtLabel}
								</span>
								<span className="text-muted-foreground [overflow-wrap:anywhere]">
									{order.lines.map((line) => line.productName).join(", ")}
								</span>
								{order.fullyWithdrawn ? (
									<span className="text-muted-foreground">{t("fullyWithdrawn")}</span>
								) : null}
							</span>
						</label>
					))}
					{fieldErrors.orderId ? (
						<p id={errorId("orderId")} className="text-sm text-destructive">
							{t(`errors.${fieldErrors.orderId}`)}
						</p>
					) : null}
				</fieldset>
			) : null}

			<TextField
				field="name"
				label={t("fields.name")}
				value={values.name}
				error={fieldErrors.name}
				autoComplete="name"
			/>
			{context.mode === "lookup" ? (
				<TextField
					field="orderNumber"
					label={t("fields.orderNumber")}
					value={values.orderNumber}
					error={fieldErrors.orderNumber}
					hint={t("fields.orderNumberHint")}
					inputMode="numeric"
					autoComplete="off"
				/>
			) : null}
			<TextField
				field="email"
				label={t("fields.email")}
				value={values.email}
				error={fieldErrors.email}
				type="email"
				inputMode="email"
				autoComplete="email"
			/>

			{blocked ? null : (
				<Button type="submit" size="lg" disabled={pending || !hydrated} className="w-full sm:w-auto">
					{t("continue")}
				</Button>
			)}
		</form>
	);
}

function ReviewStep({ state, formAction, pending, headingRef, summaryRef }: StepProps<"review">) {
	const t = useTranslations("withdraw");
	const hydrated = useHydrated();
	const { context, values, order, scope, fieldErrors, notice } = state;
	const updateRef = useRef<HTMLButtonElement>(null);
	const failed = notice === "unavailable" || notice === "rateLimited";
	// Controlled, so React's reset after each form action never shows a stale choice; they follow
	// the server's answer whenever it arrives.
	const selectionFrom = (quantities: Record<string, number>) =>
		Object.fromEntries(Object.entries(quantities).map(([id, quantity]) => [id, quantity > 0]));
	const [kind, setKind] = useState(scope.kind);
	const [selected, setSelected] = useState<Record<string, boolean>>(() => selectionFrom(scope.quantities));
	const [quantities, setQuantities] = useState<Record<string, number>>(scope.quantities);
	const [text, setText] = useState(scope.text);
	const [syncedScope, setSyncedScope] = useState(scope);
	if (syncedScope !== scope) {
		setSyncedScope(scope);
		setKind(scope.kind);
		setSelected(selectionFrom(scope.quantities));
		setQuantities(scope.quantities);
		setText(scope.text);
	}
	const refresh = (event: { currentTarget: { form: HTMLFormElement | null } }) =>
		event.currentTarget.form?.requestSubmit(updateRef.current ?? undefined);

	return (
		<form method="post" onSubmit={formAction} noValidate className="grid gap-6">
			<ContextFields context={context} />
			<ValueFields values={values} />
			<input type="hidden" name="token" value={state.token} />
			<input type="hidden" name="statement" value={state.statement} />
			<input type="hidden" name="ordersToken" value={state.ordersToken} />
			{/* Left empty by people; filled by simple bots. Hidden from everyone, including screen readers. */}
			<div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
				<label>
					{t("fields.honeypot")}
					<input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
				</label>
			</div>

			<StepHeading step={2} headingRef={headingRef}>
				{context.provider === "stub" ? t("review.stubConfirm") : t("review.title")}
			</StepHeading>
			<ErrorSummary notice={notice} fieldErrors={fieldErrors} summaryRef={summaryRef} />

			<fieldset className="grid gap-3">
				<legend className="mb-2 text-sm font-medium text-foreground">{t("review.scope")}</legend>
				<label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 has-[:checked]:border-foreground has-[:checked]:ring-1 has-[:checked]:ring-foreground">
					<input
						type="radio"
						name="scopeKind"
						value="wholeOrder"
						checked={kind === "wholeOrder"}
						onChange={(event) => {
							setKind("wholeOrder");
							refresh(event);
						}}
						className="mt-1 h-4 w-4 accent-foreground"
					/>
					<span className="text-sm font-medium text-foreground">{t("review.scopeWhole")}</span>
				</label>
				<label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 has-[:checked]:border-foreground has-[:checked]:ring-1 has-[:checked]:ring-foreground">
					<input
						type="radio"
						name="scopeKind"
						value={order ? "lines" : "itemsDescription"}
						checked={kind !== "wholeOrder"}
						onChange={(event) => {
							setKind(order ? "lines" : "itemsDescription");
							refresh(event);
						}}
						className="mt-1 h-4 w-4 accent-foreground"
					/>
					<span className="text-sm font-medium text-foreground">
						{order ? t("review.scopeLines") : t("review.scopeItems")}
					</span>
				</label>
			</fieldset>

			{order ? (
				<div
					id={fieldId("lines")}
					className="grid gap-3 rounded-lg border border-border bg-card p-4"
					aria-describedby={fieldErrors.lines ? errorId("lines") : undefined}
				>
					{order.lines.map((line) => {
						const isSelected = selected[line.id] ?? false;
						const disabled = line.quantityWithdrawable === 0;
						return (
							<div key={line.id} className="flex items-center gap-3 text-sm">
								<Checkbox
									id={`withdraw-line-${line.id}`}
									name={`line:${line.id}`}
									checked={isSelected}
									disabled={disabled}
									onChange={(event) => {
										setSelected((current) => ({ ...current, [line.id]: event.target.checked }));
										refresh(event);
									}}
								/>
								<LineThumb url={line.thumbnailUrl} alt={line.thumbnailAlt} />
								<label
									htmlFor={`withdraw-line-${line.id}`}
									className="min-w-0 flex-1 [overflow-wrap:anywhere]"
								>
									{line.productName}
									{line.variantName ? (
										<span className="block text-muted-foreground">{line.variantName}</span>
									) : null}
								</label>
								{line.quantityWithdrawable > 1 ? (
									<select
										name={`quantity:${line.id}`}
										aria-label={`${t("review.quantity")}: ${line.productName}`}
										value={String(quantities[line.id] ?? line.quantityWithdrawable)}
										onChange={(event) => {
											setQuantities((current) => ({ ...current, [line.id]: Number(event.target.value) }));
											refresh(event);
										}}
										className="h-9 rounded-md border border-border bg-background px-2 text-sm"
									>
										{Array.from({ length: line.quantityWithdrawable }, (_, index) => index + 1).map(
											(quantity) => (
												<option key={quantity} value={quantity}>
													{quantity}
												</option>
											),
										)}
									</select>
								) : (
									<span className="whitespace-nowrap text-muted-foreground">
										{line.quantityWithdrawable}×
									</span>
								)}
							</div>
						);
					})}
					{fieldErrors.lines ? (
						<p id={errorId("lines")} className="text-sm text-destructive">
							{t(`errors.${fieldErrors.lines}`)}
						</p>
					) : null}
				</div>
			) : (
				<div className="grid gap-1.5">
					<Label htmlFor={fieldId("itemsText")}>{t("review.itemsTextLabel")}</Label>
					<textarea
						id={fieldId("itemsText")}
						name="itemsText"
						rows={3}
						maxLength={1000}
						value={text}
						onChange={(event) => setText(event.target.value)}
						onBlur={refresh}
						aria-invalid={fieldErrors.itemsText ? true : undefined}
						aria-describedby={fieldErrors.itemsText ? errorId("itemsText") : undefined}
						className={cn(
							"rounded-md border border-border bg-background p-3 text-sm",
							fieldErrors.itemsText && "border-destructive",
						)}
					/>
					{fieldErrors.itemsText ? (
						<p id={errorId("itemsText")} className="text-sm text-destructive">
							{t(`errors.${fieldErrors.itemsText}`)}
						</p>
					) : null}
				</div>
			)}

			<div className="grid gap-1 rounded-lg bg-muted p-4" aria-live="polite">
				<p className="text-eyebrow text-muted-foreground">{t("review.statement")}</p>
				{state.statement ? (
					<p className="text-pretty text-foreground">{state.statement}</p>
				) : (
					<p className="text-pretty text-muted-foreground">{t("errors.linesRequired")}</p>
				)}
			</div>

			<div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
				<Button
					type="submit"
					name="intent"
					value="confirm"
					size="lg"
					disabled={pending || !hydrated}
					className="w-full sm:w-auto"
				>
					{failed
						? t("actions.tryAgain")
						: context.provider === "stub"
							? t("review.stubConfirm")
							: t("review.confirm")}
				</Button>
				{failed ? (
					<Button
						type="submit"
						name="intent"
						value="email"
						variant="outline-solid"
						size="lg"
						className="w-full sm:w-auto"
					>
						{t("actions.sendByEmail")}
					</Button>
				) : null}
				<Button
					type="submit"
					name="intent"
					value="back"
					variant="ghost"
					formNoValidate
					className="w-full sm:w-auto"
				>
					‹ {t("back")}
				</Button>
				<button
					ref={updateRef}
					type="submit"
					name="intent"
					value="update"
					hidden
					tabIndex={-1}
					aria-hidden="true"
				/>
			</div>
		</form>
	);
}

function ReceiptView({
	state,
	headingRef,
}: {
	state: Extract<WithdrawState, { step: "receipt" }>;
	headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
	const t = useTranslations("withdraw");
	const scopeLabel =
		state.scope.kind === "lines"
			? t("receipt.scopeLines", { count: state.scope.count })
			: state.scope.kind === "itemsDescription"
				? t("receipt.scopeItems")
				: t("receipt.scopeWhole");

	return (
		<section className="grid gap-6" aria-live="polite">
			<span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-muted text-lg">
				✓
			</span>
			<StepHeading headingRef={headingRef}>{t("receipt.title")}</StepHeading>
			<p className="text-pretty text-foreground">
				{t("receipt.receivedAt", {
					date: state.receivedDate,
					time: state.receivedTime,
					zone: state.receivedZone,
				})}
			</p>
			<dl className="grid gap-3 rounded-lg border border-border bg-card p-4 text-sm">
				{[
					[t("receipt.order"), state.orderNumber],
					[t("receipt.scope"), scopeLabel],
					[t("receipt.sentTo"), state.maskedEmail],
				].map(([label, value]) => (
					<div
						key={label}
						className="flex justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
					>
						<dt className="text-muted-foreground">{label}</dt>
						<dd className="text-right text-foreground [overflow-wrap:anywhere]">{value}</dd>
					</div>
				))}
			</dl>
			{state.late ? (
				<p className="border-l-2 border-foreground pl-3 text-sm text-foreground">{t("receipt.late")}</p>
			) : null}
			<p className="text-pretty text-muted-foreground">
				{state.withdrawalPage
					? t.rich("receipt.nextSteps", {
							title: state.withdrawalPage.title,
							link: (chunks) => (
								<a href={state.withdrawalPage!.href} className="text-foreground underline underline-offset-2">
									{chunks}
								</a>
							),
						})
					: t("receipt.nextStepsNoPage")}
			</p>
			<Button
				type="button"
				variant="outline-solid"
				size="lg"
				onClick={() => window.print()}
				className="w-full sm:w-auto"
			>
				{t("receipt.save")}
			</Button>
		</section>
	);
}

function EmailView({
	state,
	headingRef,
	summaryRef,
}: {
	state: Extract<WithdrawState, { step: "email" }>;
	headingRef: React.RefObject<HTMLHeadingElement | null>;
	summaryRef: React.RefObject<HTMLDivElement | null>;
}) {
	const t = useTranslations("withdraw");
	const [copied, setCopied] = useState(false);
	const statementRef = useRef<HTMLParagraphElement>(null);
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(state.statement);
			setCopied(true);
		} catch {
			// Clipboard refused: select the text so the customer can copy it themselves.
			const node = statementRef.current;
			if (node) window.getSelection()?.selectAllChildren(node);
			setCopied(false);
		}
	};

	return (
		<section className="grid gap-6">
			<StepHeading headingRef={headingRef}>{t("email.title")}</StepHeading>
			<ErrorSummary notice={state.notice} fieldErrors={{}} summaryRef={summaryRef} />
			<p className="text-pretty text-muted-foreground">
				{state.sellerEmail
					? t.rich("email.intro", {
							email: state.sellerEmail,
						})
					: t("email.introNoAddress")}
			</p>
			<div className="grid gap-1 rounded-lg bg-muted p-4">
				<p className="text-eyebrow text-muted-foreground">{t("review.statement")}</p>
				<p ref={statementRef} className="select-all text-pretty text-foreground">
					{state.statement}
				</p>
			</div>
			<div className="grid gap-3 sm:flex sm:flex-wrap">
				{state.mailtoHref ? (
					<a href={state.mailtoHref} className={buttonClassName({ size: "lg" })}>
						{t("email.open")}
					</a>
				) : null}
				<Button
					type="button"
					variant="outline-solid"
					size="lg"
					onClick={() => void copy()}
					aria-live="polite"
				>
					{copied ? t("email.copied") : t("email.copy")}
				</Button>
			</div>
		</section>
	);
}
