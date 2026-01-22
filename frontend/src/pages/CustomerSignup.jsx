import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    dob: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedRole] = useState("customer");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validate = () => {
    let tempErrors = {};

    // Name
    if (!formData.name.trim())
      tempErrors.name = "Name is required";
    else if (!/^[A-Za-z ]+$/.test(formData.name))
      tempErrors.name = "Only letters allowed";
    else if (formData.name.length < 3)
      tempErrors.name = "Name must be at least 3 characters";

    // Email
    if (!formData.email)
      tempErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      tempErrors.email = "Invalid email format";

    // Phone
    if (!formData.phone)
      tempErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      tempErrors.phone = "Invalid phone number";

    // Address
    if (!formData.address)
      tempErrors.address = "Address is required";
    else if (formData.address.length < 5)
      tempErrors.address = "Address too short";

    // DOB
    if (!formData.dob)
      tempErrors.dob = "Date of birth is required";
    else if (calculateAge(formData.dob) < 18)
      tempErrors.dob = "You must be at least 18 years old";

    // Gender
    if (!formData.gender)
      tempErrors.gender = "Gender is required";

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
    phone: formData.phone,
    address: formData.address,
    dob: formData.dob,
    gender: formData.gender,
  };

  try {
    await signup(payload, "customer"); // ✅ HERE
    alert("Signup successful! Please login.");
    navigate("/login");
  } catch (error) {
    alert(error.response?.data?.message || "Signup failed");
  }
};


  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Customer Signup</h2>

        <form onSubmit={handleSignup}>
          {[
            ["name", "Full Name"],
            ["email", "Email", "email"],
            ["phone", "Phone"],
            ["address", "Address"],
          ].map(([name, label, type = "text"]) => (
            <div className="mb-3" key={name}>
              <input
                className="form-control"
                type={type}
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

          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
            {errors.dob && <small className="text-danger">{errors.dob}</small>}
          </div>

          <div className="mb-3">
            <select
              className="form-control"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && (
              <small className="text-danger">{errors.gender}</small>
            )}
          </div>

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

          <button className="btn btn-primary w-100" type="submit">
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
            Signup as Provider{" "}
            <a href="/signup/provider" style={{ color: "var(--primary-yellow)" }}>
              Signup Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
