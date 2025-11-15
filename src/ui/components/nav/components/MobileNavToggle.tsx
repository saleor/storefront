"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const MobileNavToggle = () => {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const closeListener = () => window.requestAnimationFrame(() => setIsOpen(false));
		window.addEventListener("mobile-nav-close", closeListener);
		return () => window.removeEventListener("mobile-nav-close", closeListener);
	}, []);

	useEffect(() => {
		document.body.classList.toggle("mobile-nav-active", isOpen);
		return () => {
			document.body.classList.remove("mobile-nav-active");
		};
	}, [isOpen]);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1200) {
				setIsOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	return (
		<button
			type="button"
			className="mobile-nav-toggle d-xl-none text-decoration-none border-0 bg-transparent p-0 shadow-none"
			aria-controls="navmenu-list"
			aria-expanded={isOpen}
			aria-label={isOpen ? "Close navigation" : "Open navigation"}
			onClick={() => setIsOpen((prev) => !prev)}
		>
			<i className={clsx("bi me-0", isOpen ? "bi-x" : "bi-list")} aria-hidden="true" />
		</button>
	);
};
