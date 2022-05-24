import { app } from "./app";

export const getAuthHeaders = () => ({
  Authorization: `Bearer ${app?.getState()?.token}`,
});
