import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Button,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Tooltip,
  Fade,
  Zoom,
  Slide,
  Grow
} from '@mui/material';
import {
  Science as ScienceIcon,
  Biotech as BiotechIcon,
  Public as PublicIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  OpenInNew as OpenInNewIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  Code as CodeIcon,
  Timeline as TimelineIcon,
  DataUsage as DataUsageIcon,
  Memory as MemoryIcon,
  Psychology as PsychologyIcon,
  AccountTree as AccountTreeIcon,
  People as PeopleIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { proteinInfoAPI, authorsFundingAPI, experimentalDataAPI, macromoleculeAPI, softwareUsedAPI, versionHistoryAPI } from '../services/api';
import './PDBDetailPage.css';

const PDBDetailPage = () => {
  const { pdbId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorite, setFavorite] = useState(false);
  
  // Data states
  const [proteinInfo, setProteinInfo] = useState(null);
  const [authorsFunding, setAuthorsFunding] = useState([]);
  const [experimentalData, setExperimentalData] = useState(null);
  const [macromolecules, setMacromolecules] = useState([]);
  const [softwareUsed, setSoftwareUsed] = useState([]);
  const [versionHistory, setVersionHistory] = useState([]);

  useEffect(() => {
    const loadPDBData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all data in parallel
        const [
          proteinResponse,
          authorsResponse,
          experimentalResponse,
          macromoleculesResponse,
          softwareResponse,
          versionResponse
        ] = await Promise.allSettled([
          proteinInfoAPI.getById(pdbId),
          fetch(`http://localhost:5000/api/authors-funding/by-pdb/${pdbId}`).then(r => r.json()),
          experimentalDataAPI.getByPdbId(pdbId),
          fetch(`http://localhost:5000/api/macromolecules/by-pdb/${pdbId}`).then(r => r.json()),
          fetch(`http://localhost:5000/api/software-used/by-pdb/${pdbId}`).then(r => r.json()),
          fetch(`http://localhost:5000/api/version-history/by-pdb/${pdbId}`).then(r => r.json())
        ]);

        // Handle protein info
        if (proteinResponse.status === 'fulfilled') {
          setProteinInfo(proteinResponse.value.data);
        }

        // Handle authors funding
        if (authorsResponse.status === 'fulfilled') {
          setAuthorsFunding(authorsResponse.value);
        }

        // Handle experimental data
        if (experimentalResponse.status === 'fulfilled') {
          setExperimentalData(experimentalResponse.value.data);
        }

        // Handle macromolecules
        if (macromoleculesResponse.status === 'fulfilled') {
          setMacromolecules(macromoleculesResponse.value);
        }

        // Handle software used
        if (softwareResponse.status === 'fulfilled') {
          setSoftwareUsed(softwareResponse.value);
        }

        // Handle version history
        if (versionResponse.status === 'fulfilled') {
          setVersionHistory(versionResponse.value);
        }

        // Check if protein info was loaded successfully
        if (proteinResponse.status === 'rejected') {
          setError('Protein information not found');
        }

      } catch (err) {
        console.error('Error loading PDB data:', err);
        setError('Failed to load protein data');
      } finally {
        setLoading(false);
      }
    };

    if (pdbId) {
      loadPDBData();
    }
  }, [pdbId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFavoriteToggle = () => {
    setFavorite(!favorite);
    // TODO: Save to localStorage or backend
  };

  const buildRcsbImageUrl = (pdbId) => {
    if (!pdbId) return '';
    const idLower = pdbId.toLowerCase();
    if (idLower.length === 4) {
      const firstTwo = idLower.substring(0, 2);
      return `https://cdn.rcsb.org/images/structures/${firstTwo}/${idLower}/${idLower}.png`;
    }
    return `https://cdn.rcsb.org/images/structures/${idLower}.png`;
  };

  const getQualityColor = (resolution) => {
    if (!resolution) return 'default';
    if (resolution < 2.0) return 'success';
    if (resolution < 3.0) return 'warning';
    return 'error';
  };

  const getQualityLabel = (resolution) => {
    if (!resolution) return 'Unknown';
    if (resolution < 2.0) return 'High';
    if (resolution < 3.0) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/protein-info')}>
          {t('BackToProteinList')}
        </Button>
      </Box>
    );
  }

  if (!proteinInfo) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('NoDataAvailable')}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/protein-info')}>
          {t('BackToProteinList')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
          <ScienceIcon sx={{ fontSize: 200, transform: 'rotate(15deg)' }} />
        </Box>
        
        <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton 
              onClick={() => navigate('/protein-info')}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, flexGrow: 1 }}>
              {pdbId}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={favorite ? t('Unfavorite') : t('Favorite')}>
                <IconButton onClick={handleFavoriteToggle} sx={{ color: 'white' }}>
                  {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title={t('ViewInPDB')}>
                <IconButton 
                  onClick={() => window.open(`https://www.rcsb.org/structure/${pdbId}`, '_blank')}
                  sx={{ color: 'white' }}
                >
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 400 }}>
            {proteinInfo.title}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Chip 
              label={proteinInfo.classification} 
              color="primary" 
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
            <Chip 
              label={proteinInfo.organism} 
              color="secondary" 
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
            {experimentalData?.resolution && (
              <Chip 
                label={`${experimentalData.resolution} Å`}
                color={getQualityColor(experimentalData.resolution)}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
            )}
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Protein Image and Basic Info */}
          <Grid item xs={12} md={4}>
            <Fade in timeout={800}>
              <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <img
                    src={proteinInfo.image_url || buildRcsbImageUrl(pdbId)}
                    alt={pdbId}
                    style={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginBottom: 16
                    }}
                    onError={(e) => {
                      e.target.src = buildRcsbImageUrl(pdbId);
                    }}
                  />
                  
                  <Typography variant="h6" gutterBottom>
                    Protein Structure
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => window.open(`https://files.rcsb.org/download/${pdbId}.pdb`, '_blank')}
                    sx={{ mb: 2 }}
                  >
                    Download PDB File
                  </Button>
                </CardContent>
              </Card>
            </Fade>

            <Slide direction="up" in timeout={1000}>
              <Card elevation={3}>
                <CardHeader
                  title="Quick Facts"
                  avatar={<InfoIcon color="primary" />}
                />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Molecular Weight"
                        secondary={proteinInfo.molecular_weight_kda ? `${proteinInfo.molecular_weight_kda} kDa` : 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Atom Count"
                        secondary={proteinInfo.atom_count?.toLocaleString() || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Residues Modeled"
                        secondary={proteinInfo.residue_count_modeled || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Unique Chains"
                        secondary={proteinInfo.unique_chains || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Deposition Date"
                        secondary={proteinInfo.deposited_date ? new Date(proteinInfo.deposited_date).toLocaleDateString() : 'N/A'}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Right Column - Detailed Information */}
          <Grid item xs={12} md={8}>
            <Grow in timeout={1200}>
              <Card elevation={3}>
                <CardContent sx={{ p: 0 }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScienceIcon fontSize="small" />
                          {t('ProteinOverview')}
                        </Box>
                      } 
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PeopleIcon fontSize="small" />
                          {t('AuthorsFunding')}
                          {authorsFunding.length > 0 && (
                            <Badge badgeContent={authorsFunding.length} color="primary" />
                          )}
                        </Box>
                      } 
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MemoryIcon fontSize="small" />
                          {t('ExperimentalData')}
                          {experimentalData && <CheckCircleIcon color="success" fontSize="small" />}
                        </Box>
                      } 
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccountTreeIcon fontSize="small" />
                          {t('Macromolecules')}
                          {macromolecules.length > 0 && (
                            <Badge badgeContent={macromolecules.length} color="primary" />
                          )}
                        </Box>
                      } 
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SettingsIcon fontSize="small" />
                          {t('SoftwareUsed')}
                          {softwareUsed.length > 0 && (
                            <Badge badgeContent={softwareUsed.length} color="primary" />
                          )}
                        </Box>
                      } 
                    />
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HistoryIcon fontSize="small" />
                          {t('VersionHistory')}
                          {versionHistory.length > 0 && (
                            <Badge badgeContent={versionHistory.length} color="primary" />
                          )}
                        </Box>
                      } 
                    />
                  </Tabs>

                  <Box sx={{ p: 3 }}>
                    {/* Overview Tab */}
                    {activeTab === 0 && (
                      <Zoom in timeout={300}>
                        <Box>
                          <Typography variant="h5" gutterBottom>
                            {t('ProteinOverview')}
                          </Typography>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    {t('Classification')}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {proteinInfo.classification || t('NotSpecified')}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    {t('Organism')}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {proteinInfo.organism || t('NotSpecified')}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    {t('ExpressionSystem')}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {proteinInfo.expression_system || t('NotSpecified')}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                            
                            {proteinInfo.mutations && (
                              <Grid item xs={12}>
                                <Card variant="outlined">
                                  <CardContent>
                                                                      <Typography variant="h6" gutterBottom>
                                    {t('Mutations')}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {proteinInfo.mutations}
                                  </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </Zoom>
                    )}

                    {/* Authors & Funding Tab */}
                    {activeTab === 1 && (
                      <Zoom in timeout={300}>
                        <Box>
                          <Typography variant="h5" gutterBottom>
                            Authors & Funding Information
                          </Typography>
                          
                          {authorsFunding.length > 0 ? (
                            <List>
                              {authorsFunding.map((item, index) => (
                                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Authors
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                      {item.author_names || 'Not specified'}
                                    </Typography>
                                    
                                    {item.funding_org && (
                                      <>
                                        <Typography variant="h6" gutterBottom>
                                          Funding Organization
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                          {item.funding_org}
                                        </Typography>
                                      </>
                                    )}
                                    
                                    {item.funding_location && (
                                      <>
                                        <Typography variant="h6" gutterBottom>
                                          Funding Location
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                          {item.funding_location}
                                        </Typography>
                                      </>
                                    )}
                                    
                                    {item.grant_number && (
                                      <>
                                        <Typography variant="h6" gutterBottom>
                                          Grant Number
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          {item.grant_number}
                                        </Typography>
                                      </>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </List>
                          ) : (
                            <Alert severity="info">
                              No authors and funding information available for this protein.
                            </Alert>
                          )}
                        </Box>
                      </Zoom>
                    )}

                    {/* Experimental Data Tab */}
                    {activeTab === 2 && (
                      <Zoom in timeout={300}>
                        <Box>
                          <Typography variant="h5" gutterBottom>
                            Experimental Data
                          </Typography>
                          
                          {experimentalData ? (
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Method
                                    </Typography>
                                    <Chip 
                                      label={experimentalData.method || 'Not specified'}
                                      color="primary"
                                      variant="outlined"
                                    />
                                  </CardContent>
                                </Card>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Resolution
                                    </Typography>
                                    {experimentalData.resolution ? (
                                      <Chip 
                                        label={`${experimentalData.resolution} Å (${getQualityLabel(experimentalData.resolution)} Quality)`}
                                        color={getQualityColor(experimentalData.resolution)}
                                        variant="outlined"
                                      />
                                    ) : (
                                      <Typography variant="body2" color="text.secondary">
                                        Not specified
                                      </Typography>
                                    )}
                                  </CardContent>
                                </Card>
                              </Grid>
                              
                              <Grid item xs={12}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Crystallographic Data
                                    </Typography>
                                    <TableContainer>
                                      <Table size="small">
                                        <TableBody>
                                          <TableRow>
                                            <TableCell><strong>Space Group</strong></TableCell>
                                            <TableCell>{experimentalData.space_group || 'N/A'}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell><strong>Unit Cell A</strong></TableCell>
                                            <TableCell>{experimentalData.unit_cell_a || 'N/A'}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell><strong>Unit Cell B</strong></TableCell>
                                            <TableCell>{experimentalData.unit_cell_b || 'N/A'}</TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell><strong>Unit Cell C</strong></TableCell>
                                            <TableCell>{experimentalData.unit_cell_c || 'N/A'}</TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </CardContent>
                                </Card>
                              </Grid>
                            </Grid>
                          ) : (
                            <Alert severity="info">
                              No experimental data available for this protein.
                            </Alert>
                          )}
                        </Box>
                      </Zoom>
                    )}

                    {/* Macromolecules Tab */}
                    {activeTab === 3 && (
                      <Zoom in timeout={300}>
                        <Box>
                          <Typography variant="h5" gutterBottom>
                            Macromolecules
                          </Typography>
                          
                          {macromolecules.length > 0 ? (
                            <List>
                              {macromolecules.map((molecule, index) => (
                                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      {molecule.molecule_name || `Molecule ${index + 1}`}
                                    </Typography>
                                    
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Entity ID:</strong> {molecule.entity_id || 'N/A'}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Chain IDs:</strong> {molecule.chain_ids || 'N/A'}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Sequence Length:</strong> {molecule.sequence_length || 'N/A'}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Organism:</strong> {molecule.organism || 'N/A'}
                                        </Typography>
                                      </Grid>
                                      {molecule.mutations && (
                                        <Grid item xs={12}>
                                          <Typography variant="body2" color="text.secondary">
                                            <strong>Mutations:</strong> {molecule.mutations}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {molecule.ec_number && (
                                        <Grid item xs={12} md={6}>
                                          <Typography variant="body2" color="text.secondary">
                                            <strong>EC Number:</strong> {molecule.ec_number}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {molecule.uniprot_id && (
                                        <Grid item xs={12} md={6}>
                                          <Typography variant="body2" color="text.secondary">
                                            <strong>UniProt ID:</strong> {molecule.uniprot_id}
                                          </Typography>
                                        </Grid>
                                      )}
                                    </Grid>
                                  </CardContent>
                                </Card>
                              ))}
                            </List>
                          ) : (
                            <Alert severity="info">
                              No macromolecule information available for this protein.
                            </Alert>
                          )}
                        </Box>
                      </Zoom>
                    )}

                    {/* Software Used Tab */}
                    {activeTab === 4 && (
                      <Zoom in timeout={300}>
                        <Box>
                          <Typography variant="h5" gutterBottom>
                            Software Used
                          </Typography>
                          
                          {softwareUsed.length > 0 ? (
                            <Grid container spacing={2}>
                              {softwareUsed.map((software, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                  <Card variant="outlined">
                                    <CardContent>
                                      <Typography variant="h6" gutterBottom>
                                        {software.software_name || 'Unknown Software'}
                                      </Typography>
                                      
                                      {software.software_purpose && (
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Purpose:</strong> {software.software_purpose}
                                        </Typography>
                                      )}
                                      
                                      {software.version && (
                                        <Typography variant="body2" color="text.secondary">
                                          <strong>Version:</strong> {software.version}
                                        </Typography>
                                      )}
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <Alert severity="info">
                              No software information available for this protein.
                            </Alert>
                          )}
                        </Box>
                      </Zoom>
                    )}

                    {/* Version History Tab */}
                    {activeTab === 5 && (
                      <Zoom in timeout={300}>
                        <Box>
                          <Typography variant="h5" gutterBottom>
                            Version History
                          </Typography>
                          
                          {versionHistory.length > 0 ? (
                            <List>
                              {versionHistory.map((version, index) => (
                                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                  <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                      <Typography variant="h6">
                                        Version {version.version || 'Unknown'}
                                      </Typography>
                                      {version.release_date && (
                                        <Chip 
                                          label={new Date(version.release_date).toLocaleDateString()}
                                          color="primary"
                                          variant="outlined"
                                          size="small"
                                        />
                                      )}
                                    </Box>
                                    
                                    {version.changes && (
                                      <Typography variant="body2" color="text.secondary">
                                        {version.changes}
                                      </Typography>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </List>
                          ) : (
                            <Alert severity="info">
                              No version history available for this protein.
                            </Alert>
                          )}
                        </Box>
                      </Zoom>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PDBDetailPage; 