"use client";

import { Fragment } from "react";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { UserInfo } from "./components/UserInfo";
import { UserAvatar } from "./components/UserAvatar";
import { type UserDetailsFragment } from "@/gql/graphql";
import { logout } from "@/app/actions";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

type Props = {
	user: UserDetailsFragment;
};

export function UserMenu({ user }: Props) {
	return (
		<Menu as="div" className="relative">
			<Menu.Button className="relative flex rounded-full bg-base-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-black">
				<span className="sr-only">Open user menu</span>
				<UserAvatar user={user} />
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
				<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-base-800 border border-base-800 bg-base-950 py-1 text-start shadow-lg focus:outline-none">
					<UserInfo user={user} />
					<div className="flex flex-col px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<LinkWithChannel
									href="/account"
									className={clsx(
										active && "bg-base-900 text-accent-200",
										"block px-4 py-2 text-sm font-medium text-base-200 transition-colors duration-200 hover:text-accent-200",
									)}
								>
									My account
								</LinkWithChannel>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<LinkWithChannel
									href="/orders"
									className={clsx(
										active && "bg-base-900 text-accent-200",
										"block px-4 py-2 text-sm font-medium text-base-200 transition-colors duration-200 hover:text-accent-200",
									)}
								>
									My orders
								</LinkWithChannel>
							)}
						</Menu.Item>
					</div>
					<div className="flex flex-col px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<form action={logout}>
									<button
										type="submit"
										className={clsx(
											active && "bg-base-900 text-accent-200",
											"block w-full px-4 py-2 text-start text-sm font-medium text-base-200 transition-colors duration-200 hover:text-accent-200",
										)}
									>
										Log Out
									</button>
								</form>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
