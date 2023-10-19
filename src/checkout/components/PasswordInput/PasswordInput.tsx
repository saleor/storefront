import { useState } from "react";
import { EyeHiddenIcon, EyeIcon } from "@/checkout/ui-kit/icons";
import { IconButton } from "@/checkout/components/IconButton";
import { TextInput, type TextInputProps } from "@/checkout/components/TextInput";

export const PasswordInput = <TName extends string>(props: TextInputProps<TName>) => {
	const [passwordVisible, setPasswordVisible] = useState(false);

	return (
		<div className="relative">
			<TextInput required {...props} type={passwordVisible ? "text" : "password"} />
			<div className="absolute right-7 top-6 flex h-10 items-center justify-center pr-4">
				<IconButton
					ariaLabel="change password visibility"
					onClick={() => setPasswordVisible(!passwordVisible)}
					icon={passwordVisible ? <EyeIcon /> : <EyeHiddenIcon />}
				/>
			</div>
		</div>
	);
};
