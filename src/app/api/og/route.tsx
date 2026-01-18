import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

/**
 * Dynamic OG Image Generator
 * Note: Cache Components requires Node.js runtime (Edge not supported)
 *
 * Generates branded Open Graph images for social media sharing.
 * Used for product pages when no product image is available,
 * or for custom branded sharing images.
 *
 * @example
 * /api/og?title=Product%20Name&price=€29.99
 * /api/og?title=Summer%20Collection&subtitle=New%20Arrivals
 */
export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;

	const title = searchParams.get("title") || "Saleor Store";
	const subtitle = searchParams.get("subtitle") || "";
	const price = searchParams.get("price") || "";

	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#FAF9F7", // --background
					fontFamily: "system-ui, sans-serif",
				}}
			>
				{/* Background pattern */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage: "radial-gradient(circle at 25px 25px, #E5E4DF 2px, transparent 0)",
						backgroundSize: "50px 50px",
						opacity: 0.5,
					}}
				/>

				{/* Content container */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						padding: "60px",
						maxWidth: "80%",
						textAlign: "center",
					}}
				>
					{/* Logo/Brand */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "40px",
							fontSize: "24px",
							fontWeight: "600",
							color: "#1A1A1A",
							letterSpacing: "-0.02em",
						}}
					>
						{/* Simple sparkle icon */}
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginRight: "12px" }}>
							<path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#1A1A1A" />
						</svg>
						saleor
					</div>

					{/* Title */}
					<div
						style={{
							fontSize: "64px",
							fontWeight: "700",
							color: "#1A1A1A",
							lineHeight: 1.1,
							letterSpacing: "-0.03em",
							marginBottom: subtitle || price ? "20px" : "0",
						}}
					>
						{title}
					</div>

					{/* Subtitle */}
					{subtitle && (
						<div
							style={{
								fontSize: "28px",
								color: "#737373", // --muted-foreground
								marginBottom: price ? "20px" : "0",
							}}
						>
							{subtitle}
						</div>
					)}

					{/* Price */}
					{price && (
						<div
							style={{
								fontSize: "36px",
								fontWeight: "600",
								color: "#1A1A1A",
								backgroundColor: "#FFFFFF",
								padding: "12px 32px",
								borderRadius: "8px",
								border: "2px solid #E5E4DF",
							}}
						>
							{price}
						</div>
					)}
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		},
	);
}
