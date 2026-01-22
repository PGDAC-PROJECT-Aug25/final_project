import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAppContext();

  const [selectedRole] = useState("provider");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    contactNumber: "",
    gstNumber: "",
    companyAddress: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let tempErrors = {};

    // Name
    if (!formData.name)
      tempErrors.name = "Name is required";
    else if (!/^[A-Za-z ]+$/.test(formData.name))
      tempErrors.name = "Only letters allowed";
    else if (formData.name.length < 3)
      tempErrors.name = "Minimum 3 characters required";

    // Email
    if (!formData.email)
      tempErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      tempErrors.email = "Invalid email format";

    // Business Name
    if (!formData.businessName)
      tempErrors.businessName = "Business name is required";
    else if (formData.businessName.length < 3)
      tempErrors.businessName = "Business name too short";

    // Contact Number
    if (!formData.contactNumber)
      tempErrors.contactNumber = "Contact number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.contactNumber))
      tempErrors.contactNumber = "Invalid contact number";

    // GST Number
    if (!formData.gstNumber)
      tempErrors.gstNumber = "GST number is required";
    else if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData.gstNumber
      )
    )
      tempErrors.gstNumber = "Invalid GST format";

    // Company Address
    if (!formData.companyAddress)
      tempErrors.companyAddress = "Company address is required";
    else if (formData.companyAddress.length < 5)
      tempErrors.companyAddress = "Address too short";

    // Password
    if (!formData.password)
      tempErrors.password = "Password is required";
    else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/.test(
        formData.password
      )
    )
      tempErrors.password =
        "Password must contain uppercase, lowercase, number & special character";

    // Confirm Password
    if (!formData.confirmPassword)
      tempErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSignup = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  const payload = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    businessName: formData.businessName,
    contactNumber: formData.contactNumber,
    gstNumber: formData.gstNumber,
    companyAddress: formData.companyAddress,
  };

  try {
    await signup(payload, "provider"); // ✅ HERE
    alert("Service Provider registered successfully!");
    navigate("/login");
  } catch (error) {
    alert(error.response?.data?.message || "Signup failed");
  }
};


  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Service Provider Signup</h2>

        <form onSubmit={handleSignup}>
          {[
            ["name", "Owner / Company Name"],
            ["email", "Email", "email"],
            ["businessName", "Business Name"],
            ["contactNumber", "Contact Number"],
            ["gstNumber", "GST Number"],
            ["companyAddress", "Company Address"],
          ].map(([name, label, type = "text"]) => (
            <div className="mb-3" key={name}>
              <input
                type={type}
                className="form-control"
                name={name}
                placeholder={label}
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && (
                <small className="text-danger">{errors[name]}</small>
              )}
            </div>
          ))}

          {[
            ["password", "Password"],
            ["confirmPassword", "Confirm Password"],
          ].map(([name, label]) => (
            <div className="mb-3" key={name}>
              <input
                type="password"
                className="form-control"
                name={name}
                placeholder={label}
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && (
                <small className="text-danger">{errors[name]}</small>
              )}
            </div>
          ))}

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <a href="/login" style={{ color: "var(--primary-yellow)" }}>
              Login here
            </a>
          </p>

          <p>
            Signup as Customer{" "}
            <a href="/signup/customer" style={{ color: "var(--primary-yellow)" }}>
              Signup here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
