import { debounce } from "lodash-es";
import { useCallback, useEffect } from "react";

export const useDebouncedSubmit = (onSubmit: (...args: any) => Promise<any>) => {
  const debouncedSubmit = useCallback(
    debounce((...args) => {
      console.log("SUBMIT", ...args);
      void onSubmit(...args);
    }, 2000),
    [onSubmit]
  );

  // useEffect(() => {
  //   return () => {
  //     debouncedSubmit.cancel();
  //   };
  // }, []);

  return debouncedSubmit;
};
