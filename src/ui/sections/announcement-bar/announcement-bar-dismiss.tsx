"use client";

import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const storageKey = (id: string) => `paper:announcement-dismissed:${id}`;

const dismissedListeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
	dismissedListeners.add(onStoreChange);
	window.addEventListener("storage", onStoreChange);
	return () => {
		dismissedListeners.delete(onStoreChange);
		window.removeEventListener("storage", onStoreChange);
	};
}

function notifyDismissed() {
	for (const listener of dismissedListeners) {
		listener();
	}
}

function readDismissed(id: string): boolean {
	if (typeof window === "undefined") return false;
	return window.localStorage.getItem(storageKey(id)) === "1";
}

export interface AnnouncementBarDismissProps {
	id: string;
	message: string;
	href?: string | null;
	linkLabel?: string | null;
	className?: string;
}

export function AnnouncementBarDismiss({
	id,
	message,
	href,
	linkLabel,
	className,
}: AnnouncementBarDismissProps) {
	const dismissed = useSyncExternalStore(
		subscribe,
		() => readDismissed(id),
		() => false,
	);

	if (dismissed) {
		return null;
	}

	const handleDismiss = () => {
		window.localStorage.setItem(storageKey(id), "1");
		notifyDismissed();
	};

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
				"relative flex min-h-10 items-center justify-center border-b border-border bg-foreground px-10 py-2 text-center text-sm text-background",
				className,
			)}
			role="region"
			aria-label="Store announcement"
		>
			<p className="line-clamp-2">{content}</p>
			<button
				type="button"
				onClick={handleDismiss}
				className="text-background/80 hover:bg-background/10 absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors hover:text-background"
				aria-label="Dismiss announcement"
			>
				<X className="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	);
}
