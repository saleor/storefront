"use client";

import { type ReactNode, useEffect } from "react";
import { useMobileMenu } from "./useMobileMenu";
import { AnimatedMenuButton } from "./AnimatedMenuButton";

type Props = {
	children: ReactNode;
};

export const MobileMenu = ({ children }: Props) => {
	const { closeMenu, toggleMenu, isOpen } = useMobileMenu();

	// Prevent body scroll when menu is open and blur main content, header, and footer
	useEffect(() => {
		if (isOpen) {
			// Save current scroll position
			const scrollY = window.scrollY;

			// Lock scroll by fixing body position
			document.body.style.position = "fixed";
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = "100%";
			document.body.style.overflow = "hidden";
			document.body.style.touchAction = "none";

			// Blur and dim main content
			const mainContent = document.getElementById("main-content");
			if (mainContent) {
				mainContent.style.filter = "blur(8px)";
				mainContent.style.opacity = "0.3";
			}

			// Blur and dim specific header elements (logo and social icons), not the menu button
			const logoContainer = document.querySelector(".logo-container");
			const socialIcons = document.querySelector(".social-icons-container");

			if (logoContainer instanceof HTMLElement) {
				logoContainer.style.filter = "blur(8px)";
				logoContainer.style.opacity = "0.3";
			}

			if (socialIcons instanceof HTMLElement) {
				socialIcons.style.filter = "blur(8px)";
				socialIcons.style.opacity = "0.3";
			}

			// Blur and dim footer
			const footer = document.getElementById("footer");
			if (footer) {
				footer.style.filter = "blur(8px)";
				footer.style.opacity = "0.3";
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
			// Restore scroll position
			const scrollY = document.body.style.top;
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			document.body.style.overflow = "";
			document.body.style.touchAction = "";

			// Restore the scroll position
			if (scrollY) {
				window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
			}

			// Remove blur and opacity from main content
			const mainContent = document.getElementById("main-content");
			if (mainContent) {
				mainContent.style.filter = "";
				mainContent.style.opacity = "";
			}

			// Remove blur and opacity from header elements
			const logoContainer = document.querySelector(".logo-container");
			const socialIcons = document.querySelector(".social-icons-container");

			if (logoContainer instanceof HTMLElement) {
				logoContainer.style.filter = "";
				logoContainer.style.opacity = "";
			}

			if (socialIcons instanceof HTMLElement) {
				socialIcons.style.filter = "";
				socialIcons.style.opacity = "";
			}

			// Remove blur and opacity from footer
			const footer = document.getElementById("footer");
			if (footer) {
				footer.style.filter = "";
				footer.style.opacity = "";
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
			<AnimatedMenuButton
				isOpen={isOpen}
				onClick={toggleMenu}
				aria-controls="mobile-menu"
				aria-expanded={isOpen}
			/>

			{/* Menu backdrop and panel */}
			<div
				id="mobile-menu"
				className={`menu-backdrop fixed inset-0 z-[9999] bg-black/85 transition-opacity duration-300 ease-in-out ${
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
				<div className="relative h-full min-h-dvh w-full overflow-y-auto px-6 pt-24 pb-8 lg:px-12">
					{/* Navigation Links */}
					<nav
						role="navigation"
						className="flex flex-col text-right"
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
