"use client";

import { useStorefrontRegionNavigation } from "@/hooks/use-storefront-region-navigation";
import type { ChannelSelectOption } from "@/config/channels";
import { cn } from "@/lib/utils";

export const ChannelSelect = ({
	channels,
	variant = "default",
	className,
}: {
	channels: ChannelSelectOption[];
	variant?: "default" | "inverted";
	className?: string;
}) => {
	const { channel, navigateToChannel } = useStorefrontRegionNavigation();

	return (
		<select
			id="storefront-channel-select"
			aria-label="Market"
			className={cn(
				"h-10 w-fit rounded-md border px-4 py-2 pr-10 text-sm",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				"disabled:cursor-not-allowed disabled:opacity-50",
				variant === "inverted"
					? "border-inverse bg-transparent text-inverse-subtle focus-visible:ring-offset-foreground"
					: "border-input bg-background text-foreground focus-visible:ring-offset-background",
				className,
			)}
			onChange={(e) => navigateToChannel(e.currentTarget.value)}
			value={channel}
		>
			{channels.map((item) => (
				<option key={item.id} value={item.slug}>
					{item.currencyCode}
				</option>
			))}
		</select>
	);
};
