import axiosInstance from "../api/axiosInstance";

export const login = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const registerCustomer = (data) => {
  return axiosInstance.post("/auth/register/customer", data);
};

export const registerProvider = (data) => {
  return axiosInstance.post("/auth/register/provider", data);
};
