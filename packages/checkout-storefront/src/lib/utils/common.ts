import { string } from "yup";

export const getById =
  <TId extends string = string>(idToCompare: TId | undefined) =>
  (obj: { id: TId }) =>
    obj.id === idToCompare;

export const getByUnmatchingId =
  <T extends { id: string }>(idToCompare: string | undefined) =>
  (obj: T) =>
    obj.id !== idToCompare;

export const isValidEmail = async (email: string) => {
  return string().required().email().isValidSync(email);
};
