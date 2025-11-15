import { UserMenu } from "./UserMenu";
import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export async function UserMenuContainer() {
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});

	if (user) {
		return <UserMenu user={user} />;
	} else {
		return (
			<LinkWithChannel href="/login" className="h-6 w-6 flex-shrink-0">
				<button className="header-action-btn">
					<i className="bi bi-person" aria-hidden="true" />
				</button>
			</LinkWithChannel>
		);
	}
}
