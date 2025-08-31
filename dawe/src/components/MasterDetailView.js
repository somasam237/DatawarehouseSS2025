import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  Tooltip,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ArrowBack as BackIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import RecordForm from './RecordForm';

const MasterDetailView = ({
  title,
  endpoint,
  columns,
  detailFields,
  relationships = [],
  formFields = [],
  onAdd,
  onEdit,
  onDelete,
  onViewRelations
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailView, setDetailView] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [relationDialog, setRelationDialog] = useState(false);
  const [currentRelation, setCurrentRelation] = useState(null);
  const [relationData, setRelationData] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${endpoint}?limit=${rowsPerPage}&offset=${page * rowsPerPage}&search=${searchTerm}`);
      if (response.ok) {
        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setSnackbar({ open: true, message: t('ErrorLoadingData'), severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Load relationship data
  const loadRelationData = async (relation) => {
    try {
      const response = await fetch(`${relation.endpoint}/by-pdb/${selectedRecord.pdb_id}`);
      if (response.ok) {
        const result = await response.json();
        setRelationData(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error('Error loading relation data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, searchTerm]);

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle record selection
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailView(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialog(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteDialog(true);
  };

  // Handle CRUD operations
  const handleAdd = () => {
    setSelectedRecord({});
    setEditDialog(true);
  };

  const handleSave = async (recordData) => {
    try {
      const method = recordData.id ? 'PUT' : 'POST';
      const url = recordData.id ? `${endpoint}/${recordData.id}` : endpoint;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });

      if (response.ok) {
        setSnackbar({ 
          open: true, 
          message: recordData.id ? t('RecordUpdated') : t('RecordCreated'), 
          severity: 'success' 
        });
        setEditDialog(false);
        loadData();
      }
    } catch (error) {
      setSnackbar({ open: true, message: t('ErrorSavingRecord'), severity: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${endpoint}/${selectedRecord.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSnackbar({ open: true, message: t('RecordDeleted'), severity: 'success' });
        setDeleteDialog(false);
        setDetailView(false);
        loadData();
      }
    } catch (error) {
      setSnackbar({ open: true, message: t('ErrorDeletingRecord'), severity: 'error' });
    }
  };

  // Handle relationships
  const handleViewRelation = (relation) => {
    setCurrentRelation(relation);
    loadRelationData(relation);
    setRelationDialog(true);
  };

  const handleAddRelation = async (relationRecord) => {
    try {
      const response = await fetch(`${currentRelation.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...relationRecord,
          pdb_id: selectedRecord.pdb_id
        })
      });

      if (response.ok) {
        setSnackbar({ open: true, message: t('RelationAdded'), severity: 'success' });
        loadRelationData(currentRelation);
      }
    } catch (error) {
      setSnackbar({ open: true, message: t('ErrorAddingRelation'), severity: 'error' });
    }
  };

  const handleRemoveRelation = async (relationId) => {
    try {
      const response = await fetch(`${currentRelation.endpoint}/${relationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSnackbar({ open: true, message: t('RelationRemoved'), severity: 'success' });
        loadRelationData(currentRelation);
      }
    } catch (error) {
      setSnackbar({ open: true, message: t('ErrorRemovingRelation'), severity: 'error' });
    }
  };

  // Master view
  const MasterView = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}
        >
          {t('Add')}
        </Button>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('Search')}
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ fontWeight: 'bold' }}>
                  {column.headerName}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {column.renderCell ? column.renderCell(row) : row[column.field]}
                  </TableCell>
                ))}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={t('ViewDetails')}>
                      <IconButton size="small" onClick={() => handleViewDetails(row)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('Edit')}>
                      <IconButton size="small" onClick={() => handleEdit(row)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('Delete')}>
                      <IconButton size="small" onClick={() => handleDelete(row)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={-1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );

  // Detail view
  const DetailView = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => setDetailView(false)} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {t('Details')} - {selectedRecord?.pdb_id || selectedRecord?.id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('RecordInformation')}
              </Typography>
              <Grid container spacing={2}>
                {detailFields.map((field) => (
                  <Grid item xs={12} sm={6} key={field.name}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {field.label}
                    </Typography>
                    <Typography variant="body1">
                      {field.render ? field.render(selectedRecord) : selectedRecord[field.name]}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('Actions')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(selectedRecord)}
                  fullWidth
                >
                  {t('Edit')}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(selectedRecord)}
                  fullWidth
                >
                  {t('Delete')}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {relationships.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('Relationships')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {relationships.map((relation) => (
                    <Button
                      key={relation.key}
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      onClick={() => handleViewRelation(relation)}
                      fullWidth
                    >
                      {relation.label}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {detailView ? <DetailView /> : <MasterView />}

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecord?.id ? t('EditRecord') : t('AddRecord')}
        </DialogTitle>
        <DialogContent>
          <RecordForm
            fields={formFields}
            initialData={selectedRecord}
            onSubmit={handleSave}
            onCancel={() => setEditDialog(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>{t('ConfirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('AreYouSureDelete')} {selectedRecord?.pdb_id || selectedRecord?.id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>{t('Cancel')}</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Relation Dialog */}
      <Dialog open={relationDialog} onClose={() => setRelationDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {currentRelation?.label} - {selectedRecord?.pdb_id}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* Add relation form */}}
            >
              {t('AddRelation')}
            </Button>
          </Box>
          <DataGrid
            rows={relationData}
            columns={currentRelation?.columns || []}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            autoHeight
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRelationDialog(false)}>{t('Close')}</Button>
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

export default MasterDetailView;
