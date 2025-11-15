"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

type AnnouncementSliderProps = {
	messages?: string[];
	intervalMs?: number;
	className?: string;
};

const DEFAULT_MESSAGES = [
	"🚚 Free shipping on orders over $50",
	"💰 30 days money back guarantee.",
	"🎁 20% off on your first order",
];

export const AnnouncementSlider = (props: AnnouncementSliderProps) => {
	const { messages, intervalMs = 5000, className } = props;
	const slides = useMemo(() => (messages && messages.length ? messages : DEFAULT_MESSAGES), [messages]);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (slides.length <= 1) {
			return;
		}
		const timer = window.setInterval(() => {
			setIndex((prev) => (prev + 1) % slides.length);
		}, intervalMs);

		return () => window.clearInterval(timer);
	}, [slides.length, intervalMs]);

	const offsetPercent = slides.length ? (index / slides.length) * 100 : 0;

	return (
		<div className={clsx("announcement-slider swiper init-swiper", className)} aria-live="polite">
			<div
				className="swiper-wrapper"
				style={{
					transform: `translate3d(0, -${offsetPercent}%, 0)`,
					transition: "transform 0.6s ease",
				}}
			>
				{slides.map((slide, idx) => (
					<div className="swiper-slide" key={`${idx}-${slide}`}>
						{slide}
					</div>
				))}
			</div>
		</div>
	);
};
