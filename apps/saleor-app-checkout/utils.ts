import { Node } from "types/common";

export const getById = (idToCompare: string) => (obj: Node) => obj.id === idToCompare;

export const findById = <T extends Node>(objList: T[], idToCompare: string) =>
  objList.find(getById(idToCompare));

export const wrapError = (err: unknown) => {
  if (!err) {
    return new Error();
  }
  if (err instanceof Error) {
    return err;
  }
  if (typeof err === "string") {
    return new Error(err);
  }
  if (typeof err === "object" && "toString" in err) {
    return new Error(err.toString());
  }
  return new Error(JSON.stringify(err));
};

export const safeJsonParse = <R = unknown>(json: string) => {
  try {
    return [null, JSON.parse(json) as R] as const;
  } catch (err) {
    return [wrapError(err), null] as const;
  }
};
