import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useColorMode } from "../theme";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import NightlightRoundRoundedIcon from "@mui/icons-material/NightlightRoundRounded";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import GlobalSearch from "./GlobalSearch";
import "./Navbar.css";

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    // Simulate getting user name from localStorage or token
    return localStorage.getItem("user") || "User";
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { mode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    setAnchorEl(null);
  };
  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setLogoutDialogOpen(false);
    navigate("/");
  };
  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Left: Site Title */}
      <div className="navbar-title">
        <span>{t("ProteinDataWarehouse")}</span>
      </div>

      {/* Center: Search Bar */}
      <div className="navbar-search">
        <GlobalSearch />
      </div>

      {/* Right: Navigation & i18n */}
      <div className="navbar-actions">
        <Link to="/">{t("Home")}</Link>
        <div className="navbar-dropdown">
          <span className="dropdown-trigger">{t("DataModels")} ▾</span>
          <div className="dropdown-menu">
            <Link to="/protein-info">{t("ProteinInformation")}</Link>
            <Link to="/experimental-data">{t("ExperimentalData")}</Link>
            <Link to="/macromolecules">{t("Macromolecules")}</Link>
            <Link to="/authors-funding">{t("AuthorsFunding")}</Link>
            <Link to="/software-used">{t("SoftwareUsed")}</Link>
            <Link to="/version-history">{t("VersionHistory")}</Link>
          </div>
        </div>
        {!isLoggedIn ? (
          <>
            <Link to="/login">{t("Login")}</Link>
            <Link to="/register">{t("Register")}</Link>
          </>
        ) : (
          <>
            <span
              className="navbar-user"
              onMouseEnter={handleUserMenu}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <AccountCircleIcon fontSize="large" />
              <span style={{ fontWeight: 600 }}>{user}</span>
            </span>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onMouseLeave={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleLogoutClick}>{t("Logout")}</MenuItem>
            </Menu>
            <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
              <DialogTitle>{t("AreYouSureLogout")}</DialogTitle>
              <DialogActions>
                <Button onClick={handleLogoutCancel}>{t("Cancel")}</Button>
                <Button
                  onClick={handleLogoutConfirm}
                  color="error"
                  variant="contained"
                >
                  {t("Logout")}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        <Tooltip
          title={mode === "dark" ? t("LightMode") : t("DarkMode")}
          TransitionComponent={Zoom}
        >
          <IconButton
            onClick={toggleColorMode}
            sx={{
              ml: 1,
              mr: 2,
              p: 1.2,
              borderRadius: 2,
              background:
                mode === "dark"
                  ? "linear-gradient(135deg, #232336 60%, #a21caf 100%)"
                  : "linear-gradient(135deg, #fff 60%, #a21caf 100%)",
              color: mode === "dark" ? "#f59e42" : "#a21caf",
              boxShadow:
                mode === "dark"
                  ? "0 2px 8px 0 #0006"
                  : "0 2px 8px 0 #a21caf33",
              transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
              "&:hover": {
                transform: "scale(1.15) rotate(-8deg)",
                background:
                  mode === "dark"
                    ? "linear-gradient(135deg, #a21caf 60%, #232336 100%)"
                    : "linear-gradient(135deg, #a21caf 60%, #fff 100%)",
                color: mode === "dark" ? "#fff" : "#fff",
              },
            }}
            aria-label="toggle theme"
          >
            {mode === "dark" ? (
              <WbSunnyRoundedIcon fontSize="large" />
            ) : (
              <NightlightRoundRoundedIcon fontSize="large" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title={t("SelectLanguage")} TransitionComponent={Zoom}>
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 50%, #ec4899 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              minWidth: '120px'
            }}
            className="language-selector"
          >
            <option value="en" style={{
              backgroundColor: '#6366f1',
              color: 'white'
            }}>{t("English")}</option>
            <option value="de" style={{
              backgroundColor: '#a21caf',
              color: 'white'
            }}>{t("German")}</option>
          </select>
        </Tooltip>
      </div>
    </nav>
  );
};

export default Navbar;