import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

const RelationshipManager = ({
  title,
  sourceRecord,
  relationship,
  onAdd,
  onRemove,
  onUpdate
}) => {
  const { t } = useTranslation();
  const [relatedRecords, setRelatedRecords] = useState([]);
  const [availableRecords, setAvailableRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load related records
  const loadRelatedRecords = async () => {
    if (!sourceRecord || !relationship) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${relationship.endpoint}/by-pdb/${sourceRecord.pdb_id}`);
      if (response.ok) {
        const data = await response.json();
        setRelatedRecords(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading related records:', error);
      setSnackbar({ open: true, message: t('ErrorLoadingRelations'), severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Load available records for adding
  const loadAvailableRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${relationship.endpoint}?limit=100`);
      if (response.ok) {
        const data = await response.json();
        // Filter out already related records
        const relatedIds = relatedRecords.map(r => r.id);
        const available = Array.isArray(data) ? data.filter(r => !relatedIds.includes(r.id)) : [];
        setAvailableRecords(available);
      }
    } catch (error) {
      console.error('Error loading available records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRelatedRecords();
  }, [sourceRecord, relationship]);

  // Handle add relationship
  const handleAdd = async (recordData) => {
    try {
      const response = await fetch(relationship.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...recordData,
          pdb_id: sourceRecord.pdb_id
        })
      });

      if (response.ok) {
        setSnackbar({ open: true, message: t('RelationAdded'), severity: 'success' });
        setAddDialog(false);
        loadRelatedRecords();
        if (onAdd) onAdd(recordData);
      }
    } catch (error) {
      setSnackbar({ open: true, message: t('ErrorAddingRelation'), severity: 'error' });
    }
  };

  // Handle remove relationship
  const handleRemove = async (recordId) => {
    try {
      const response = await fetch(`${relationship.endpoint}/${recordId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSnackbar({ open: true, message: t('RelationRemoved'), severity: 'success' });
        loadRelatedRecords();
        if (onRemove) onRemove(recordId);
      }
    } catch (error) {
      setSnackbar({ open: true, message: t('ErrorRemovingRelation'), severity: 'error' });
    }
  };

  // Handle update relationship
  const handleUpdate = async (recordData) => {
    try {
      const response = await fetch(`${relationship.endpoint}/${recordData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });

      if (response.ok) {
        setSnackbar({ open: true, message: t('RelationUpdated'), severity: 'success' });
        setEditDialog(false);
        loadRelatedRecords();
        if (onUpdate) onUpdate(recordData);
      }
    } catch (error) {
      setSnackbar({ open: true, message: t('ErrorUpdatingRelation'), severity: 'error' });
    }
  };

  // Filter available records based on search
  const filteredAvailableRecords = availableRecords.filter(record =>
    Object.values(record).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {title} ({relatedRecords.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedRecord(null);
            setAddDialog(true);
            loadAvailableRecords();
          }}
          sx={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}
        >
          {t('AddRelation')}
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {relationship.columns?.map((column) => (
                  <TableCell key={column.field} sx={{ fontWeight: 'bold' }}>
                    {column.headerName}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold' }}>{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relatedRecords.map((record) => (
                <TableRow key={record.id} hover>
                  {relationship.columns?.map((column) => (
                    <TableCell key={column.field}>
                      {column.renderCell ? column.renderCell(record) : record[column.field]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={t('Edit')}>
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setSelectedRecord(record);
                            setEditDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('Remove')}>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRemove(record.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Dialog */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('AddRelation')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder={t('SearchAvailableRecords')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Box>
          <DataGrid
            rows={filteredAvailableRecords}
            columns={relationship.columns || []}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            autoHeight
            onRowClick={(params) => {
              handleAdd(params.row);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)}>{t('Cancel')}</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('EditRelation')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {relationship.editFields?.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={selectedRecord?.[field.name] || ''}
                  onChange={(e) => setSelectedRecord(prev => ({
                    ...prev,
                    [field.name]: e.target.value
                  }))}
                  type={field.type || 'text'}
                  multiline={field.multiline}
                  rows={field.rows || 1}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>{t('Cancel')}</Button>
          <Button 
            onClick={() => handleUpdate(selectedRecord)} 
            variant="contained"
          >
            {t('Save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RelationshipManager; 