import { debounce } from "lodash-es";
import { useCallback } from "react";

export const useDebouncedSubmit = (onSubmit) => {
  const debouncedSubmit = useCallback(
    debounce((...args) => {
      console.log("LALALA", ...args);
      void onSubmit(...args);
    }, 2000),
    []
  );

  return debouncedSubmit;
};
