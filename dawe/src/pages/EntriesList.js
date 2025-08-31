import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Dialog, DialogTitle, DialogContent, IconButton, Button, Stack, TextField, InputAdornment, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; 
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import AddEntryModal from "../components/AddEntryModal";
import ScrollToTopButton from "../components/ScrollToTopButton";
import EnhancedSearch from "../components/EnhancedSearch";
import MasterDetailView from "../components/MasterDetailView";
import ScientificPlots from "../components/ScientificPlots";

const EntriesList = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [userAdded, setUserAdded] = useState([]);
  const [userDeleted, setUserDeleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'search', 'plots'

  useEffect(() => {
    fetch("http://localhost:5000/api/entries?limit=100")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entries");
        return res.json();
      })
      .then((data) => {
        setEntries((data.data || data).map((entry, idx) => ({ id: idx, ...entry })));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEdit = (row) => {
    // Implement edit logic (open a modal or navigate to edit page)
    alert(t("Edit") + ": " + row.pdb_id);
  };
  const handleDelete = async (row) => {
    // Only call backend if not user-added (i.e., exists in DB)
    if (!row.addedByUser) {
      if (!window.confirm(t("AreYouSureDelete"))) return;
      try {
        const res = await fetch(`http://localhost:5000/api/entries/${row.pdb_id}`, { method: "DELETE" });
        if (res.ok) {
          setEntries(entries.filter(e => e.pdb_id !== row.pdb_id));
          setUserDeleted([{ ...row, deletedByUser: true }, ...userDeleted]);
        } else {
          alert(t("DeleteFailed"));
        }
      } catch {
        alert(t("DeleteFailed"));
      }
    } else {
      // For user-added, just move to deleted
      setUserAdded(userAdded.filter(e => e.pdb_id !== row.pdb_id));
      setUserDeleted([{ ...row, deletedByUser: true }, ...userDeleted]);
    }
  };
  const handleRecover = (row) => {
    setUserDeleted(userDeleted.filter(e => e.pdb_id !== row.pdb_id));
    if (row.addedByUser) {
      setUserAdded([row, ...userAdded]);
    } else {
      setEntries([row, ...entries]);
    }
  };
  const handleSave = (row) => {
    // Implement save logic (e.g., save to favorites)
    alert(t("Save") + ": " + row.pdb_id);
  };
  const handleAdd = () => {
    setAddOpen(true);
  };
  const handleAddSubmit = async (form) => {
    // Validate pdb_id
    if (!form.pdb_id || form.pdb_id.length !== 4) {
      alert("PDB ID must be exactly 4 characters.");
      return;
    }
    // Prevent duplicate PDB ID
    const pdbIdUpper = form.pdb_id.toUpperCase();
    if (
      entries.some(e => e.pdb_id === pdbIdUpper) ||
      userAdded.some(e => e.pdbId === pdbIdUpper)
    ) {
      alert("PDB ID already exists. Please use a unique 4-character PDB ID.");
      return;
    }
    // Validate date fields
    const isValidDate = (d) => !d || /^\d{4}-\d{2}-\d{2}$/.test(d);
    if (!isValidDate(form.deposition_date) || !isValidDate(form.revision_date)) {
      alert("Dates must be in YYYY-MM-DD format or empty.");
      return;
    }
    // Validate numeric fields
    const resolution = form.resolution ? parseFloat(form.resolution) : null;
    const r_factor = form.r_factor ? parseFloat(form.r_factor) : null;
    if (form.resolution && isNaN(resolution)) {
      alert("Resolution must be a number or empty.");
      return;
    }
    if (form.r_factor && isNaN(r_factor)) {
      alert("R-factor must be a number or empty.");
      return;
    }
    // Prepare payload
    const payload = {
      ...form,
      pdb_id: pdbIdUpper,
      deposition_date: form.deposition_date || null,
      revision_date: form.revision_date || form.deposition_date || new Date().toISOString().slice(0,10),
      experimental_method: form.experimental_method || null,
      resolution,
      r_factor,
      full_cif_data: form.full_cif_data || '',
    };
    try {
      // Do NOT refetch from backend, just add to userAdded
      setUserAdded([{ ...payload, addedByUser: true, id: Date.now() }, ...userAdded]);
      setAddOpen(false);
    } catch (e) {
      setAddOpen(false);
      alert("Failed to add entry: " + e.message);
      console.error("Add entry exception:", e, payload);
    }
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setViewMode('search');
  };

  // Filtered entries based on search
  const filterFn = (entry) => {
    const q = search.toLowerCase();
    return (
      entry.title?.toLowerCase().includes(q) ||
      entry.pdb_id?.toLowerCase().includes(q) ||
      (entry.resolution !== undefined && String(entry.resolution).toLowerCase().includes(q))
    );
  };

  const columns = [
    {
      field: "thumbnail",
      headerName: t("Image"),
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <img
          src={`https://cdn.rcsb.org/images/structures/${params.row.pdb_id.slice(1,3).toLowerCase()}/${params.row.pdb_id.toLowerCase()}/${params.row.pdb_id.toLowerCase()}_assembly-1.jpeg`}
          alt={params.row.pdb_id}
          style={{ width: 100, height: 100, objectFit: "contain" }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ),
    },
    { 
      field: "pdb_id", 
      headerName: t("PDBID"), 
      flex: 1,
      renderCell: (params) => (
        <Link 
          to={`/entries/${params.value}`}
          style={{ 
            color: '#1976d2', 
            textDecoration: 'underline',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {params.value}
        </Link>
      )
    },
    { 
      field: "title", 
      headerName: t("Title"), 
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.2, fontSize: 20, width: '100%' }}>
          {params.value}
        </Box>
      )
    },
    { 
      field: "deposition_date", 
      headerName: t("DepositionDate"), 
      flex: 1,
      valueGetter: (params) => (params?.value ? params.value.slice(0, 10) : "")
    },
    { 
      field: "experimental_method", 
      headerName: t("ExperimentalMethod"), 
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.2, fontSize: 20, width: '100%' }}>
          {params.value}
        </Box>
      )
    },
    { field: "resolution", headerName: t("Resolution"), flex: 1 },
    { field: "r_factor", headerName: t("RFactor"), flex: 1 },
    {
      field: "actions",
      headerName: t("Actions"),
      flex: 1.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" color="primary" onClick={() => handleSave(params.row)}>{t("Save")}</Button>
          <Button size="small" variant="contained" color="info" onClick={() => handleEdit(params.row)}>{t("Edit")}</Button>
          <Button size="small" variant="contained" color="error" onClick={() => handleDelete(params.row)}>{t("Delete")}</Button>
        </Stack>
      ),
    },
  ];

  const deletedColumns = [
    ...columns.filter(col => col.field !== "actions"),
    {
      field: "recover",
      headerName: t("Recover"),
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button size="small" variant="contained" color="secondary" onClick={() => handleRecover(params.row)}>{t("Recover")}</Button>
      ),
    },
  ];

  const renderViewModeControls = () => (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button 
        variant={viewMode === 'list' ? 'contained' : 'outlined'}
        onClick={() => setViewMode('list')}
      >
        {t('List View')}
      </Button>
      <Button 
        variant={viewMode === 'search' ? 'contained' : 'outlined'}
        onClick={() => setViewMode('search')}
      >
        {t('Enhanced Search')}
      </Button>
      <Button 
        variant={viewMode === 'plots' ? 'contained' : 'outlined'}
        onClick={() => setViewMode('plots')}
      >
        {t('Scientific Plots')}
      </Button>
    </Stack>
  );

  const renderContent = () => {
    switch(viewMode) {
      case 'search':
        return (
          <Box>
            <EnhancedSearch onSearchResults={handleSearchResults} />
            {searchResults.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <MasterDetailView 
                  searchResults={searchResults} 
                  searchType="entries"
                />
              </Box>
            )}
          </Box>
        );
      case 'plots':
        return <ScientificPlots />;
      default:
        return renderListView();
    }
  };

  const renderListView = () => (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder={t("Search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" onClick={handleAdd}>
          {t("Add")}
        </Button>
      </Stack>

      <DataGrid
        rows={entries.filter(e => !userAdded.some(u => u.pdb_id === e.pdb_id)).filter(filterFn)}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 20, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
        loading={loading}
        rowHeight={120}
        sx={{
          "& .MuiDataGrid-row": {
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          },
          "& .MuiDataGrid-cell": {
            cursor: "default",
          },
        }}
      />

      {userDeleted.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("Deleted Items")}
          </Typography>
          <DataGrid
            rows={userDeleted}
            columns={[
              ...columns.filter(col => col.field !== 'actions'),
              {
                field: "actions",
                headerName: t("Actions"),
                flex: 1.5,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRecover(params.row)}
                  >
                    {t("Recover")}
                  </Button>
                ),
              },
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            sx={{
              "& .MuiDataGrid-row": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );

  const filteredEntries = entries.filter(entry => 
    entry.pdb_id?.toLowerCase().includes(search.toLowerCase()) ||
    entry.title?.toLowerCase().includes(search.toLowerCase()) ||
    entry.experimental_method?.toLowerCase().includes(search.toLowerCase())
  );

  const allEntries = [...filteredEntries, ...userAdded];

  if (loading) return <div>Loading entries...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {renderViewModeControls()}
      <AddEntryModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAddSubmit} />
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>{t("Entries")}</Typography>
      {renderContent()}
      <Dialog open={!!selectedEntry} onClose={() => setSelectedEntry(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t("Entry")} {selectedEntry?.pdb_id}
          <IconButton
            aria-label="close"
            onClick={() => setSelectedEntry(null)}
            sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEntry && (
            <Box>
              <Typography><b>{t("Title")}:</b> {selectedEntry.title}</Typography>
              <Typography><b>{t("DepositionDate")}:</b> {selectedEntry.deposition_date?.slice(0, 10)}</Typography>
              <Typography><b>{t("ExperimentalMethod")}:</b> {selectedEntry.experimental_method}</Typography>
              <Typography><b>{t("Resolution")}:</b> {selectedEntry.resolution}</Typography>
              <Typography><b>{t("RFactor")}:</b> {selectedEntry.r_factor}</Typography>
              {/* Add more fields as needed */}
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <ScrollToTopButton />
    </Box>
  
  );
  
};

export default EntriesList;