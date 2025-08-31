import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar"; 
import Footer from './components/Footer';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; 
import VerifyEmail from "./pages/VerifyEmail";
import ParticlesBackground from "./components/ParticlesBackground";
import Home from "./pages/Home";
import ProteinInfoPage from "./pages/ProteinInfoPage";
import PDBDetailPage from "./pages/PDBDetailPage";
import ExperimentalDataPage from "./pages/ExperimentalDataPage";
import LigandsPage from "./pages/LigandsPage";
import MacromoleculesPage from "./pages/MacromoleculesPage";
import AuthorsFundingPage from "./pages/AuthorsFundingPage";
import SoftwareUsedPage from "./pages/SoftwareUsedPage";
import VersionHistoryPage from "./pages/VersionHistoryPage";
import ProteinInfoMasterDetail from "./pages/ProteinInfoMasterDetail";

// ...existing code...
import { ColorModeProvider } from "./theme";

function App() {
  return (
    <ColorModeProvider>
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/protein-info" element={<ProteinInfoPage />} />
          <Route path="/protein-info/:pdbId" element={<PDBDetailPage />} />
          <Route path="/protein-info-master-detail" element={<ProteinInfoMasterDetail />} />
          <Route path="/experimental-data" element={<ExperimentalDataPage />} />
          <Route path="/ligands" element={<LigandsPage />} />
          <Route path="/macromolecules" element={<MacromoleculesPage />} />
          <Route path="/authors-funding" element={<AuthorsFundingPage />} />
          <Route path="/software-used" element={<SoftwareUsedPage />} />
          <Route path="/version-history" element={<VersionHistoryPage />} />
// ...existing code...

        </Routes>
        <Footer />
      </Router>
    </ColorModeProvider>
  );
}

export default App;
