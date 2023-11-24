"use client";

import { useState, type AllHTMLAttributes } from "react";
import clsx from "clsx";
import { Field, type FieldProps } from "formik";
import { EyeHiddenIcon, EyeIcon } from "@/checkout/ui-kit/icons";
import { IconButton } from "@/checkout/components/IconButton";

export interface PasswordInputProps<TName extends string> extends AllHTMLAttributes<HTMLInputElement> {
	name: TName;
	label: string;
}

export const PasswordInput = <TName extends string>(props: PasswordInputProps<TName>) => (
	<Field {...props} component={PasswordInputComponent} />
);

export const PasswordInputComponent = <TName extends string>({
	field,
	form: { touched, errors },
	label,
	required,
	...props
}: PasswordInputProps<TName> & FieldProps) => {
	const error = touched[field.name] ? (errors[field.name] as string) : undefined;
	const [passwordVisible, setPasswordVisible] = useState(false);

	return (
		<div className="space-y-0.5">
			<div className="flex flex-col">
				<label className="text-xs text-neutral-700">
					{label}
					{required && <span aria-hidden="true">*</span>}
					<div className="relative mt-1 flex items-stretch shadow-sm">
						<input
							required={required}
							spellCheck={false}
							type={passwordVisible ? "text" : "password"}
							autoCapitalize="off"
							autoComplete="off"
							{...field}
							{...props}
							className={clsx(
								"block w-full appearance-none rounded-md border-neutral-300 pr-10 transition-colors focus:border-neutral-300 focus:outline-none focus:ring focus:ring-neutral-200 focus:ring-opacity-50 active:border-neutral-200 active:outline-none",
								{ "border-red-300": error },
								props.className,
							)}
						/>
						<IconButton
							ariaLabel="change password visibility"
							onClick={() => setPasswordVisible(!passwordVisible)}
							icon={passwordVisible ? <EyeIcon /> : <EyeHiddenIcon />}
							className="absolute right-0 mt-px flex h-10 w-10 items-center justify-center rounded-md  text-center focus:border-neutral-300 focus:outline-none focus:ring focus:ring-neutral-200 focus:ring-opacity-50 active:border-neutral-200 active:outline-none"
						/>
					</div>
				</label>
			</div>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};
