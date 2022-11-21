export const anythingToString = <Anything>(value: Anything) => {
  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
};
export function assertUnreachable(value: never): never {
  throw new Error(`Unexpected case: ${anythingToString(value)}`);
}
