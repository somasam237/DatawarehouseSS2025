import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import "./Auth.css";

const Register = ()=>  {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return; // Prevent multiple submissions
  setLoading(true);
  setError("");
  setSuccess("");

  // validate the fields
  if (!form.name || !form.email || !form.password || !form.confirm) {
    setError(t("PleaseFill"));
    setLoading(false);
    return;
  }
  if (form.password !== form.confirm) {
    setError(t("PasswordsNoMatch"));
    setLoading(false);
    return;
  }

  // HTTP request to register user
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password
      }),
    });
    const data = await res.json();
    
    if (res.ok) {
      setError(""); // Registration successful, clear error
      setSuccess(data.message || t("RegistrationSuccess"));
      
      // Store user info in localStorage for immediate login
      if (data.user) {
        localStorage.setItem("user", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userId", data.user.id);
      }
      
      setTimeout(() => {
        setLoading(false);
        // Redirect to home page after successful registration
        window.location.href = "/";
      }, 2000);
    } else {
      setError(data.error || t("RegistrationFailed"));
      setLoading(false);
    }
  } catch (err) {
    console.error('Registration error:', err);
    setError(t("RegistrationFailed"));
    setLoading(false);
  }
};
const createOTP = async (email) => {
  email = document.getE
};

  return (
    <div className="auth-page">
   
      <main className="auth-main">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{t("Register")}</h2>
          <input
            type="text"
            name="name"
            placeholder={t("FullName")}
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t("Email")}
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <input
            type="password"
            name="password"
            placeholder={t("Password")}
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <input
            type="password"
            name="confirm"
            placeholder={t("ConfirmPassword")}
            value={form.confirm}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? t("Registering") : t("Register")}
          </button>
          <div className="auth-link">
            {t("AlreadyAccount")} <a href="/login">{t("LoginHere")}</a>
          </div>
        </form>
      </main>
    </div>
  );
}


export default Register;