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
					{required && "*"}
				</label>
				<div className="mt-0.5 flex shadow-sm">
					<input
						required={required}
						spellCheck={false}
						type={passwordVisible ? "text" : "password"}
						{...field}
						{...props}
						className={clsx(
							"mt-0.5 block w-full appearance-none rounded-l-md border-neutral-300 transition-colors focus:border-neutral-300 focus:outline-none focus:ring focus:ring-neutral-200 focus:ring-opacity-50 active:border-neutral-200 active:outline-none",
							{ "border-red-300": error },
							props.className,
						)}
					/>
					<div className="mt-0.5 flex items-center justify-center">
						<IconButton
							ariaLabel="change password visibility"
							onClick={() => setPasswordVisible(!passwordVisible)}
							icon={passwordVisible ? <EyeIcon /> : <EyeHiddenIcon />}
							className="h-full w-full rounded-r-md border border-l-0 border-neutral-300 bg-white px-3 focus:border-neutral-300 focus:outline-none focus:ring focus:ring-neutral-200 focus:ring-opacity-50 active:border-neutral-200 active:outline-none"
						/>
					</div>
				</div>
			</div>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};
