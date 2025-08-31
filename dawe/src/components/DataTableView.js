// src/components/DataTableView.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  TrendingUp as PlotIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import PlotWrapper from './PlotWrapper';
import { experimentalDataAPI } from '../services/api';

const CustomToolbar = ({ onRefresh, searchValue, onSearchChange, showPlots, onTogglePlots }) => {
  const { t } = useTranslation();

  return (
    <GridToolbarContainer>
      <IconButton
        size="small"
        onClick={onRefresh}
        title={t('Refresh')}
        sx={{ mr: 1 }}
      >
        <RefreshIcon />
      </IconButton>
      <Button
        size="small"
        startIcon={<PlotIcon />}
        onClick={onTogglePlots}
        color={showPlots ? "primary" : "secondary"}
        variant={showPlots ? "contained" : "outlined"}
        sx={{ mr: 1 }}
      >
        {t('Plots')}
      </Button>
      <Box sx={{ flexGrow: 1 }} />
      <TextField
        size="small"
        placeholder={t('Search...')}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
        }}
        sx={{ minWidth: 200, mr: 1 }}
      />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const DataTableView = ({
  title,
  columns,
  apiService,
  primaryKey = 'id',
  detailFields = [],
  plotConfigs = [],
  canAdd = true,
  canEdit = true,
  canDelete = true,
  customDetailComponent,
  customPlotComponent,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [pagination, setPagination] = useState({ page: 0, pageSize: 25 });
  const [total, setTotal] = useState(0);
  const [showPlots, setShowPlots] = useState(false);
  const [plotData, setPlotData] = useState({});

  // Enhanced columns with action buttons
  const enhancedColumns = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: t('Actions'),
      width: 120,
      cellClassName: 'actions',
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label={t('View')}
          onClick={() => handleView(id)}
          color="inherit"
        />,
        ...(canEdit ? [
          <GridActionsCellItem
            icon={<EditIcon />}
            label={t('Edit')}
            onClick={() => handleEdit(id)}
            color="inherit"
          />
        ] : []),
        ...(canDelete ? [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label={t('Delete')}
            onClick={() => handleDeleteConfirm(id)}
            color="inherit"
          />
        ] : []),
      ],
    },
  ];

  // Load data
  const loadData = async (searchQuery = '') => {
    try {
      setLoading(true);
      const params = {
        limit: pagination.pageSize,
        offset: pagination.page * pagination.pageSize,
        ...(searchQuery && { q: searchQuery }),
      };

      const response = await apiService.getAll(params);
      const data = response.data;

      let processedRows = [];
      if (Array.isArray(data)) {
        processedRows = data;
        setTotal(data.length);
      } else if (data.data && Array.isArray(data.data)) {
        processedRows = data.data;
        setTotal(data.total || data.data.length);
      } else {
        console.warn('Unexpected API response format:', data);
        processedRows = [];
        setTotal(0);
      }

      // Ensure all rows have unique IDs
      const rowsWithIds = processedRows.map((row, index) => {
        // Handle composite primary keys (arrays) or single primary keys
        let rowId;
        if (Array.isArray(primaryKey)) {
          // For composite keys, create a unique ID by combining the values
          rowId = primaryKey.map(key => row[key]).join('_');
          if (!rowId || rowId.includes('undefined') || rowId.includes('null')) {
            console.warn(`Row missing composite primary key ${primaryKey.join(', ')}:`, row);
            rowId = `temp_${index}`;
          }
        } else {
          // For single primary keys
          rowId = row[primaryKey];
          if (!rowId) {
            console.warn(`Row missing ${primaryKey}:`, row);
            rowId = `temp_${index}`;
          }
        }
        
        return { ...row, id: rowId };
      });

      setRows(rowsWithIds);

      // Load plot data if plots are enabled
      if (showPlots && plotConfigs.length > 0) {
        loadPlotData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar(t('Error loading data'), 'error');
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Load plot data
  const loadPlotData = async () => {
    try {
      if (apiService.getStatistics) {
        const statsResponse = await apiService.getStatistics();
        setPlotData(statsResponse.data || {});
      }
    } catch (error) {
      console.error('Error loading plot data:', error);
    }
  };

  // Effect hooks
  useEffect(() => {
    loadData(searchValue);
  }, [pagination, searchValue]);

  useEffect(() => {
    if (showPlots && plotConfigs.length > 0) {
      loadPlotData();
    }
  }, [showPlots]);

  // Event handlers
  const handleView = (id) => {
    const row = rows.find(r => r.id === id);
    
    // If we're on the protein-info page, navigate to the detail page
    if (location.pathname === '/protein-info') {
      navigate(`/protein-info/${id}`);
      return;
    }
    
    // Otherwise, show the detail dialog as before
    setSelectedRow(row);
    setEditMode(false);
    setDetailOpen(true);
  };

  const handleEdit = (id) => {
    const row = rows.find(r => r.id === id);
    setSelectedRow(row);
    setEditData({ ...row });
    setEditMode(true);
    setDetailOpen(true);
  };

  const handleAdd = () => {
    setSelectedRow(null);
    setEditData({});
    setEditMode(true);
    setDetailOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    setRowToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      // Handle different API signatures for different services
      if (apiService === experimentalDataAPI) {
        // For experimental data, we need to get the pdb_id from the row data
        const rowData = rows.find(r => r.id === rowToDelete);
        if (rowData) {
          await apiService.delete(rowData.pdb_id);
        } else {
          throw new Error('Row data not found');
        }
      } else {
        await apiService.delete(rowToDelete);
      }
      showSnackbar(t('Record deleted successfully'), 'success');
      loadData(searchValue);
    } catch (error) {
      console.error('Error deleting record:', error);
      showSnackbar(t('Error deleting record'), 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setRowToDelete(null);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedRow) {
        // Update existing record
        // Handle different API signatures for different services
        if (apiService === experimentalDataAPI) {
          // For experimental data, use pdb_id directly
          await apiService.update(editData.pdb_id || selectedRow.pdb_id, editData);
        } else {
          // For composite keys, we need to use the original primary key values for the API call
          let updateId;
          if (Array.isArray(primaryKey)) {
            updateId = primaryKey.map(key => selectedRow[key]).join('_');
          } else {
            updateId = selectedRow[primaryKey];
          }
          await apiService.update(updateId, editData);
        }
        showSnackbar(t('Record updated successfully'), 'success');
      } else {
        // Create new record
        await apiService.create(editData);
        showSnackbar(t('Record created successfully'), 'success');
      }
      setDetailOpen(false);
      loadData(searchValue);
    } catch (error) {
      console.error('Error saving record:', error);
      showSnackbar(t('Error saving record'), 'error');
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedRow(null);
    setEditData({});
    setEditMode(false);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTogglePlots = () => {
    setShowPlots(!showPlots);
  };

  // Render detail fields
  const renderDetailFields = () => {
    const dataToShow = editMode ? editData : selectedRow;
    if (!dataToShow) return null;

    return detailFields.map((field) => (
      <Grid item xs={12} sm={6} md={4} key={field.key}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {field.label}
          </Typography>
          {editMode ? (
            field.type === 'select' ? (
              <FormControl fullWidth size="small">
                <Select
                  value={editData[field.key] || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, [field.key]: e.target.value }))}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="small"
                type={field.type || 'text'}
                value={editData[field.key] || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, [field.key]: e.target.value }))}
                multiline={field.multiline}
                rows={field.multiline ? 3 : 1}
                required={field.required}
              />
            )
          ) : (
            <Typography variant="body1">
              {field.render ? field.render(dataToShow[field.key], dataToShow) : (dataToShow[field.key] || '-')}
            </Typography>
          )}
        </Box>
      </Grid>
    ));
  };

  // Render plots
  const renderPlots = () => {
    if (!showPlots || plotConfigs.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('Data Visualization')}
          </Typography>
          <Grid container spacing={2}>
            {plotConfigs.map((config, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {config.title}
                    </Typography>
                    {customPlotComponent ? 
                      customPlotComponent(config, plotData, rows) :
                      <PlotWrapper
                        data={config.generateData ? config.generateData(rows, plotData) : []}
                        layout={{
                          ...config.layout,
                          autosize: true,
                          height: 300,
                        }}
                        config={{ responsive: true }}
                        style={{ width: '100%', height: '300px' }}
                      />
                    }
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100vh', width: '100%', p: 2 }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          {canAdd && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ ml: 2 }}
            >
              {t('AddNewEntry')}
            </Button>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t('Total records')}: {total}
        </Typography>
      </Paper>

      {/* Plots Section */}
      {renderPlots()}

      {/* Main Data Grid */}
      <Paper sx={{ height: showPlots ? 'calc(100vh - 500px)' : 'calc(100vh - 200px)', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={enhancedColumns}
          getRowId={(row) => row.id}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationMode="server"
          rowCount={total}
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          checkboxSelection={false}
          disableRowSelectionOnClick
                      slots={{
              toolbar: () => (
                <CustomToolbar
                  onRefresh={() => loadData(searchValue)}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  showPlots={showPlots}
                  onTogglePlots={handleTogglePlots}
                />
              ),
            }}
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#fafafa',
              borderBottom: '2px solid #e0e0e0',
            },
          }}
        />
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={handleCloseDetail}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {editMode ? (selectedRow ? t('Edit Record') : t('Add Record')) : t('View Details')}
            </Typography>
            <IconButton onClick={handleCloseDetail}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {customDetailComponent ? (
            customDetailComponent(selectedRow, editMode, editData, setEditData)
          ) : (
            <Grid container spacing={3}>
              {renderDetailFields()}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail} color="secondary">
            {t('Cancel')}
          </Button>
          {editMode && (
            <Button onClick={handleSave} color="primary" variant="contained" startIcon={<SaveIcon />}>
              {t('Save')}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>{t('Confirm Delete')}</DialogTitle>
        <DialogContent>
          <Typography>{t('Are you sure you want to delete this record? This action cannot be undone.')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">
            {t('Cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataTableView;
