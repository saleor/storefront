"use client";

import { type FC, type ReactNode } from "react";
import { User, MapPin, Building, Phone, type LucideIcon } from "lucide-react";
import { Input } from "@/ui/components/ui/Input";
import { Label } from "@/ui/components/ui/Label";
import { cn } from "@/lib/utils";
import { type AddressField } from "@/checkout/components/AddressForm/types";
import { autocompleteTags, typeTags } from "@/checkout/lib/consts/inputAttributes";

// =============================================================================
// Constants
// =============================================================================

/** Icon mapping for address fields */
export const addressFieldIcons: Partial<Record<AddressField, LucideIcon>> = {
	firstName: User,
	streetAddress1: MapPin,
	streetAddress2: Building,
	companyName: Building,
	phone: Phone,
};

/** Fields that should be grouped in a 2-column row */
export const addressFieldPairs: [AddressField, AddressField][] = [
	["firstName", "lastName"],
	["city", "postalCode"],
];

// =============================================================================
// Shared Components
// =============================================================================

export const FieldError: FC<{ error?: string }> = ({ error }) =>
	error ? <p className="text-sm text-destructive">{error}</p> : null;

interface FormSelectProps {
	id: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	placeholder?: string;
	options: Array<{ value: string; label: string }>;
	autoComplete?: string;
}

export const FormSelect: FC<FormSelectProps> = ({
	id,
	value,
	onChange,
	error,
	placeholder,
	options,
	autoComplete,
}) => (
	<select
		id={id}
		value={value}
		onChange={(e) => onChange(e.target.value)}
		autoComplete={autoComplete}
		className={cn(
			"flex h-12 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm",
			"ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
			"disabled:cursor-not-allowed disabled:opacity-50",
			error && "border-destructive",
		)}
	>
		{placeholder && (
			<option value="" disabled>
				{placeholder}
			</option>
		)}
		{options.map((option) => (
			<option key={option.value} value={option.value}>
				{option.label}
			</option>
		))}
	</select>
);

interface FormInputProps {
	id: string;
	type?: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	icon?: LucideIcon;
	maxLength?: number;
	className?: string;
	autoComplete?: string;
}

export const FormInput: FC<FormInputProps> = ({
	id,
	type = "text",
	placeholder,
	value,
	onChange,
	error,
	icon: Icon,
	maxLength,
	className,
	autoComplete,
}) => (
	<div className="relative">
		{Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
		<Input
			id={id}
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			maxLength={maxLength}
			autoComplete={autoComplete}
			className={cn("h-12", Icon && "pl-10", error && "border-destructive", className)}
		/>
	</div>
);

// =============================================================================
// Address Fields Renderer
// =============================================================================

interface AddressFieldsProps {
	/** Ordered list of fields to render */
	orderedFields: AddressField[];
	/** Function to get field label */
	getFieldLabel: (field: AddressField) => string;
	/** Function to check if field is required */
	isRequiredField: (field: AddressField) => boolean;
	/** Current form values */
	formData: Record<string, string>;
	/** Validation errors */
	errors: Record<string, string>;
	/** Callback when field value changes */
	onFieldChange: (field: string, value: string) => void;
	/** Country area choices for state/province dropdown */
	countryAreaChoices?: Array<{ raw?: unknown; verbose?: unknown }>;
	/** ID prefix for form fields (e.g., "billing-") */
	idPrefix?: string;
}

export const AddressFields: FC<AddressFieldsProps> = ({
	orderedFields,
	getFieldLabel,
	isRequiredField,
	formData,
	errors,
	onFieldChange,
	countryAreaChoices,
	idPrefix = "",
}) => {
	const renderField = (field: AddressField): ReactNode => {
		if (field === "countryCode") return null;

		const label = getFieldLabel(field);
		const isRequired = isRequiredField(field);
		const error = errors[field];
		const Icon = addressFieldIcons[field];
		const fieldId = `${idPrefix}${field}`;
		const autoComplete = autocompleteTags[field];
		const inputType = typeTags[field] || "text";

		// Label with optional indicator
		const fieldLabel = (
			<Label htmlFor={fieldId} className="text-sm font-medium">
				{label}
				{!isRequired && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
			</Label>
		);

		// State/Province dropdown
		if (field === "countryArea" && countryAreaChoices?.length) {
			return (
				<div key={field} className="space-y-1.5">
					{fieldLabel}
					<FormSelect
						id={fieldId}
						value={formData[field] || ""}
						onChange={(value) => onFieldChange(field, value)}
						error={error}
						placeholder={`Select ${label.toLowerCase()}`}
						autoComplete={autoComplete}
						options={countryAreaChoices.map(({ raw, verbose }) => ({
							value: raw as string,
							label: verbose as string,
						}))}
					/>
					<FieldError error={error} />
				</div>
			);
		}

		// Text input
		return (
			<div key={field} className="space-y-1.5">
				{fieldLabel}
				<FormInput
					id={fieldId}
					type={inputType}
					placeholder={label}
					value={formData[field] || ""}
					onChange={(value) => onFieldChange(field, value)}
					error={error}
					icon={Icon}
					autoComplete={autoComplete}
				/>
				<FieldError error={error} />
			</div>
		);
	};

	const rendered = new Set<string>();
	const elements: ReactNode[] = [];

	orderedFields.forEach((field) => {
		if (field === "countryCode") return;

		const pair = addressFieldPairs.find((p) => p.includes(field));
		if (pair) {
			const pairKey = pair.join("-");
			if (rendered.has(pairKey)) return;
			rendered.add(pairKey);

			const [f1, f2] = pair;
			const has1 = orderedFields.includes(f1);
			const has2 = orderedFields.includes(f2);

			if (has1 && has2) {
				elements.push(
					<div key={pairKey} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{renderField(f1)}
						{renderField(f2)}
					</div>,
				);
			} else {
				if (has1) elements.push(renderField(f1));
				if (has2) elements.push(renderField(f2));
			}
		} else {
			elements.push(renderField(field));
		}
	});

	return <>{elements}</>;
};
