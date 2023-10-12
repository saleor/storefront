import Image from "next/image";

type UserCardProps = {
	email: string;
	avatarURL: string;
};

export const UserCard = (user: UserCardProps) => {
	const { email, avatarURL } = user;
	return (
		<div className="rounded-xl bg-white p-4 dark:bg-neutral-800 md:flex">
			<Image
				className="h-24 w-24 rounded-full md:rounded-none "
				src={avatarURL}
				alt=""
				width="384"
				height="512"
			/>
			<div className="space-y-4 p-8 text-center">
				<p className="text-lg font-medium">
					<span className="text-sky-500 dark:text-sky-400">{email} </span> has successfully signed in.
				</p>
			</div>
		</div>
	);
};
