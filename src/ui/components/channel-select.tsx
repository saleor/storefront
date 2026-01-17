"use client";

import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const ChannelSelect = ({
	channels,
	className,
}: {
	channels: { id: string; name: string; slug: string; currencyCode: string }[];
	className?: string;
}) => {
	const router = useRouter();
	const params = useParams<{ channel: string }>();

	return (
		<select
			className={cn(
				"h-10 w-fit rounded-md border border-input bg-background px-4 py-2 pr-10 text-sm",
				"text-foreground",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				"disabled:cursor-not-allowed disabled:opacity-50",
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
