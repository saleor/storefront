import type { ReactNode } from "react";

/** Shared page shell for standalone auth forms (login, signup, signed-out /account). */
export function AuthFormSection({ children }: { children: ReactNode }) {
	return <section className="mx-auto max-w-7xl p-8 pb-24">{children}</section>;
}
