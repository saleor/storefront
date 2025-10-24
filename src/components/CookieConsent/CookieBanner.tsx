"use client";

import type { FC } from "react";

interface CookieBannerProps {
	onAcceptAll: () => void;
	onAcceptEssential: () => void;
	onOpenSettings: () => void;
}

export const CookieBanner: FC<CookieBannerProps> = ({
	onAcceptAll,
	onAcceptEssential,
	onOpenSettings,
}) => {
	return (
		<div className="fixed bottom-0 left-0 right-0 z-[10000] animate-slide-up">
			<div className="bg-gradient-to-br from-base-950 to-base-900 border-t-3 border-accent-700 px-6 py-6 shadow-2xl backdrop-blur-lg">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
					{/* Text Content */}
					<div className="flex-1 text-center md:text-left">
						<h3 className="mb-2 text-xl font-semibold text-white">Cookie Notice</h3>
						<p className="mb-2 text-sm leading-relaxed text-base-200">
							We use minimal essential cookies for cart functionality, login, and secure
							payments via Stripe. Third-party cookies are used for YouTube video embeds,
							and you are free to refuse them.
						</p>
						<p className="text-sm text-base-400">
							<strong className="text-base-300">We don&apos;t track you</strong> - no
							analytics, no behavioral profiling, no marketing cookies.
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex shrink-0 flex-wrap justify-center gap-4 md:flex-nowrap">
						<button
							onClick={onAcceptAll}
							className="rounded-md bg-accent-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-700 focus:ring-offset-2 focus:ring-offset-base-950"
						>
							Accept All
						</button>
						<button
							onClick={onAcceptEssential}
							className="rounded-md border-2 border-base-600 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:border-accent-700 hover:text-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-700 focus:ring-offset-2 focus:ring-offset-base-950"
						>
							Essential Only
						</button>
						<button
							onClick={onOpenSettings}
							className="rounded-md border border-base-700 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-wide text-base-400 transition-all duration-300 hover:border-base-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-700 focus:ring-offset-2 focus:ring-offset-base-950"
						>
							Settings
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
