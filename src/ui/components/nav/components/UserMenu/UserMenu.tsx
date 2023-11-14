"use client";

import { Fragment } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useQuery } from "urql";
import { UserIcon } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { UserAvatar } from "./components/UserAvatar";
import { UserInfo } from "./components/UserInfo";
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
					<UserAvatar user={data.me} />
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
						<UserInfo user={data.me} />
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
