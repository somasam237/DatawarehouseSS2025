import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Alert,
  Button,
  CircularProgress,
  Paper
} from "@mui/material";
import { CheckCircle, Error, Email } from "@mui/icons-material";
import "./Auth.css";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        
        if (response.ok) {
          setStatus("success");
          setMessage("Email verified successfully! You can now log in.");
        } else {
          setStatus("error");
          setMessage("Invalid or expired verification token.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const getStatusContent = () => {
    switch (status) {
      case "verifying":
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Verifying your email...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your email address.
            </Typography>
          </Box>
        );
      
      case "success":
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom color="success.main">
              Email Verified!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
              sx={{ mr: 2 }}
            >
              Go to Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
          </Box>
        );
      
      case "error":
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Error sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom color="error.main">
              Verification Failed
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/register")}
              sx={{ mr: 2 }}
            >
              Register Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            maxWidth: 500, 
            width: "100%",
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)"
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Email sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Email Verification
            </Typography>
          </Box>
          
          {getStatusContent()}
        </Paper>
      </main>
    </div>
  );
};

export default VerifyEmail;