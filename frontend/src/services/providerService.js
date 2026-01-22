import axiosInstance from "../api/axiosInstance";

export const providerSignup = (data) => {
  return axiosInstance.post("/provider/signup", data);
};
