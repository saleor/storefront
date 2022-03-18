import { Node } from "types/common";

export const getById = (idToCompare: string) => (obj: Node) =>
  obj.id === idToCompare;

export const findById = <T extends Node>(objList: T[], idToCompare: string) =>
  objList.find(getById(idToCompare));
