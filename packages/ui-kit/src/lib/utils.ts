import { SyntheticEvent, useState } from "react";

// used for stories
export const useStateWithOnChangeHandler = <TValue extends string | boolean = string>(
  initialValue: TValue = "" as TValue
): [TValue, (event: SyntheticEvent) => void] => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: SyntheticEvent) => {
    setValue((event.target as HTMLInputElement).value as TValue);
  };

  return [value, handleChange];
};
