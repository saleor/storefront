import { useEffect, useState } from "react";
import { FetchFn, GetArgsType, GetDataType, UseFetchOptionalProps, UseFetchResult } from "./types";

export const useFetch = <
  TError,
  TFetchFn extends FetchFn<any, any>,
  TData = GetDataType<TFetchFn>,
  TArgs = GetArgsType<TFetchFn>
>(
  fetchFn: TFetchFn,
  optionalProps?: UseFetchOptionalProps<TArgs>
): UseFetchResult<TError, TData, TArgs> => {
  const { args, skip = false } = optionalProps || {};

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);

  const useFetchArgsDeps = args ? Object.values(args) : [];

  const fetchData = async (immediateArgs?: TArgs): Promise<TData | null> => {
    setLoading(true);

    try {
      const response = await fetchFn((immediateArgs || args) as TArgs);
      const result = await response.json();
      setResult(result);
      return result;
    } catch (e) {
      setError(e as TError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (skip) {
      return;
    }

    void fetchData();
  }, [skip, ...useFetchArgsDeps]);

  return [{ data: result, loading, error }, fetchData];
};
