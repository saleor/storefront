import { type FC, type PropsWithChildren, useEffect, useRef } from "react";
import { difference } from "lodash-es";
import { type FieldValidator } from "formik";
import { type CountryCode } from "@/checkout/graphql";
import { type AddressField, type AddressFormData } from "@/checkout/components/AddressForm/types";
import { Title } from "@/checkout/components/Title";
import { TextInput } from "@/checkout/components/TextInput";
import { autocompleteTags, typeTags } from "@/checkout/lib/consts/inputAttributes";
import { CountrySelect } from "@/checkout/components/CountrySelect";
import { Select } from "@/checkout/components/Select";
import { getEmptyAddressFormData, isMatchingAddressFormData } from "@/checkout/components/AddressForm/utils";
import { type ChangeHandler, useFormContext, type BlurHandler } from "@/checkout/hooks/useForm";
import { useAddressFormUtils } from "@/checkout/components/AddressForm/useAddressFormUtils";
import { usePhoneNumberValidator } from "@/checkout/lib/utils/phoneNumber";

export interface AddressFormProps {
	title: string;
	availableCountries?: CountryCode[];
	fieldProps?: {
		onBlur?: BlurHandler;
		onChange?: ChangeHandler;
	};
}

export const AddressForm: FC<PropsWithChildren<AddressFormProps>> = ({
	title,
	children,
	availableCountries,
	fieldProps = {},
}) => {
	const { values, setValues, dirty } = useFormContext<AddressFormData>();
	const isValidPhoneNumber = usePhoneNumberValidator(values.countryCode);
	const previousValues = useRef(values);

	const { orderedAddressFields, getFieldLabel, isRequiredField, countryAreaChoices, allowedFields } =
		useAddressFormUtils(values.countryCode);

	const allowedFieldsRef = useRef(allowedFields || []);

	const customValidators: Partial<Record<AddressField, FieldValidator>> = {
		phone: isValidPhoneNumber,
	};

	// prevents outdated data to remain in the form when a field is
	// no longer allowed
	useEffect(() => {
		const hasFormDataChanged = !isMatchingAddressFormData(values, previousValues.current);

		if (!hasFormDataChanged) {
			return;
		}

		previousValues.current = values;

		const removedFields = difference(allowedFieldsRef.current, allowedFields);

		if (removedFields.length && dirty) {
			const emptyAddressFormData = getEmptyAddressFormData();

			void setValues(
				removedFields.reduce(
					(result, field) => ({
						...result,
						[field]: emptyAddressFormData[field],
					}),
					values,
				),
				true,
			);
		}
	}, [allowedFields, dirty, setValues, values]);

	return (
		<>
			<div className="mb-3 flex flex-row items-baseline justify-between">
				<Title className="flex-1">{title}</Title>
				<CountrySelect only={availableCountries} />
			</div>
			<div className="mt-2 grid grid-cols-1 gap-2">
				{orderedAddressFields.map((field) => {
					const isRequired = isRequiredField(field);
					const label = getFieldLabel(field);

					const commonProps = {
						key: field,
						name: field,
						label: label,
						autoComplete: autocompleteTags[field],
						validate: customValidators[field],
						...fieldProps,
					};

					if (field === "countryArea" && isRequired) {
						return (
							<Select
								{...commonProps}
								key={field}
								placeholder={getFieldLabel("countryArea")}
								options={
									countryAreaChoices?.map(({ verbose, raw }) => ({
										label: verbose as string,
										value: raw as string,
									})) || []
								}
							/>
						);
					}

					return (
						<TextInput required={isRequired} {...commonProps} key={field} type={typeTags[field] || "text"} />
					);
				})}
				{children}
			</div>
		</>
	);
};
