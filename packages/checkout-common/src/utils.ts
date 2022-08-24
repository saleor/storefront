export function assertUnreachable(value: never): never {
  throw new Error(`Unexpected case: ${value}`);
}
