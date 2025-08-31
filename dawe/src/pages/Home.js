import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Fade, 
  Container, 
  Paper, 
  Stack,
  Chip,
  Tab,
  Tabs,
  useTheme
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Biotech as BiotechIcon,
  Public as PublicIcon,
  Article as ArticleIcon,
  Search as SearchIcon,
  BarChart as BarChartIcon,
  DataUsage as DataIcon,
  Memory as ExperimentIcon,
  Psychology as LigandIcon,
  AccountTree as MacromoleculeIcon,
  People as AuthorsIcon,
  Build as SoftwareIcon,
  History as VersionIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import EnhancedSearch from '../components/EnhancedSearch';
import MasterDetailView from '../components/MasterDetailView';
import ScientificPlots from '../components/ScientificPlots';
import "./Home.css";

const summaryEndpoints = [
  { key: "protein-info", label: "Protein Information", path: "/protein-info" },
  { key: "authors-funding", label: "Authors & Funding", path: "/authors-funding" },
  { key: "experimental-data", label: "Experimental Data", path: "/experimental-data" },
  { key: "macromolecules", label: "Macromolecules", path: "/macromolecules" },
  { key: "ligands", label: "Ligands", path: "/ligands" },
  { key: "software-used", label: "Software Used", path: "/software-used" },
  { key: "version-history", label: "Version History", path: "/version-history" },
];


const FloatingSVG = ({ style, className }) => (
  <svg className={className} style={style} width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="40" rx="32" ry="18" fill="url(#paint0_radial)" fillOpacity="0.7"/>
    <ellipse cx="40" cy="40" rx="18" ry="32" fill="url(#paint1_radial)" fillOpacity="0.5"/>
    <defs>
      <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(40 40) scale(32 18)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a21caf"/>
        <stop offset="1" stopColor="#6366f1"/>
      </radialGradient>
      <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(40 40) scale(18 32)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ec4899"/>
        <stop offset="1" stopColor="#a21caf"/>
      </radialGradient>
    </defs>
  </svg>
);

export default function Home() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [counts, setCounts] = useState({});
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    // Load actual data counts for dashboard
    summaryEndpoints.forEach(({ key }) => {
      
      fetch(`http://localhost:5000/api/${key}/count`)
        .then(res => res.json())
        .then(data => {
         
          if (typeof data.count === 'number') {
            setCounts(c => ({ ...c, [key]: data.count }));
          } else {
            // Fallback: fetch all records and count
            fetch(`http://localhost:5000/api/${key}`)
              .then(res2 => res2.json())
              .then(data2 => {
                const count = data2.total || (Array.isArray(data2.data) ? data2.data.length : (Array.isArray(data2) ? data2.length : 0));
                setCounts(c => ({ ...c, [key]: count }));
              })
              .catch(() => setCounts(c => ({ ...c, [key]: "?" })));
          }
        })
        .catch(() => {
          // Fallback: fetch all records and count
          fetch(`http://localhost:5000/api/${key}`)
            .then(res2 => res2.json())
            .then(data2 => {
              const count = data2.total || (Array.isArray(data2.data) ? data2.data.length : (Array.isArray(data2) ? data2.length : 0));
              setCounts(c => ({ ...c, [key]: count }));
            })
            .catch(() => setCounts(c => ({ ...c, [key]: "?" })));
        });
    });
    
    // Animate cards in
    setTimeout(() => setShowCards(true), 400);
  }, []);

  return (
    <Box sx={{ 
      minHeight: "calc(100vh - 120px)", 
      p: 4, 
      position: "relative", 
      overflow: "hidden", 
      bgcolor: theme.palette.background.default 
    }}>
      {/* Main Title with animated glow */}
      <Typography variant="h2" align="center" sx={{ 
        mb: 4, 
        fontWeight: 900, 
        letterSpacing: 2, 
        color: theme.palette.text.primary 
      }}>
        {t("ProteinDataWarehouse")}
      </Typography>
      <Typography variant="h6" align="center" sx={{ 
        color: theme.palette.text.secondary, 
        mb: 3, 
        fontWeight: 400, 
        fontSize: 22 
      }}>
        {t("welcome")}
      </Typography>
      <Typography variant="body1" align="center" sx={{ 
        color: theme.palette.primary.main, 
        mb: 4, 
        fontSize: 22, 
        fontWeight: 600 
      }}>
        {t("encouragement")}
      </Typography>
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          component={Link}
          to="/protein-info-master-detail"
          variant="contained"
          size="large"
          startIcon={<DashboardIcon />}
          sx={{
            background: 'linear-gradient(135deg, #a21caf 0%, #6366f1 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.2rem',
            padding: '16px 32px',
            borderRadius: '50px',
            boxShadow: '0 8px 32px rgba(162, 28, 175, 0.4)',
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
            textTransform: 'none',
            letterSpacing: '0.5px',
            '&:hover': {
              background: 'linear-gradient(135deg, #6366f1 0%, #a21caf 100%)',
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(162, 28, 175, 0.6), 0 0 20px rgba(99, 102, 241, 0.4)',
            },
            '&:active': {
              transform: 'translateY(-2px)',
            }
          }}
        >
          🚀 {t("MasterDetailView")} - {t("ProteinInformation")}
        </Button>
      </Box>
      
      {/* Futuristic dashboard panel */}
      <Box sx={{ 
        mb: 6, 
        mx: "auto", 
        maxWidth: 700, 
        p: 3, 
        borderRadius: 5, 
        boxShadow: 3, 
        bgcolor: theme.palette.background.paper, 
        border: `1px solid ${theme.palette.divider}` 
      }}>
        <Typography variant="body2" align="center" sx={{ 
          color: theme.palette.text.primary, 
          fontSize: 18, 
          fontWeight: 400 
        }}>
          {t("ExploreProteinDataWarehouse")}
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {summaryEndpoints.map(({ key, label, path }, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={key}>
            <Fade in={showCards} style={{ transitionDelay: `${idx * 120 + 300}ms` }}>
              <Card className="futuristic-card" sx={{
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: 4,
                boxShadow: 3,
                textAlign: "center",
                position: "relative",
                overflow: "visible",
                border: `1px solid ${theme.palette.divider}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6
                }
              }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>{t(label)}</Typography>
                  <Typography variant="h3" sx={{ my: 2, color: theme.palette.primary.main, fontWeight: 700 }}>{counts[key] ?? "..."}</Typography>
                  <Button
                    component={Link}
                    to={path}
                    variant="contained"
                    className="futuristic-btn"
                    sx={{
                      background: theme.palette.background.paper,
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      borderRadius: 2,
                      fontSize: 18,
                      boxShadow: 3,
                      transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
                      "&:hover": {
                        background: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        boxShadow: "0 0 16px 4px #a21caf, 0 0 32px 8px #6366f1"
                      }
                    }}
                    fullWidth
                  >
                    <span className="btn-shimmer">{t("View")} {t(label)}</span>
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
