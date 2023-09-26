import Image from "next/image";

type UserCardProps = {
  email: string;
  avatarURL: string;
};

export const UserCard = (user: UserCardProps) => {
  const { email, avatarURL } = user;
  return (
    <div className="md:flex bg-white rounded-xl p-4 dark:bg-slate-800">
      <Image
        className="w-24 h-24 md:rounded-none rounded-full "
        src={avatarURL}
        alt=""
        width="384"
        height="512"
      />
      <div className="p-8 text-center space-y-4">
        <p className="text-lg font-medium">
          <span className="text-sky-500 dark:text-sky-400">{email} </span> has successfully signed
          in.
        </p>
      </div>
    </div>
  );
};
