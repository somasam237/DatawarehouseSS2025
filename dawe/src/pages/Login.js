import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Auth.css";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Simple validation
    if (!form.email || !form.password) {
      setError(t("PleaseFill"));
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      setLoading(false);
      
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        // Save user info from backend response
        if (data.user) {
          localStorage.setItem("user", data.user.name);
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userId", data.user.id);
        } else {
          localStorage.setItem("user", form.email);
        }
        
        // Show welcome message and redirect
        alert(t("WelcomeBack"));
        navigate("/");
      } else {
        setError(data.error || t("LoginFailed"));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t("LoginFailed"));
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{t("Login")}</h2>
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
            autoComplete="current-password"
            required
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? t("LoggingIn") : t("Login")}
          </button>
          <div className="auth-link">
            {t("DontHaveAccount")}{" "}
            <a href="/register">{t("RegisterHere")}</a>
          </div>
          <div className="auth-link">
            <a href="/forgot-password">{t("ForgotPassword")}</a>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;