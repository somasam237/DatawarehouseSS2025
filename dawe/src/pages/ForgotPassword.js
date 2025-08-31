import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Auth.css";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setError("");
    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) setMsg(t("ResetEmailSent"));
    else setError(data.error || t("RegistrationFailed"));
  };

  return (
    <div className="auth-page">
 
      <main className="auth-main">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{t("ForgotPassword")}</h2>
          <input
            type="email"
            placeholder={t("Email")}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {msg && <div className="auth-success">{msg}</div>}
          {error && <div className="auth-error">{error}</div>}
          <button type="submit">{t("SendResetLink")}</button>
        </form>
      </main>
   
    </div>
  );
};

export default ForgotPassword;