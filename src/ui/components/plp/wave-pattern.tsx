interface WavePatternProps {
	className?: string;
}

/**
 * Minimal wave pattern for category/collection hero backgrounds.
 * Uses currentColor for theming - apply text-* classes to control colors.
 */
export function WavePattern({ className }: WavePatternProps) {
	const generateSimpleContour = (yOffset: number, amplitude: number): string => {
		const points: string[] = [];
		for (let i = 0; i <= 36; i++) {
			const x = (i / 36) * 1440;
			const y = yOffset + Math.sin((i / 36) * Math.PI * 2) * amplitude;
			points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
		}
		return points.join(" ");
	};

	return (
		<svg
			className={className}
			viewBox="0 0 1440 400"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="xMidYMid slice"
		>
			<rect width="1440" height="400" fill="currentColor" className="text-secondary" />
			<g stroke="currentColor" className="text-foreground" fill="none" strokeWidth="1">
				{[...Array(6)].map((_, i) => (
					<path key={i} d={generateSimpleContour(150 + i * 20, 30 - i * 3)} opacity={0.08 - i * 0.01} />
				))}
			</g>
		</svg>
	);
}
