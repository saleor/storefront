"use client";

import { useParams, useRouter } from "next/navigation";

export const ChannelSelect = ({
	channels,
}: {
	channels: { id: string; name: string; slug: string; currencyCode: string }[];
}) => {
	const router = useRouter();
	const params = useParams<{ channel: string }>();

	return (
		<select
			className="h-10 w-fit rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm  placeholder:text-neutral-500 focus:border-black focus:ring-black"
			onChange={(e) => {
				const newChannel = e.currentTarget.value;
				return router.push(`/${newChannel}`);
			}}
		>
			{channels.map((channel) => (
				<option key={channel.id} value={channel.slug} selected={params.channel === channel.slug}>
					{channel.currencyCode}
				</option>
			))}
		</select>
	);
};
