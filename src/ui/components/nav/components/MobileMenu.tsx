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
	const { closeMenu, openMenu, isOpen } = useMobileMenu({ breakpoint: 768 });

	return (
		<>
			<OpenButton onClick={openMenu} aria-controls="mobile-menu" />
			<Transition show={isOpen}>
				<Dialog open={isOpen} onClose={closeMenu}>
					<Dialog.Panel className="fixed inset-0 z-20 flex h-[100dvh] flex-col overflow-y-scroll bg-white">
						<div className="sticky top-0 z-10 flex h-16 shrink-0 bg-neutral-100/50 px-3 backdrop-blur-md sm:px-8">
							<Logo />
							<CloseButton onClick={closeMenu} aria-controls="mobile-menu" />
						</div>
						<Transition.Child
							as={Fragment}
							enter="motion-safe:transition-all motion-safe:duration-300"
							enterFrom="opacity-0 -translate-y-3"
							enterTo="opacity-100 translate-y-0"
							leave="motion-safe:transition-all motion-safe:duration-300"
							leaveFrom="opacity-100 translate-y-0"
							leaveTo="opacity-0 -translate-y-3"
						>
							<ul
								className="flex flex-col divide-y divide-neutral-200 whitespace-nowrap p-3 pt-0 sm:p-8 sm:pt-0 [&>li]:py-3"
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
