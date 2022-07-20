export type FetchResponse<TData> = Promise<
  Response & {
    json: () => Promise<TData>;
  }
>;

export type UseFetchResult<TError, TData, TArgs> = [
  { data?: TData | null; loading: boolean; error?: TError | null },
  (args?: TArgs) => Promise<TData | null>
];

export type GetArgsType<TFetchFn> = TFetchFn extends (
  args: infer ArgsType
) => any
  ? ArgsType
  : never;

export type GetDataType<TFetchFn> = TFetchFn extends (
  args: any
) => FetchResponse<infer TData>
  ? TData
  : never;

export type FetchFn<TArgs extends Record<string, any> | never, TData> = (
  args: TArgs
) => FetchResponse<TData>;

export interface UseFetchOptionalProps<TArgs> {
  args?: TArgs;
  skip?: boolean;
}
