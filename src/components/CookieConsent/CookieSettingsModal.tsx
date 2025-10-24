"use client";

import { useState, useEffect, type FC } from "react";
import type { CookieConsentData } from "@/types/cookie-consent";

interface CookieSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (settings: Partial<CookieConsentData>) => void;
	onAcceptAll: () => void;
	currentConsent: CookieConsentData;
}

export const CookieSettingsModal: FC<CookieSettingsModalProps> = ({
	isOpen,
	onClose,
	onSave,
	onAcceptAll,
	currentConsent,
}) => {
	const [youtubeEnabled, setYoutubeEnabled] = useState(currentConsent.youtube);

	// Update local state when currentConsent changes
	useEffect(() => {
		setYoutubeEnabled(currentConsent.youtube);
	}, [currentConsent]);

	// Handle Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	const handleSave = () => {
		onSave({
			youtube: youtubeEnabled,
		});
	};

	const handleAcceptAll = () => {
		setYoutubeEnabled(true);
		onAcceptAll();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[10001] flex items-center justify-center p-8 animate-fade-in">
			{/* Overlay */}
			<div
				className="absolute inset-0 bg-black/80 backdrop-blur-sm"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal Content */}
			<div className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border-2 border-base-700 bg-base-950 shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-base-700 px-6 py-4">
					<h3 className="text-2xl font-semibold text-white">Cookie Settings</h3>
					<button
						onClick={onClose}
						className="flex h-8 w-8 items-center justify-center rounded text-3xl text-base-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-700 focus:ring-offset-2 focus:ring-offset-base-950"
						aria-label="Close settings"
					>
						&times;
					</button>
				</div>

				{/* Body */}
				<div className="space-y-6 px-6 py-6">
					{/* Essential Cookies */}
					<div className="border-b border-base-700 pb-6">
						<div className="mb-3 flex items-center justify-between">
							<h4 className="text-lg font-semibold text-white">Essential Cookies</h4>
							<span className="rounded-full bg-base-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-base-300">
								Always Active
							</span>
						</div>
						<p className="mb-3 text-sm leading-relaxed text-base-300">
							Required for basic site functionality including shopping cart, user
							authentication, and secure payments via Stripe. These cookies cannot be
							disabled.
						</p>
						<details className="group">
							<summary className="cursor-pointer text-sm font-semibold text-accent-700 transition-colors hover:text-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-700 focus:ring-offset-2 focus:ring-offset-base-950">
								Technical Details
							</summary>
							<ul className="mt-2 space-y-1 pl-4">
								<li className="relative text-sm text-base-400 before:absolute before:left-[-1rem] before:font-bold before:text-accent-700 before:content-['•']">
									<strong>Session cookies:</strong> Basic security and functionality
									(session)
								</li>
								<li className="relative text-sm text-base-400 before:absolute before:left-[-1rem] before:font-bold before:text-accent-700 before:content-['•']">
									<strong>Cart cookies:</strong> Shopping cart persistence (30 days)
								</li>
								<li className="relative text-sm text-base-400 before:absolute before:left-[-1rem] before:font-bold before:text-accent-700 before:content-['•']">
									<strong>Stripe cookies:</strong> Secure payment processing and fraud
									prevention
								</li>
							</ul>
						</details>
					</div>

					{/* YouTube Embeds */}
					<div>
						<div className="mb-3 flex items-center justify-between">
							<h4 className="text-lg font-semibold text-white">YouTube Video Embeds</h4>
							{/* Toggle Switch */}
							<label className="relative inline-block h-6 w-12 cursor-pointer">
								<input
									type="checkbox"
									checked={youtubeEnabled}
									onChange={(e) => setYoutubeEnabled(e.target.checked)}
									className="peer sr-only"
								/>
								<span className="absolute inset-0 rounded-full bg-base-600 transition-colors peer-checked:bg-accent-700 peer-focus:ring-2 peer-focus:ring-accent-700 peer-focus:ring-offset-2 peer-focus:ring-offset-base-950" />
								<span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-6" />
							</label>
						</div>
						<p className="mb-3 text-sm leading-relaxed text-base-300">
							Allow embedded YouTube videos for product demonstrations and tutorials. YouTube
							may load third-party cookies when you interact with videos. If disabled, video
							embeds will be hidden.
						</p>
						<details className="group">
							<summary className="cursor-pointer text-sm font-semibold text-accent-700 transition-colors hover:text-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-700 focus:ring-offset-2 focus:ring-offset-base-950">
								Technical Details
							</summary>
							<ul className="mt-2 space-y-1 pl-4">
								<li className="relative text-sm text-base-400 before:absolute before:left-[-1rem] before:font-bold before:text-accent-700 before:content-['•']">
									<strong>YouTube cookies:</strong> Video playback, analytics, and
									personalization
								</li>
								<li className="relative text-sm text-base-400 before:absolute before:left-[-1rem] before:font-bold before:text-accent-700 before:content-['•']">
									<strong>Privacy mode:</strong> We use youtube-nocookie.com when available
								</li>
							</ul>
						</details>
					</div>
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-4 border-t border-base-700 px-6 py-4">
					<button
						onClick={handleSave}
						className="rounded-md bg-accent-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-700 focus:ring-offset-2 focus:ring-offset-base-950"
					>
						Save Settings
					</button>
					<button
						onClick={handleAcceptAll}
						className="rounded-md border border-base-700 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-base-400 transition-all duration-300 hover:border-base-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-700 focus:ring-offset-2 focus:ring-offset-base-950"
					>
						Accept All
					</button>
				</div>
			</div>
		</div>
	);
};
