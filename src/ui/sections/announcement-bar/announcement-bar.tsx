import { cn } from "@/lib/utils";
import { AnnouncementBarDismiss } from "./announcement-bar-dismiss";

export interface AnnouncementBarProps {
	id: string;
	message: string;
	href?: string | null;
	linkLabel?: string | null;
	dismissible?: boolean;
	className?: string;
}

function AnnouncementBarStatic({
	message,
	href,
	linkLabel,
	className,
}: Pick<AnnouncementBarProps, "message" | "href" | "linkLabel" | "className">) {
	const content =
		href && linkLabel ? (
			<>
				<span>{message}</span>
				<span aria-hidden="true"> · </span>
				<a href={href} className="underline underline-offset-2 hover:no-underline">
					{linkLabel}
				</a>
			</>
		) : href ? (
			<a href={href} className="underline underline-offset-2 hover:no-underline">
				{message}
			</a>
		) : (
			message
		);

	return (
		<div
			className={cn(
				"flex min-h-10 items-center justify-center border-b border-border bg-foreground px-4 py-2 text-center text-sm text-background",
				className,
			)}
			role="region"
			aria-label="Store announcement"
		>
			<p className="line-clamp-2">{content}</p>
		</div>
	);
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

	if (dismissible) {
		return (
			<AnnouncementBarDismiss
				id={id}
				message={message}
				href={href}
				linkLabel={linkLabel}
				className={className}
			/>
		);
	}

	return <AnnouncementBarStatic message={message} href={href} linkLabel={linkLabel} className={className} />;
}
