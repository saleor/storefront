import { app } from "./app";

export const getAuthHeaders = () => {
  const token = app?.getState()?.token;

  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};
