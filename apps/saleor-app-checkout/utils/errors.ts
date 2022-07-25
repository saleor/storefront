export function getErrorMessage(error: unknown, fallbackMessage?: string) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (fallbackMessage) return fallbackMessage;
  return String(error);
}
