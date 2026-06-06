"use client";

import { forwardRef, type ComponentProps, type ReactNode } from "react";

import { useLogout } from "./use-logout";

type LogoutButtonProps = {
	children: ReactNode;
} & Omit<ComponentProps<"button">, "type">;

/**
 * Ends the Saleor session on server (checkout detach + cookies) and client.
 * Forwards ref/onClick for Radix `DropdownMenuItem asChild` composition.
 */
export const LogoutButton = forwardRef<HTMLButtonElement, LogoutButtonProps>(function LogoutButton(
	{ children, onClick, disabled, ...props },
	ref,
) {
	const logoutSession = useLogout();

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
				void logoutSession();
			}}
		>
			{children}
		</button>
	);
});
