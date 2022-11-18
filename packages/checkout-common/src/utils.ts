export function assertUnreachable(value: never): never {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Unexpected case: ${value}`);
}
