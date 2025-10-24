"use client";

import { type ReactNode, useEffect } from "react";
import { useMobileMenu } from "./useMobileMenu";
import { OpenButton } from "./OpenButton";
import { CloseButton } from "./CloseButton";

type Props = {
	children: ReactNode;
};

export const MobileMenu = ({ children }: Props) => {
	const { closeMenu, openMenu, isOpen } = useMobileMenu();

	// Prevent body scroll when menu is open and blur main content
	useEffect(() => {
		if (isOpen) {
			document.body.classList.add("overflow-hidden-no-shift");

			// Blur only main content, not header
			const mainContent = document.getElementById("main-content");
			if (mainContent) {
				mainContent.style.filter = "blur(8px)";
				mainContent.style.transition = "filter 300ms ease-in-out";
			}

			// Trigger animations for mobile nav links
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					const links = document.querySelectorAll('[data-mobile-nav] .mobile-nav-link');
					links.forEach((link) => {
						link.classList.add('animate-in');
					});
				});
			});
		} else {
			document.body.classList.remove("overflow-hidden-no-shift");

			// Remove blur from main content
			const mainContent = document.getElementById("main-content");
			if (mainContent) {
				mainContent.style.filter = "";
			}

			// Reset animations when closing
			const links = document.querySelectorAll('[data-mobile-nav] .mobile-nav-link');
			links.forEach((link) => {
				link.classList.remove('animate-in');
			});
		}
	}, [isOpen]);

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				closeMenu();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, closeMenu]);

	return (
		<>
			<OpenButton onClick={openMenu} aria-controls="mobile-menu" aria-expanded={isOpen} />

			{/* Menu backdrop and panel */}
			<div
				id="mobile-menu"
				className={`menu-backdrop fixed inset-0 z-[9999] min-h-screen w-screen bg-black/85 transition-opacity duration-300 ease-in-out ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				role="dialog"
				aria-modal="true"
				aria-label="Navigation menu"
				onClick={(e) => {
					if (e.target === e.currentTarget) {
						closeMenu();
					}
				}}
			>
				<div className="relative h-full min-h-screen w-full px-8 py-4">
					{/* Close Button - positioned at top right */}
					<div className="flex justify-end">
						<CloseButton onClick={closeMenu} aria-controls="mobile-menu" />
					</div>

					{/* Navigation Links */}
					<nav
						role="navigation"
						className="mt-8 flex flex-col text-right"
						aria-label="Mobile navigation"
						data-mobile-nav
					>
						<div className="space-y-2">{children}</div>
					</nav>
				</div>
			</div>
		</>
	);
};
