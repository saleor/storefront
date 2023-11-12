"use client";

import { useQuery } from "urql";
import { useRouter } from "next/navigation";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";
import { LoginForm } from "@/ui/components/LoginForm";

export const LoginComponent = () => {
	const router = useRouter();
	const [{ data }] = useQuery<CurrentUserQuery>({
		query: CurrentUserDocument.toString(),
	});

	if (data?.me) {
		router.push("/");
	}

	return <LoginForm />;
};
