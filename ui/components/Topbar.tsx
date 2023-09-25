"use client";
import { CurrentUserDocument, CurrentUserQuery } from "@/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { StarIcon } from "lucide-react";
import Link from "next/link";

export function Topbar() {
  const { signOut } = useSaleorAuthContext();
  const { data } = useQuery<CurrentUserQuery>(gql(CurrentUserDocument.toString()));

  return (
    <div className="bg-slate-800 border-b border-slate-100">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
        </div>
        <div className="flex text-center items-center text-sm font-medium text-slate-50 hover:text-slate-300">
          <StarIcon className="h-4 mr-2 text-yellow-300" />
          <Link href="https://github.com/saleor/storefront" target="_blank">
            Star our Storefront Example on GitHub
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end">
          {data?.me ? (
            <button onClick={() => signOut()} className="text-sm text-white hover:text-slate-300 font-medium">
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-sm text-white hover:text-slate-300 font-medium">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}