import {
	announcementDismissNoFlashScript,
	resolveAnnouncementDismissKey,
} from "@/lib/content/announcement-dismiss-key";
import { cn } from "@/lib/utils";
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
	if (href && linkLabel) {
		return (
			<>
				<span>{message}</span>
				<span aria-hidden="true"> · </span>
				<a href={href} className="underline underline-offset-2 hover:no-underline">
					{linkLabel}
				</a>
			</>
		);
	}
	if (href) {
		return (
			<a href={href} className="underline underline-offset-2 hover:no-underline">
				{message}
			</a>
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
				<script dangerouslySetInnerHTML={{ __html: announcementDismissNoFlashScript(dismissKey) }} />
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
