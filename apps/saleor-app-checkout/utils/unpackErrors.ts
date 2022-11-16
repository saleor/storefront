export const unknownToError = (maybeError: unknown) => {
  if (maybeError instanceof Error) {
    return maybeError;
  }

  if (typeof maybeError === "string") {
    return new Error(maybeError);
  }

  return new Error(String(maybeError));
};

type PromiseToTupleResult<T> = [Error, null] | [null, Awaited<T>];
export const unpackPromise = async <T extends Promise<any>>(
  promise: T
): Promise<PromiseToTupleResult<T>> => {
  try {
    const result = await promise;
    return [null, result];
  } catch (maybeError) {
    const error = unknownToError(maybeError);
    return [error, null];
  }
};

type ThrowableToTupleResult<T> = [Error, null] | [null, T];
export const unpackThrowable = <T>(throwable: () => T): ThrowableToTupleResult<T> => {
  try {
    const result = throwable();
    return [null, result];
  } catch (maybeError) {
    const error = unknownToError(maybeError);
    return [error, null];
  }
};
