import axiosInstance from "../api/axiosInstance";

/* ============================
   CUSTOMER SIGNUP
============================ */
export const customerSignup = async (payload) => {
  const response = await axiosInstance.post(
    "/customer/signup",
    payload
  );
  return response.data;
};

/* ============================
   SERVICE PROVIDER SIGNUP
============================ */
export const providerSignup = async (payload) => {
  const response = await axiosInstance.post(
    "/provider/signup",
    payload
  );
  return response.data;
};

/* ============================
   LOGIN
============================ */
export const loginUser = async (payload) => {
  const response = await axiosInstance.post(
    "/auth/login",
    payload
  );
  return response.data;
};
