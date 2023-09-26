"use client";

import React from "react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { gql, useQuery } from "@apollo/client";
import { LoginForm } from "@/ui/components/LoginForm";
import { Loader } from "@/ui/atoms/Loader";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";
import { UserCard } from "@/ui/components/UserCard";

export default function LoginPage() {
  const { signOut } = useSaleorAuthContext();

  const { data, loading } = useQuery<CurrentUserQuery>(gql(CurrentUserDocument.toString()));

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="max-w-7xl mx-auto p-8">
      {data?.me ? (
        <>
          <UserCard email={data.me.email} avatarURL={data.me.avatar?.url || ""} />
          <button
            onClick={() => signOut()}
            className="bg-slate-800 text-slate-200 hover:bg-slate-700 rounded py-2 px-4"
            type="button"
          >
            Log Out
          </button>
        </>
      ) : (
        <LoginForm />
      )}
    </section>
  );
}
