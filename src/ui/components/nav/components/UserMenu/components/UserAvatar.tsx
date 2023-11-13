import Image from "next/image";
import { type UserDetailsFragment } from "@/gql/graphql";

type Props = {
	user: UserDetailsFragment;
};

export const UserAvatar = ({ user }: Props) => {
	const label =
		user.firstName && user.lastName
			? `${user.firstName.slice(0, 1)}${user.lastName.slice(0, 1)}`
			: user.email.slice(0, 2);

	if (user.avatar) {
		return (
			<Image
				className="h-8 w-8 rounded-full border"
				aria-hidden="true"
				src={user.avatar.url}
				width={24}
				height={24}
				alt=""
			/>
		);
	}

	return (
		<span
			className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-center text-xs font-bold uppercase"
			aria-hidden="true"
		>
			{label}
		</span>
	);
};
