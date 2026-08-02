"use client";

import { useParams } from "next/navigation";
import { forwardRef, type ComponentProps, type ReactNode } from "react";

import { useLogout, type LogoutOptions } from "./use-logout";

type LogoutButtonProps = {
	children: ReactNode;
	channel?: string;
	redirectTo?: string;
	stayOnPage?: boolean;
} & Omit<ComponentProps<"button">, "type">;

/**
 * Ends the Saleor session on server (checkout detach + cookies) and hard-navigates.
 * Forwards ref/onClick for Radix `DropdownMenuItem asChild` composition.
 */
export const LogoutButton = forwardRef<HTMLButtonElement, LogoutButtonProps>(function LogoutButton(
	{ children, channel: channelProp, redirectTo, stayOnPage, onClick, disabled, ...props },
	ref,
) {
	const params = useParams<{ locale?: string; channel?: string }>();
	const logoutSession = useLogout();

	const logoutOptions: LogoutOptions = {
		locale: params.locale,
		channel: channelProp ?? params.channel,
		redirectTo,
		stayOnPage,
	};

	return (
		<button
			ref={ref}
			type="button"
			disabled={disabled}
			{...props}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) {
					return;
				}
				void logoutSession(logoutOptions);
			}}
		>
			{children}
		</button>
	);
});
