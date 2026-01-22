import { createContext, useContext } from "react";
import {
  customerSignup,
  providerSignup,
  loginUser,
} from "../services/authService";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {

  const signup = async (payload, role) => {
    try {
      if (role === "customer") {
        return await customerSignup(payload);
      }
      if (role === "provider") {
        return await providerSignup(payload);
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (payload) => {
    try {
      return await loginUser(payload);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ signup, login }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
