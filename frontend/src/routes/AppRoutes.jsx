import { Routes, Route } from "react-router-dom";
import CustomerSignup from "../pages/CustomerSignup";
import ProviderSignup from "../pages/ProviderSignup";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signup/customer" element={<CustomerSignup />} />
      <Route path="/signup/provider" element={<ProviderSignup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
