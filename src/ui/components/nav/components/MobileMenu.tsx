"use client";

import { Fragment, type ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Logo } from "../../Logo";
import { useMobileMenu } from "./useMobileMenu";
import { OpenButton } from "./OpenButton";
import { CloseButton } from "./CloseButton";

type Props = {
	children: ReactNode;
};

export const MobileMenu = ({ children }: Props) => {
	const { closeMenu, openMenu, isOpen } = useMobileMenu();

	return (
		<>
			<OpenButton onClick={openMenu} aria-controls="mobile-menu" />
			<Transition show={isOpen}>
				<Dialog onClose={closeMenu}>
					<Dialog.Panel className="fixed inset-0 z-20 flex h-dvh w-screen flex-col overflow-y-scroll">
						<Transition.Child
							className="sticky top-0 z-10 flex h-20 shrink-0 border-b border-base-900 bg-black/90 px-6 backdrop-blur-xl sm:px-12"
							enter="motion-safe:transition-all motion-safe:duration-150"
							enterFrom="bg-transparent"
							enterTo="bg-black/90"
							leave="motion-safe:transition-all motion-safe:duration-150"
							leaveFrom="bg-black/90"
							leaveTo="bg-transparent"
						>
							<Logo />
							<CloseButton onClick={closeMenu} aria-controls="mobile-menu" />
						</Transition.Child>
						<Transition.Child
							as={Fragment}
							enter="motion-safe:transition-all motion-safe:duration-150"
							enterFrom="opacity-0 -translate-y-3 bg-transparent"
							enterTo="opacity-100 translate-y-0 bg-black"
							leave="motion-safe:transition-all motion-safe:duration-150"
							leaveFrom="opacity-100 translate-y-0 bg-black"
							leaveTo="opacity-0 -translate-y-3 bg-transparent"
						>
							<ul
								className="flex h-full flex-col divide-y divide-base-900 whitespace-nowrap p-6 pt-0 text-base-200 sm:p-12 sm:pt-0 [&>li]:py-4"
								id="mobile-menu"
							>
								{children}
							</ul>
						</Transition.Child>
					</Dialog.Panel>
				</Dialog>
			</Transition>
		</>
	);
};
