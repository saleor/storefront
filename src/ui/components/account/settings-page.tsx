"use client";

import { Mail, Calendar } from "lucide-react";
import { EditNameForm } from "@/ui/components/account/edit-name-form";
import { ChangePasswordForm } from "@/ui/components/account/change-password-form";
import { DeleteAccountSection } from "@/ui/components/account/delete-account-section";
import { useAccountUser } from "@/ui/components/account/account-context";

export function AccountSettingsPage() {
	const user = useAccountUser();

	const memberSince = new Date(user.dateJoined).toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
				<p className="mt-1 text-sm text-muted-foreground">Manage your account settings</p>
			</div>

			<div className="divide-y rounded-lg border">
				<div className="p-4 sm:p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground">Email</p>
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<p className="font-medium">{user.email}</p>
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
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Calendar className="h-4 w-4" />
						<span>Member since {memberSince}</span>
					</div>
				</div>
			</div>

			<div className="border-destructive/20 rounded-lg border p-4 sm:p-6">
				<DeleteAccountSection />
			</div>
		</div>
	);
}
