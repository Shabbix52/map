import React, { useState } from "react";
import "../../pages/RegistrationPage.css";
import { showErrorToast } from "../../services/utils";
import { register } from "../../services/api";
import { SyncLoader } from "react-spinners";
import { FiEye, FiEyeOff } from "react-icons/fi";

function SignUp({ modeHandler }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    re_password: "",
    gender: "M"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // Password validation helpers
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const passwordValid = hasSpecialChar && hasNumber;
  const passwordsMatch = formData.password === formData.re_password;

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!passwordValid) {
      showErrorToast("Password must have at least 1 special character and 1 number.");
      return;
    }
    if (!passwordsMatch) {
      showErrorToast("Passwords do not match.");
      return;
    }
    try {
      setIsLoading(true);
      const is_created = await register(formData);
      setIsLoading(false);
      if (is_created) {
        setFormData({
          email: "",
          password: "",
          first_name: "",
          last_name: "",
          re_password: "",
          gender: "M"
        });
        modeHandler();
      } else {
        showErrorToast("Please check all fields to have correct data.");
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Failed to create an account.");
    }
  };

  return (
    <div className="form-container">
      <h5>Register</h5>
      <div className="form-field">
        <p>First Name</p>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleFieldChange}
        />
      </div>
      <div className="form-field">
        <p>Last Name</p>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleFieldChange}
        />
      </div>
      <div className="form-field">
        <p>Gender</p>
        <select
          name="gender"
          onChange={handleFieldChange}
          value={formData.gender}
        >
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>
      </div>
      <div className="form-field">
        <p>Email</p>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleFieldChange}
        />
      </div>
      <div className="form-field" style={{ position: "relative" }}>
        <p>Password</p>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleFieldChange}
          style={{ width: "100%", paddingRight: 32 }}
          autoComplete="new-password"
        />
        <span
          onClick={() => setShowPassword((v) => !v)}
          style={{
            position: "absolute",
            right: 10,
            top: 38,
            cursor: "pointer",
            zIndex: 10,
            color: "#888",
            fontSize: "1.1em"
          }}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>
        <div style={{
          fontSize: "0.9em",
          color: !formData.password ? "#888" : (passwordValid ? "green" : "red"),
          minHeight: 20,
          display: "flex",
          alignItems: "center"
        }}>
          Must have at least 1 special character and 1 number.
        </div>
      </div>
      <div className="form-field" style={{ position: "relative" }}>
        <p>Retype Password</p>
        <input
          type={showRePassword ? "text" : "password"}
          name="re_password"
          value={formData.re_password}
          onChange={handleFieldChange}
          style={{ width: "100%", paddingRight: 32 }}
          autoComplete="new-password"
        />
        <span
          onClick={() => setShowRePassword((v) => !v)}
          style={{
            position: "absolute",
            right: 10,
            top: 38,
            cursor: "pointer",
            zIndex: 10,
            color: "#888",
            fontSize: "1.1em"
          }}
          tabIndex={-1}
          aria-label={showRePassword ? "Hide password" : "Show password"}
        >
          {showRePassword ? <FiEyeOff /> : <FiEye />}
        </span>
        <div style={{
          fontSize: "0.9em",
          color: passwordsMatch || !formData.re_password ? "#888" : "red"
        }}>
          {formData.re_password
            ? (passwordsMatch
                ? <span style={{ color: "green" }}>Passwords match ✓</span>
                : "Passwords do not match")
            : "Please retype your password."}
        </div>
      </div>
      <button onClick={handleSubmit}>
        {isLoading
          ? <SyncLoader size={4} speedMultiplier={0.75} margin={2} color="white" />
          : "Sign Up"}
      </button>
      <a onClick={() => modeHandler()}>Already have an account? Sign In</a>
    </div>
  );
}

export default SignUp;
