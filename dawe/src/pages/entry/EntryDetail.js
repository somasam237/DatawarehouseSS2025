import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

function EntryDetail() {
  const { pdb_id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Main entry data
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Related data
  const [chains, setChains] = useState([]);
  const [ligands, setLigands] = useState([]);
  const [organisms, setOrganisms] = useState([]);
  const [citations, setCitations] = useState([]);
  
  // All available data for relationship creation
  const [allOrganisms, setAllOrganisms] = useState([]);
  const [allCitations, setAllCitations] = useState([]);
  
  // UI states
  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState({});
  
  // Dialog states
  const [addRelationDialog, setAddRelationDialog] = useState({ open: false, type: '' });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ open: false, type: '', id: null });
  
  // Form states for adding relations
  const [newRelation, setNewRelation] = useState({});

  useEffect(() => {
    if (pdb_id) {
      fetchEntryDetails();
      fetchRelatedData();
      fetchAllOrganisms();
      fetchAllCitations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdb_id]);

  const fetchEntryDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/entries/${pdb_id}`);
      if (!response.ok) throw new Error('Failed to fetch entry details');
      const data = await response.json();
      setEntry(data);
      setEditedEntry(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    try {
      // Fetch chains with query parameter
      const chainsResponse = await fetch(`http://localhost:5000/api/chains?pdb_id=${pdb_id}`);
      if (chainsResponse.ok) {
        const chainsData = await chainsResponse.json();
        setChains(chainsData.data || chainsData);
      }

      // Fetch ligands with query parameter
      const ligandsResponse = await fetch(`http://localhost:5000/api/ligands?pdb_id=${pdb_id}`);
      if (ligandsResponse.ok) {
        const ligandsData = await ligandsResponse.json();
        setLigands(ligandsData.data || ligandsData);
      }

      // Fetch organisms (through junction table)
      const organismsResponse = await fetch(`http://localhost:5000/api/organisms/entry/${pdb_id}`);
      if (organismsResponse.ok) {
        const organismsData = await organismsResponse.json();
        setOrganisms(organismsData);
      }

      // Fetch citations (through junction table)
      const citationsResponse = await fetch(`http://localhost:5000/api/citations/entry/${pdb_id}`);
      if (citationsResponse.ok) {
        const citationsData = await citationsResponse.json();
        setCitations(citationsData);
      }
    } catch (err) {
      console.error('Error fetching related data:', err);
    }
  };

  const fetchAllOrganisms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/organisms');
      if (response.ok) {
        const data = await response.json();
        setAllOrganisms(data.data || data);
      }
    } catch (err) {
      console.error('Error fetching organisms:', err);
    }
  };

  const fetchAllCitations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/citations');
      if (response.ok) {
        const data = await response.json();
        setAllCitations(data.data || data);
      }
    } catch (err) {
      console.error('Error fetching citations:', err);
    }
  };

  const handleSaveEntry = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/entries/${pdb_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEntry),
      });
      
      if (!response.ok) throw new Error('Failed to update entry');
      
      const updatedEntry = await response.json();
      setEntry(updatedEntry);
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEntry = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/entries/${pdb_id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete entry');
      
      navigate('/entries');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddRelation = async () => {
    try {
      const { type } = addRelationDialog;
      let endpoint = '';
      let payload = {};

      switch (type) {
        case 'organism':
          endpoint = 'http://localhost:5000/api/organisms/relation';
          payload = {
            pdb_id: pdb_id,
            organism_id: newRelation.organism_id
          };
          break;
        case 'citation':
          endpoint = 'http://localhost:5000/api/citations/relation';
          payload = {
            pdb_id: pdb_id,
            citation_id: newRelation.citation_id
          };
          break;
        case 'chain':
          endpoint = 'http://localhost:5000/api/chains';
          payload = {
            pdb_id: pdb_id,
            ...newRelation
          };
          break;
        case 'ligand':
          endpoint = 'http://localhost:5000/api/ligands';
          payload = {
            pdb_id: pdb_id,
            ...newRelation
          };
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Failed to add ${type}`);

      // Refresh related data
      fetchRelatedData();
      setAddRelationDialog({ open: false, type: '' });
      setNewRelation({});
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRelation = async () => {
    try {
      const { type, id } = deleteConfirmDialog;
      let endpoint = '';

      switch (type) {
        case 'organism':
          endpoint = `http://localhost:5000/api/organisms/relation/${pdb_id}/${id}`;
          break;
        case 'citation':
          endpoint = `http://localhost:5000/api/citations/relation/${pdb_id}/${id}`;
          break;
        case 'chain':
          endpoint = `http://localhost:5000/api/chains/${id}`;
          break;
        case 'ligand':
          endpoint = `http://localhost:5000/api/ligands/${id}`;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Failed to delete ${type}`);

      // Refresh related data
      fetchRelatedData();
      setDeleteConfirmDialog({ open: false, type: '', id: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const renderEntryDetails = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {entry.pdb_id}
          </Typography>
          <Box>
            {editMode ? (
              <>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEntry}
                  sx={{ mr: 1 }}
                >
                  {t('Save')}
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    setEditedEntry(entry);
                  }}
                >
                  {t('Cancel')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                  sx={{ mr: 1 }}
                >
                  {t('Edit')}
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteConfirmDialog({ open: true, type: 'entry', id: pdb_id })}
                >
                  {t('Delete')}
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {editMode ? (
              <TextField
                fullWidth
                label={t('Title')}
                value={editedEntry.title || ''}
                onChange={(e) => setEditedEntry({ ...editedEntry, title: e.target.value })}
                multiline
                rows={2}
              />
            ) : (
              <Typography variant="h6" gutterBottom>
                {entry.title}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {editMode ? (
              <TextField
                fullWidth
                label={t('Experimental Method')}
                value={editedEntry.experimental_method || ''}
                onChange={(e) => setEditedEntry({ ...editedEntry, experimental_method: e.target.value })}
              />
            ) : (
              <Typography>
                <strong>{t('Experimental Method')}:</strong> {entry.experimental_method}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {editMode ? (
              <TextField
                fullWidth
                label={t('Resolution')}
                type="number"
                value={editedEntry.resolution || ''}
                onChange={(e) => setEditedEntry({ ...editedEntry, resolution: e.target.value })}
              />
            ) : (
              <Typography>
                <strong>{t('Resolution')}:</strong> {entry.resolution} Å
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {editMode ? (
              <TextField
                fullWidth
                label={t('R-Factor')}
                type="number"
                value={editedEntry.r_factor || ''}
                onChange={(e) => setEditedEntry({ ...editedEntry, r_factor: e.target.value })}
              />
            ) : (
              <Typography>
                <strong>{t('R-Factor')}:</strong> {entry.r_factor}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {editMode ? (
              <TextField
                fullWidth
                label={t('Deposition Date')}
                type="date"
                value={editedEntry.deposition_date?.slice(0, 10) || ''}
                onChange={(e) => setEditedEntry({ ...editedEntry, deposition_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <Typography>
                <strong>{t('Deposition Date')}:</strong> {entry.deposition_date?.slice(0, 10)}
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderRelationTable = (title, data, columns, relationshipType) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {title} ({data.length})
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">{title}</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            size="small"
            onClick={() => setAddRelationDialog({ open: true, type: relationshipType })}
          >
            {t('Add')} {title.slice(0, -1)}
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field}>{column.headerName}</TableCell>
                ))}
                <TableCell align="right">{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id || row.chain_id || row.ligand_id || row.organism_id || row.citation_id}>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {column.render ? column.render(row) : row[column.field]}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteConfirmDialog({ 
                        open: true, 
                        type: relationshipType, 
                        id: row.id || row.chain_id || row.ligand_id || row.organism_id || row.citation_id 
                      })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {t('No data available')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );

  const renderAddRelationDialog = () => {
    const { type } = addRelationDialog;
    
    return (
      <Dialog open={addRelationDialog.open} onClose={() => setAddRelationDialog({ open: false, type: '' })}>
        <DialogTitle>
          {t('Add')} {type}
          <IconButton
            aria-label="close"
            onClick={() => setAddRelationDialog({ open: false, type: '' })}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {type === 'organism' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>{t('Select Organism')}</InputLabel>
              <Select
                value={newRelation.organism_id || ''}
                onChange={(e) => setNewRelation({ ...newRelation, organism_id: e.target.value })}
              >
                {allOrganisms.map((organism) => (
                  <MenuItem key={organism.organism_id} value={organism.organism_id}>
                    {organism.scientific_name} ({organism.common_name})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          {type === 'citation' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>{t('Select Citation')}</InputLabel>
              <Select
                value={newRelation.citation_id || ''}
                onChange={(e) => setNewRelation({ ...newRelation, citation_id: e.target.value })}
              >
                {allCitations.map((citation) => (
                  <MenuItem key={citation.citation_id} value={citation.citation_id}>
                    {citation.title} ({citation.publication_year})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          {type === 'chain' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={t('Chain ID')}
                value={newRelation.auth_asym_id || ''}
                onChange={(e) => setNewRelation({ ...newRelation, auth_asym_id: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('Chain Type')}
                value={newRelation.chain_type || ''}
                onChange={(e) => setNewRelation({ ...newRelation, chain_type: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('Sequence')}
                value={newRelation.sequence || ''}
                onChange={(e) => setNewRelation({ ...newRelation, sequence: e.target.value })}
                multiline
                rows={4}
              />
            </Box>
          )}
          
          {type === 'ligand' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={t('Ligand Name')}
                value={newRelation.name || ''}
                onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('Formula')}
                value={newRelation.formula || ''}
                onChange={(e) => setNewRelation({ ...newRelation, formula: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('Weight')}
                type="number"
                value={newRelation.weight || ''}
                onChange={(e) => setNewRelation({ ...newRelation, weight: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddRelationDialog({ open: false, type: '' })}>
            {t('Cancel')}
          </Button>
          <Button variant="contained" onClick={handleAddRelation}>
            {t('Add')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderDeleteConfirmDialog = () => (
    <Dialog open={deleteConfirmDialog.open} onClose={() => setDeleteConfirmDialog({ open: false, type: '', id: null })}>
      <DialogTitle>{t('Confirm Delete')}</DialogTitle>
      <DialogContent>
        <Typography>
          {deleteConfirmDialog.type === 'entry' 
            ? t('Are you sure you want to delete this entry? This action cannot be undone.')
            : t('Are you sure you want to delete this relationship?')
          }
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteConfirmDialog({ open: false, type: '', id: null })}>
          {t('Cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={deleteConfirmDialog.type === 'entry' ? handleDeleteEntry : handleDeleteRelation}
        >
          {t('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!entry) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No data found for PDB ID: {pdb_id}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {renderEntryDetails()}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('Relationships')}
        </Typography>
        
        {renderRelationTable(
          t('Chains'),
          chains,
          [
            { field: 'auth_asym_id', headerName: t('Chain ID') },
            { field: 'chain_type', headerName: t('Type') },
            { field: 'sequence_length', headerName: t('Length') },
            { field: 'details', headerName: t('Details') }
          ],
          'chain'
        )}
        
        {renderRelationTable(
          t('Ligands'),
          ligands,
          [
            { field: 'name', headerName: t('Name') },
            { field: 'formula', headerName: t('Formula') },
            { field: 'weight', headerName: t('Weight') },
            { field: 'description', headerName: t('Description') }
          ],
          'ligand'
        )}
        
        {renderRelationTable(
          t('Organisms'),
          organisms,
          [
            { field: 'scientific_name', headerName: t('Scientific Name') },
            { field: 'common_name', headerName: t('Common Name') },
            { field: 'taxonomy_id', headerName: t('Taxonomy ID') }
          ],
          'organism'
        )}
        
        {renderRelationTable(
          t('Citations'),
          citations,
          [
            { field: 'title', headerName: t('Title') },
            { field: 'authors', headerName: t('Authors') },
            { field: 'journal', headerName: t('Journal') },
            { field: 'publication_year', headerName: t('Year') }
          ],
          'citation'
        )}
      </Box>

      {renderAddRelationDialog()}
      {renderDeleteConfirmDialog()}
    </Box>
  );
}

export default EntryDetail;
