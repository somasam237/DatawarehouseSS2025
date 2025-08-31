import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Auth.css";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setError("");
    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) setMsg(t("PasswordResetSuccess"));
    else setError(data.error || t("RegistrationFailed"));
  };

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-main">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{t("ResetPassword")}</h2>
          <input
            type="password"
            placeholder={t("NewPassword")}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {msg && <div className="auth-success">{msg}</div>}
          {error && <div className="auth-error">{error}</div>}
          <button type="submit">{t("ResetPassword")}</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;