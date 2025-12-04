import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { SignedInUser } from "../SignedInUser/SignedInUser";
import { ResetPassword } from "../ResetPassword/ResetPassword";
import { useCustomerAttach } from "@/checkout/hooks/useCustomerAttach";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { SignIn } from "@/checkout/sections/SignIn/SignIn";
import { GuestUser } from "@/checkout/sections/GuestUser/GuestUser";
import { useUser } from "@/checkout/hooks/useUser";

type Section = "signedInUser" | "guestUser" | "signIn" | "resetPassword";

const onlyContactShownSections: Section[] = ["signIn", "resetPassword"];

interface ContactProps {
	setShowOnlyContact: (value: boolean) => void;
}

export const Contact: FC<ContactProps> = ({ setShowOnlyContact }) => {
	useCustomerAttach();
	const { user, authenticated } = useUser();
	const [email, setEmail] = useState(user?.email || "");

	const passwordResetToken = getQueryParams().passwordResetToken;
	const selectInitialSection = () =>
		passwordResetToken ? "resetPassword" : user ? "signedInUser" : "guestUser";
	const [requestedSection, setRequestedSection] = useState<Section>(selectInitialSection);

	const currentSection = useMemo(() => {
		if (requestedSection === "resetPassword") {
			return "resetPassword";
		}

		if (authenticated) {
			return "signedInUser";
		}

		if (!authenticated && requestedSection === "signedInUser") {
			return "guestUser";
		}

		return requestedSection;
	}, [authenticated, requestedSection]);

	const handleChangeSection = (section: Section) => () => {
		if (onlyContactShownSections.includes(section)) {
			setShowOnlyContact(true);
		}
		setRequestedSection(section);
	};

	const isCurrentSection = useCallback((section: Section) => currentSection === section, [currentSection]);

	const shouldShowOnlyContact = onlyContactShownSections.includes(currentSection);

	useEffect(() => {
		setShowOnlyContact(shouldShowOnlyContact);
	}, [setShowOnlyContact, shouldShowOnlyContact]);

	return (
		<div>
			{isCurrentSection("guestUser") && (
				<GuestUser onSectionChange={handleChangeSection("signIn")} onEmailChange={setEmail} email={email} />
			)}

			{isCurrentSection("signIn") && (
				<SignIn
					onSectionChange={handleChangeSection("guestUser")}
					onSignInSuccess={handleChangeSection("signedInUser")}
					onEmailChange={setEmail}
					email={email}
				/>
			)}

			{isCurrentSection("signedInUser") && (
				<SignedInUser
					onSectionChange={handleChangeSection("guestUser")}
					onSignOutSuccess={handleChangeSection("guestUser")}
				/>
			)}

			{isCurrentSection("resetPassword") && (
				<ResetPassword
					onSectionChange={handleChangeSection("signIn")}
					onResetPasswordSuccess={handleChangeSection("signedInUser")}
				/>
			)}
		</div>
	);
};
