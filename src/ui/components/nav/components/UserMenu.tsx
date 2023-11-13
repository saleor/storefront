"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useQuery } from "urql";
import { UserIcon } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { CurrentUserDocument, type CurrentUserQuery } from "@/gql/graphql";

export function UserMenu() {
	const { signOut } = useSaleorAuthContext();
	const [{ data }] = useQuery<CurrentUserQuery>({
		query: CurrentUserDocument.toString(),
	});

	if (data?.me) {
		return (
			<Menu as="div" className="relative ml-3">
				<Menu.Button className="relative flex rounded-full bg-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800">
					<span className="sr-only">Open user menu</span>
					{data.me.avatar ? (
						<Image
							className="h-8 w-8 rounded-full border"
							aria-hidden="true"
							src={data.me.avatar.url}
							width={24}
							height={24}
							alt=""
						/>
					) : (
						<span
							className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-center text-xs font-bold uppercase"
							aria-hidden="true"
						>
							{data.me.email.slice(0, 2)}
						</span>
					)}
				</Menu.Button>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-neutral-200 bg-white py-1 text-start shadow ring-1 ring-neutral-200 ring-opacity-5 focus:outline-none">
						<p className="truncate px-5 py-2 text-xs text-neutral-700">{data.me.email}</p>
						<div className="flex flex-col px-1 py-1">
							<Menu.Item>
								{({ active }) => (
									<Link
										href="/orders"
										className={clsx(
											active && "bg-neutral-100",
											"block px-4 py-2 text-sm text-sm font-medium text-neutral-500 hover:text-neutral-700",
										)}
									>
										My orders
									</Link>
								)}
							</Menu.Item>
						</div>
						<div className="flex flex-col px-1 py-1">
							<Menu.Item>
								{({ active }) => (
									<button
										type="button"
										onClick={() => signOut()}
										className={clsx(
											active && "bg-neutral-100",
											"block px-4 py-2 text-start text-sm text-sm font-medium text-neutral-500 hover:text-neutral-700",
										)}
									>
										Log Out
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		);
	} else {
		return (
			<Link href="/login" className="h-6 w-6 flex-shrink-0">
				<UserIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
				<span className="sr-only">Log in</span>
			</Link>
		);
	}
}
