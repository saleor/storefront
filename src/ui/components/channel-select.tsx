"use client";

import { useParams, useRouter } from "next/navigation";
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
	const router = useRouter();
	const params = useParams<{ channel: string }>();

	return (
		<select
			className={cn(
				"h-10 w-fit rounded-md border px-4 py-2 pr-10 text-sm",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				"disabled:cursor-not-allowed disabled:opacity-50",
				variant === "inverted"
					? "border-on-foreground bg-transparent text-on-foreground-subtle focus-visible:ring-offset-foreground"
					: "border-input bg-background text-foreground focus-visible:ring-offset-background",
				className,
			)}
			onChange={(e) => {
				const newChannel = e.currentTarget.value;
				return router.push(`/${newChannel}`);
			}}
			value={params.channel}
		>
			{channels.map((channel) => (
				<option key={channel.id} value={channel.slug}>
					{channel.currencyCode}
				</option>
			))}
		</select>
	);
};
