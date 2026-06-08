"use client";

import { Fragment } from "react";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { UserInfo } from "./components/user-info";
import { UserAvatar } from "./components/user-avatar";
import { type UserDetailsFragment } from "@/gql/graphql";
import { logout } from "@/app/actions";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

type Props = {
	user: UserDetailsFragment;
};

export function UserMenu({ user }: Props) {
	return (
		<Menu as="div" className="relative">
			<Menu.Button className="focus:outline-hidden relative flex rounded-full bg-muted text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
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
				<Menu.Items className="focus:outline-hidden absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-border bg-card text-start shadow-sm ring-1 ring-border">
					<UserInfo user={user} />
					<div className="flex flex-col px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<LinkWithChannel
									href="/account"
									className={clsx(
										active && "bg-accent",
										"block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground",
									)}
								>
									My account
								</LinkWithChannel>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<LinkWithChannel
									href="/account/orders"
									className={clsx(
										active && "bg-accent",
										"block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground",
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
								<form action={logout} className="w-full">
									<button
										type="submit"
										className={clsx(
											active && "bg-accent",
											"w-full px-4 py-2 text-start text-sm font-medium text-muted-foreground hover:text-foreground",
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
