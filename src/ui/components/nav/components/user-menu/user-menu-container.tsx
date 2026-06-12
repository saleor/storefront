import { Suspense } from "react";

import { HeaderAuthRefresh } from "./header-auth-refresh";
import { UserMenuServer } from "./user-menu-server";

function UserMenuSkeleton() {
	return <div className="h-10 w-10" aria-hidden="true" />;
}

export function UserMenuContainer({ channel }: { channel: string }) {
	return (
		<Suspense fallback={<UserMenuSkeleton />}>
			<HeaderAuthRefresh channel={channel}>
				<UserMenuServer channel={channel} />
			</HeaderAuthRefresh>
		</Suspense>
	);
}
