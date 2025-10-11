import { type UserDetailsFragment } from "@/gql/graphql";

type Props = {
	user: UserDetailsFragment;
};

export const UserInfo = ({ user }: Props) => {
	const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null;

	return (
		<p className="truncate px-5 py-2 text-xs text-base-300">
			{userName && <span className="mb-0.5 block truncate font-semibold text-white">{userName}</span>}
			{user.email}
		</p>
	);
};
