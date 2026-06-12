import { type UserDetailsFragment } from "@/gql/graphql";

type Props = {
	user: UserDetailsFragment;
};

export const UserInfo = ({ user }: Props) => {
	const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null;

	return (
		<div className="truncate text-xs text-muted-foreground">
			{userName ? (
				<span className="mb-0.5 block truncate font-medium text-foreground">{userName}</span>
			) : null}
			<span className="block truncate">{user.email}</span>
		</div>
	);
};
