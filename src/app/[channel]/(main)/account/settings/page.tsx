import { connection } from "next/server";
import { Mail, Calendar } from "lucide-react";
import { EditNameForm } from "@/ui/components/account/edit-name-form";
import { ChangePasswordForm } from "@/ui/components/account/change-password-form";
import { DeleteAccountSection } from "@/ui/components/account/delete-account-section";
import { getCurrentUser } from "../get-current-user";

export default async function AccountSettingsPage() {
	await connection();
	const user = await getCurrentUser();
	if (!user) return null;

	const memberSince = new Date(user.dateJoined).toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
				<p className="mt-1 text-sm text-neutral-400">Manage your account settings</p>
			</div>

			<div className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.06]">
				<div className="p-4 sm:p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-neutral-500">Email</p>
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-neutral-500" />
								<p className="font-medium text-white">{user.email}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="p-4 sm:p-6">
					<EditNameForm firstName={user.firstName} lastName={user.lastName} />
				</div>

				<div className="p-4 sm:p-6">
					<ChangePasswordForm />
				</div>

				<div className="p-4 sm:p-6">
					<div className="flex items-center gap-2 text-sm text-neutral-500">
						<Calendar className="h-4 w-4" />
						<span>Member since {memberSince}</span>
					</div>
				</div>
			</div>

			<div className="rounded-lg border border-red-500/20 p-4 sm:p-6">
				<DeleteAccountSection />
			</div>
		</div>
	);
}
