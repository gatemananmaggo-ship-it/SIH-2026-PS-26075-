import { api } from "./api";

export const getHomepageApi = () => {
  return api.get("/homepage");
};
