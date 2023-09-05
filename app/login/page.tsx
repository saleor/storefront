"use client";

import React from "react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { gql, useQuery } from "@apollo/client";
import { LoginForm } from "@/ui/components/LoginForm";
import { Loader } from "@/ui/atoms/Loader";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";

export default function LoginPage() {
  const { signOut } = useSaleorAuthContext();

  const { data, loading } = useQuery<CurrentUserQuery>(gql(CurrentUserDocument.toString()));

  if (loading) {
    return <Loader />
  }

  return (
    <div className="">
      {data?.me ? (
        <>
          {/* <UserCard {...data.me} /> */}
          <button onClick={() => signOut()} className="bg-slate-800 text-slate-200 hover:bg-slate-700 rounded py-2 px-4" type="button">
            Log Out
          </button>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};