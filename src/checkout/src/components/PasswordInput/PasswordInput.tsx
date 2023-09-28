import { useState } from "react";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { EyeHiddenIcon, EyeIcon } from "@/checkout/ui-kit/icons";
import { IconButton } from "@/checkout/src/components/IconButton";
import { TextInput, type TextInputProps } from "@/checkout/src/components/TextInput";
import { labels } from "@/checkout/src/components/PasswordInput/messages";

export const PasswordInput = <TName extends string>(props: TextInputProps<TName>) => {
	const formatMessage = useFormattedMessages();
	const [passwordVisible, setPasswordVisible] = useState(false);

	return (
		<div className="relative">
			<TextInput {...props} type={passwordVisible ? "text" : "password"} />
			<div className="absolute -top-1 right-0 flex h-14 items-center justify-center pr-4">
				<IconButton
					variant="bare"
					ariaLabel={formatMessage(labels.passwordVisibility)}
					onClick={() => setPasswordVisible(!passwordVisible)}
					icon={passwordVisible ? <EyeIcon /> : <EyeHiddenIcon />}
				/>
			</div>
		</div>
	);
};
