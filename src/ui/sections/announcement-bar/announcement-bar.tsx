import {
	ANNOUNCEMENT_DISMISS_COOKIE,
	ANNOUNCEMENT_NO_FLASH_COOKIE_ATTR,
	ANNOUNCEMENT_NO_FLASH_KEY_ATTR,
	ANNOUNCEMENT_NO_FLASH_SCRIPT,
	resolveAnnouncementDismissKey,
} from "@/lib/content/announcement-dismiss-key";
import { sanitizeNavHref } from "@/lib/url/safe-href";
import { cn } from "@/lib/utils";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { AnnouncementDismissButton } from "./announcement-bar-dismiss";

export interface AnnouncementBarProps {
	id: string;
	message: string;
	href?: string | null;
	linkLabel?: string | null;
	dismissible?: boolean;
	className?: string;
}

function AnnouncementContent({
	message,
	href,
	linkLabel,
}: Pick<AnnouncementBarProps, "message" | "href" | "linkLabel">) {
	const safeHref = href ? sanitizeNavHref(href) : null;

	if (safeHref && linkLabel) {
		return (
			<>
				<span>{message}</span>
				<span aria-hidden="true"> · </span>
				<NavHrefLink href={safeHref} className="underline underline-offset-2 hover:no-underline">
					{linkLabel}
				</NavHrefLink>
			</>
		);
	}
	if (safeHref) {
		return (
			<NavHrefLink href={safeHref} className="underline underline-offset-2 hover:no-underline">
				{message}
			</NavHrefLink>
		);
	}
	return <>{message}</>;
}

export function AnnouncementBar({
	id,
	message,
	href,
	linkLabel,
	dismissible = false,
	className,
}: AnnouncementBarProps) {
	if (!message.trim()) {
		return null;
	}

	const content = <AnnouncementContent message={message} href={href} linkLabel={linkLabel} />;

	if (dismissible) {
		const dismissKey = resolveAnnouncementDismissKey({
			id,
			message,
			href: href ?? null,
			linkLabel: linkLabel ?? null,
		});

		return (
			<>
				<script
					{...{
						[ANNOUNCEMENT_NO_FLASH_COOKIE_ATTR]: ANNOUNCEMENT_DISMISS_COOKIE,
						[ANNOUNCEMENT_NO_FLASH_KEY_ATTR]: dismissKey,
					}}
					dangerouslySetInnerHTML={{ __html: ANNOUNCEMENT_NO_FLASH_SCRIPT }}
				/>
				<div
					data-announcement-bar=""
					className={cn(
						"relative flex h-[var(--announcement-bar-height)] items-center justify-center border-b border-border bg-foreground px-10 text-center text-sm text-background",
						className,
					)}
					role="region"
					aria-label="Store announcement"
				>
					<p className="min-w-0 truncate">{content}</p>
					<AnnouncementDismissButton dismissKey={dismissKey} />
				</div>
			</>
		);
	}

	return (
		<div
			className={cn(
				"flex h-[var(--announcement-bar-height)] items-center justify-center border-b border-border bg-foreground px-4 text-center text-sm text-background",
				className,
			)}
			role="region"
			aria-label="Store announcement"
		>
			<p className="min-w-0 truncate">{content}</p>
		</div>
	);
}
