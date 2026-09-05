import { api } from "./api";

export const loginApi = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const registerApi = ({ name, email, password, role }) => {
  return api.post("/auth/register", { name, email, password, role });
};

export const getSessionApi = () => {
  return api.get("/auth/session");
};

export const logoutApi = () => {
  return api.post("/auth/logout", {});
};