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
					<Dialog.Panel className="fixed inset-0 z-20 flex h-[100dvh] w-screen flex-col overflow-y-scroll">
						<Transition.Child
							className="sticky top-0 z-10 flex h-16 shrink-0 bg-neutral-100/50 px-3 backdrop-blur-md sm:px-8"
							enter="motion-safe:transition-all motion-safe:duration-150"
							enterFrom="bg-transparent"
							enterTo="bg-neutral-100"
							leave="motion-safe:transition-all motion-safe:duration-150"
							leaveFrom="bg-neutral-100"
							leaveTo="bg-transparent"
						>
							<Logo />
							<CloseButton onClick={closeMenu} aria-controls="mobile-menu" />
						</Transition.Child>
						<Transition.Child
							as={Fragment}
							enter="motion-safe:transition-all motion-safe:duration-150"
							enterFrom="opacity-0 -translate-y-3 bg-transparent"
							enterTo="opacity-100 translate-y-0 bg-white"
							leave="motion-safe:transition-all motion-safe:duration-150"
							leaveFrom="opacity-100 translate-y-0 bg-white"
							leaveTo="opacity-0 -translate-y-3 bg-transparent"
						>
							<ul
								className="flex h-full flex-col divide-y divide-neutral-200 whitespace-nowrap p-3 pt-0 sm:p-8 sm:pt-0 [&>li]:py-3"
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
