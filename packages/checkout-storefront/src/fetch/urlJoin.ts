import join from "url-join";

/**
 * Like url-join but always with trailing slash
 */
export const urlJoinTrailingSlash = (...parts: string[]): string => {
  return join(...parts, "/");
};
