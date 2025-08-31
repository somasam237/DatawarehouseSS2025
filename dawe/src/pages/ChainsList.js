import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, TextField, MenuItem, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ChainsList = () => {
  const { t } = useTranslation();
  const [chains, setChains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("pdb_id");

  useEffect(() => {
    let url = "http://localhost:5000/api/chains";
    if (search) url += `?${searchBy}=${encodeURIComponent(search)}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chains");
        return res.json();
      })
      .then((data) => {
        setChains((data.data || data).map((row, idx) => ({ id: row.chain_id || idx, ...row })));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [search, searchBy]);

  const columns = [
    { field: "chain_id", headerName: t("ChainID"), flex: 1 },
    { field: "pdb_id", headerName: t("PDBID"), flex: 1 },
    { field: "auth_asym_id", headerName: t("AuthAsymID"), flex: 1 },
    { field: "entity_id", headerName: t("EntityID"), flex: 1 },
    { field: "chain_type", headerName: t("ChainType"), flex: 1 },
    { field: "sequence", headerName: t("Sequence"), flex: 2 },
    { field: "sequence_length", headerName: t("SequenceLength"), flex: 1 },
    { field: "details", headerName: t("Details"), flex: 1 },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", p: 3 }}>
      <Typography variant="h4" gutterBottom>{t("ChainsList")}</Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <TextField
          select
          label={t("SearchBy")}
          value={searchBy}
          onChange={e => setSearchBy(e.target.value)}
          size="small"
        >
          <MenuItem value="pdb_id">{t("PDBID")}</MenuItem>
          <MenuItem value="auth_asym_id">{t("AuthAsymID")}</MenuItem>
        </TextField>
        <TextField
          label={t("Search")}
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearch(search)}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <DataGrid
        rows={chains}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20, 50]}
        pagination
        disableSelectionOnClick
        loading={loading}
        sx={{
          background: "#fff",
          borderRadius: 2,
          boxShadow: 2,
        }}
        localeText={{
          noRowsLabel: t("NoData"),
        }}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </Box>
  );
};

export default ChainsList;