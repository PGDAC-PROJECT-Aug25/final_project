import axiosInstance from "../api/axiosInstance";

export const customerSignup = (data) => {
  return axiosInstance.post("/customer/signup", data);
};
