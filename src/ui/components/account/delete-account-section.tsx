"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { requestAccountDeletion } from "@/app/[channel]/(main)/account/actions";

export function DeleteAccountSection() {
	const params = useParams<{ channel: string }>();
	const [showConfirm, setShowConfirm] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState("");
	const [sent, setSent] = useState(false);

	function handleDelete() {
		setError("");
		startTransition(async () => {
			const formData = new FormData();
			formData.set("redirectUrl", `${window.location.origin}/${params.channel}`);
			formData.set("channel", params.channel);
			const result = await requestAccountDeletion(formData);
			if (!result.success) {
				setError(result.error);
			} else {
				setSent(true);
			}
		});
	}

	if (sent) {
		return (
			<div aria-live="polite" className="rounded-lg border border-border bg-green-50 p-4">
				<p className="text-sm text-green-800">
					A confirmation email has been sent. Please check your inbox to complete account deletion.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div>
				<p className="text-sm font-medium text-destructive">Delete account</p>
				<p className="text-sm text-muted-foreground">
					Permanently remove your account and all associated data.
				</p>
			</div>

			{error && (
				<p role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}

			{!showConfirm ? (
				<Button variant="destructive" size="sm" onClick={() => setShowConfirm(true)}>
					Delete account
				</Button>
			) : (
				<div className="border-destructive/20 bg-destructive/5 flex items-start gap-3 rounded-lg border p-4">
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
					<div className="space-y-3">
						<p className="text-sm">
							This action cannot be undone. You will receive a confirmation email before your account is
							deleted.
						</p>
						<div className="flex gap-2">
							<Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
								{isPending ? "Sending…" : "Yes, delete my account"}
							</Button>
							<Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
