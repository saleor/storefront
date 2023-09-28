import { type ReactNode, type InputHTMLAttributes, useId } from "react";
import clsx from "clsx";

import { CheckIcon } from "../icons";
import { type ClassNames } from "..";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
	label?: string | ReactNode;
	classNames?: ClassNames<"container" | "inputContainer" | "input" | "checkbox" | "label">;
}

export const Checkbox = ({ label, checked, value, classNames, ...rest }: CheckboxProps) => {
	const generatedId = useId();
	const id = rest?.id || generatedId;

	return (
		<label className={clsx(classNames?.label)} htmlFor={id}>
			<>
				<div className={clsx(classNames?.container)}>
					<div className={clsx("select-none")}>
						<input
							{...rest}
							type="checkbox"
							value={value}
							checked={!!checked}
							id={id}
							className={classNames?.input}
						/>
						<div className={clsx(classNames?.checkbox)}>
							<CheckIcon />
						</div>
					</div>
					<span className="pointer-events-none">{label && label}</span>
				</div>
			</>
		</label>
	);
};
