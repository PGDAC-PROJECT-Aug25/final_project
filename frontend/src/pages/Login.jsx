import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validate = () => {
    let tempErrors = {};

    // Email validation
    if (!formData.email.trim())
      tempErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      tempErrors.email = "Invalid email format";

    // Password validation
    if (!formData.password)
      tempErrors.password = "Password is required";
    else if (formData.password.length < 8)
      tempErrors.password = "Password must be at least 8 characters";
    else if (/\s/.test(formData.password))
      tempErrors.password = "Password cannot contain spaces";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  const payload = {
    email: formData.email,
    password: formData.password,
  };

  try {
    const response = await login(payload); // ✅ HERE

    localStorage.setItem("token", response.token);
    navigate("/");

  } catch (error) {
    alert(error.response?.data?.message || "Invalid credentials");
  }
};


  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            Don’t have an account?{" "}
            <a
              href="/signup/customer"
              style={{ color: "var(--primary-yellow)", fontWeight: "bold" }}
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
