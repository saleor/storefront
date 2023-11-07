import Image from "next/image";

export const UserCard = ({ user }: { user: { email: string; avatarURL?: string } }) => {
	return (
		<div className="rounded-xl bg-white p-4 dark:bg-neutral-800 md:flex">
			{user.avatarURL && (
				<Image
					className="h-24 w-24 rounded-full md:rounded-none "
					src={user.avatarURL}
					alt=""
					width="384"
					height="512"
				/>
			)}
			<div className="space-y-4 p-8 text-center">
				<p className="text-lg font-medium">
					<span className="text-sky-500 dark:text-sky-400">{user.email} </span> has successfully signed in.
				</p>
			</div>
		</div>
	);
};
