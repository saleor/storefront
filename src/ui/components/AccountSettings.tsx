"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, MapPin, Mail, Phone, Calendar, Shield, LogOut, Edit2, Plus } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import type { UserAccountQuery } from "@/gql/graphql";

type UserData = NonNullable<UserAccountQuery["me"]>;
type Address = UserData["addresses"][number];

interface AccountSettingsProps {
	user: UserData;
}

type TabId = "profile" | "security" | "addresses";

export function AccountSettings({ user }: AccountSettingsProps) {
	const [activeTab, setActiveTab] = useState<TabId>("profile");

	const tabs = [
		{ id: "profile" as const, label: "Profile", icon: User },
		{ id: "security" as const, label: "Security", icon: Lock },
		{ id: "addresses" as const, label: "Addresses", icon: MapPin },
	];

	return (
		<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
			{/* Sidebar */}
			<div className="lg:col-span-1">
				<div className="rounded-lg border border-secondary-200 bg-white p-6">
					{/* User Info */}
					<div className="mb-6 text-center">
						<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
							<User className="h-10 w-10 text-primary-600" />
						</div>
						<h2 className="font-semibold text-secondary-900">
							{user.firstName} {user.lastName}
						</h2>
						<p className="text-sm text-secondary-500">{user.email}</p>
					</div>

					{/* Navigation */}
					<nav className="space-y-1">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={clsx(
									"flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
									activeTab === tab.id
										? "bg-primary-50 text-primary-700"
										: "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900",
								)}
							>
								<tab.icon className="h-5 w-5" />
								{tab.label}
							</button>
						))}
					</nav>

					{/* Account Stats */}
					<div className="mt-6 border-t border-secondary-200 pt-6">
						<div className="space-y-3 text-sm">
							<div className="flex items-center gap-2 text-secondary-600">
								<Calendar className="h-4 w-4" />
								<span>
									Member since{" "}
									{new Date(user.dateJoined).toLocaleDateString("en-US", {
										month: "short",
										year: "numeric",
									})}
								</span>
							</div>
							<div className="flex items-center gap-2 text-secondary-600">
								<Shield className="h-4 w-4" />
								<span>{user.isActive ? "Account Active" : "Account Inactive"}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="lg:col-span-3">
				{activeTab === "profile" && <ProfileSection user={user} />}
				{activeTab === "security" && <SecuritySection user={user} />}
				{activeTab === "addresses" && <AddressesSection addresses={user.addresses} />}
			</div>
		</div>
	);
}

// Profile Section
function ProfileSection({ user }: { user: UserData }) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [formData, setFormData] = useState({
		firstName: user.firstName || "",
		lastName: user.lastName || "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccess("");

		try {
			const response = await fetch("/api/account/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = (await response.json()) as { message?: string };

			if (response.ok) {
				setSuccess("Profile updated successfully");
				setIsEditing(false);
				router.refresh();
			} else {
				setError(data.message || "Failed to update profile");
			}
		} catch {
			setError("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border border-secondary-200 bg-white p-6">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-xl font-semibold text-secondary-900">Profile Information</h2>
				{!isEditing && (
					<Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
						<Edit2 className="mr-2 h-4 w-4" />
						Edit
					</Button>
				)}
			</div>

			{error && (
				<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}
			{success && (
				<div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
					{success}
				</div>
			)}

			{isEditing ? (
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<Input
							label="First Name"
							value={formData.firstName}
							onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
							required
							fullWidth
						/>
						<Input
							label="Last Name"
							value={formData.lastName}
							onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
							required
							fullWidth
						/>
					</div>
					<div className="flex gap-3">
						<Button type="submit" variant="primary" loading={isLoading}>
							Save Changes
						</Button>
						<Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
							Cancel
						</Button>
					</div>
				</form>
			) : (
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium text-secondary-500">First Name</label>
							<p className="mt-1 text-secondary-900">{user.firstName || "-"}</p>
						</div>
						<div>
							<label className="text-sm font-medium text-secondary-500">Last Name</label>
							<p className="mt-1 text-secondary-900">{user.lastName || "-"}</p>
						</div>
					</div>
					<div>
						<label className="text-sm font-medium text-secondary-500">Email</label>
						<p className="mt-1 flex items-center gap-2 text-secondary-900">
							<Mail className="h-4 w-4 text-secondary-400" />
							{user.email}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

// Security Section
function SecuritySection({ user }: { user: UserData }) {
	const router = useRouter();
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [passwordData, setPasswordData] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setError("New passwords do not match");
			return;
		}

		if (passwordData.newPassword.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/account/change-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					oldPassword: passwordData.oldPassword,
					newPassword: passwordData.newPassword,
				}),
			});

			const data = (await response.json()) as { message?: string };

			if (response.ok) {
				setSuccess("Password changed successfully");
				setIsChangingPassword(false);
				setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
			} else {
				setError(data.message || "Failed to change password");
			}
		} catch {
			setError("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await fetch("/api/auth/logout", { method: "POST" });
			router.push("/login");
			router.refresh();
		} catch {
			console.error("Logout failed");
		}
	};

	return (
		<div className="space-y-6">
			{/* Change Password */}
			<div className="rounded-lg border border-secondary-200 bg-white p-6">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold text-secondary-900">Password</h2>
						<p className="text-sm text-secondary-500">Update your password to keep your account secure</p>
					</div>
					{!isChangingPassword && (
						<Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>
							Change Password
						</Button>
					)}
				</div>

				{error && (
					<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}
				{success && (
					<div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
						{success}
					</div>
				)}

				{isChangingPassword && (
					<form onSubmit={handlePasswordChange} className="space-y-4">
						<Input
							type="password"
							label="Current Password"
							value={passwordData.oldPassword}
							onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
							required
							fullWidth
						/>
						<Input
							type="password"
							label="New Password"
							value={passwordData.newPassword}
							onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
							required
							fullWidth
						/>
						<Input
							type="password"
							label="Confirm New Password"
							value={passwordData.confirmPassword}
							onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
							required
							fullWidth
						/>
						<div className="flex gap-3">
							<Button type="submit" variant="primary" loading={isLoading}>
								Update Password
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsChangingPassword(false);
									setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
								}}
							>
								Cancel
							</Button>
						</div>
					</form>
				)}
			</div>

			{/* Session Management */}
			<div className="rounded-lg border border-secondary-200 bg-white p-6">
				<h2 className="mb-4 text-xl font-semibold text-secondary-900">Session</h2>
				<p className="mb-4 text-sm text-secondary-600">
					Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Unknown"}
				</p>
				<Button variant="outline" onClick={handleLogout}>
					<LogOut className="mr-2 h-4 w-4" />
					Sign Out
				</Button>
			</div>
		</div>
	);
}

// Addresses Section
function AddressesSection({ addresses }: { addresses: Address[] }) {
	const router = useRouter();
	const [isAdding, setIsAdding] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const emptyAddress = {
		firstName: "",
		lastName: "",
		streetAddress1: "",
		streetAddress2: "",
		city: "",
		postalCode: "",
		country: "KE",
		phone: "",
	};

	const [formData, setFormData] = useState(emptyAddress);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const endpoint = editingId ? "/api/account/address/update" : "/api/account/address/create";
			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editingId ? { id: editingId, ...formData } : formData),
			});

			const data = (await response.json()) as { message?: string };

			if (response.ok) {
				setSuccess(editingId ? "Address updated" : "Address added");
				setIsAdding(false);
				setEditingId(null);
				setFormData(emptyAddress);
				router.refresh();
			} else {
				setError(data.message || "Failed to save address");
			}
		} catch {
			setError("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this address?")) return;

		try {
			const response = await fetch("/api/account/address/delete", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});

			if (response.ok) {
				setSuccess("Address deleted");
				router.refresh();
			}
		} catch {
			setError("Failed to delete address");
		}
	};

	const handleSetDefault = async (id: string, type: "SHIPPING" | "BILLING") => {
		try {
			await fetch("/api/account/address/set-default", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, type }),
			});
			router.refresh();
		} catch {
			setError("Failed to set default address");
		}
	};

	const startEdit = (address: Address) => {
		setEditingId(address.id);
		setFormData({
			firstName: address.firstName,
			lastName: address.lastName,
			streetAddress1: address.streetAddress1,
			streetAddress2: address.streetAddress2 || "",
			city: address.city,
			postalCode: address.postalCode,
			country: address.country.code,
			phone: address.phone || "",
		});
		setIsAdding(true);
	};

	return (
		<div className="rounded-lg border border-secondary-200 bg-white p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-secondary-900">Addresses</h2>
					<p className="text-sm text-secondary-500">Manage your shipping and billing addresses</p>
				</div>
				{!isAdding && (
					<Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Add Address
					</Button>
				)}
			</div>

			{error && (
				<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}
			{success && (
				<div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
					{success}
				</div>
			)}

			{isAdding ? (
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<Input
							label="First Name"
							value={formData.firstName}
							onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
							required
							fullWidth
						/>
						<Input
							label="Last Name"
							value={formData.lastName}
							onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
							required
							fullWidth
						/>
					</div>
					<Input
						label="Street Address"
						value={formData.streetAddress1}
						onChange={(e) => setFormData({ ...formData, streetAddress1: e.target.value })}
						required
						fullWidth
					/>
					<Input
						label="Apartment, suite, etc. (optional)"
						value={formData.streetAddress2}
						onChange={(e) => setFormData({ ...formData, streetAddress2: e.target.value })}
						fullWidth
					/>
					<div className="grid grid-cols-2 gap-4">
						<Input
							label="City"
							value={formData.city}
							onChange={(e) => setFormData({ ...formData, city: e.target.value })}
							required
							fullWidth
						/>
						<Input
							label="Postal Code"
							value={formData.postalCode}
							onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
							required
							fullWidth
						/>
					</div>
					<Input
						label="Phone"
						type="tel"
						value={formData.phone}
						onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
						fullWidth
					/>
					<div className="flex gap-3">
						<Button type="submit" variant="primary" loading={isLoading}>
							{editingId ? "Update Address" : "Add Address"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setIsAdding(false);
								setEditingId(null);
								setFormData(emptyAddress);
							}}
						>
							Cancel
						</Button>
					</div>
				</form>
			) : addresses.length === 0 ? (
				<div className="py-8 text-center">
					<MapPin className="mx-auto h-12 w-12 text-secondary-300" />
					<p className="mt-4 text-secondary-600">No addresses saved yet</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{addresses.map((address) => (
						<div
							key={address.id}
							className="relative rounded-lg border border-secondary-200 p-4 hover:border-secondary-300"
						>
							{/* Badges */}
							<div className="mb-2 flex gap-2">
								{address.isDefaultShippingAddress && (
									<span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
										Default Shipping
									</span>
								)}
								{address.isDefaultBillingAddress && (
									<span className="rounded bg-secondary-100 px-2 py-0.5 text-xs font-medium text-secondary-700">
										Default Billing
									</span>
								)}
							</div>

							{/* Address Details */}
							<p className="font-medium text-secondary-900">
								{address.firstName} {address.lastName}
							</p>
							<p className="text-sm text-secondary-600">{address.streetAddress1}</p>
							{address.streetAddress2 && (
								<p className="text-sm text-secondary-600">{address.streetAddress2}</p>
							)}
							<p className="text-sm text-secondary-600">
								{address.city}, {address.postalCode}
							</p>
							<p className="text-sm text-secondary-600">{address.country.country}</p>
							{address.phone && (
								<p className="mt-1 flex items-center gap-1 text-sm text-secondary-500">
									<Phone className="h-3 w-3" />
									{address.phone}
								</p>
							)}

							{/* Actions */}
							<div className="mt-4 flex gap-2">
								<button
									onClick={() => startEdit(address)}
									className="text-sm text-primary-600 hover:text-primary-700"
								>
									Edit
								</button>
								<button
									onClick={() => handleDelete(address.id)}
									className="text-sm text-red-600 hover:text-red-700"
								>
									Delete
								</button>
								{!address.isDefaultShippingAddress && (
									<button
										onClick={() => handleSetDefault(address.id, "SHIPPING")}
										className="text-sm text-secondary-600 hover:text-secondary-700"
									>
										Set as Shipping
									</button>
								)}
								{!address.isDefaultBillingAddress && (
									<button
										onClick={() => handleSetDefault(address.id, "BILLING")}
										className="text-sm text-secondary-600 hover:text-secondary-700"
									>
										Set as Billing
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
