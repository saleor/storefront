import type { ReactNode } from "react";

/** Shared page shell for standalone auth forms (login, signup, signed-out /account). */
export function AuthFormSection({ children }: { children: ReactNode }) {
	return <section className="container-content py-8 pb-24">{children}</section>;
}
