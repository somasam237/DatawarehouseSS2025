import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { Box, Typography, Modal, TextField, Button } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #a21caf',
  boxShadow: 24,
  p: 4,
};

function OrganismsList() {
  const { t } = useTranslation();
  const [organisms, setOrganisms] = useState([]);
  const [filteredOrganisms, setFilteredOrganisms] = useState([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/organisms")
      .then((res) => res.json())
      .then((data) => {
        setOrganisms(data);
        setFilteredOrganisms(data);
      });
  }, []);

  useEffect(() => {
    setFilteredOrganisms(
      organisms.filter((row) =>
        row.scientific_name?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, organisms]);

  const columns = [
    { field: "id", headerName: t("organisms.id"), width: 90 },
    { field: "scientific_name", headerName: t("organisms.scientific_name"), width: 200 },
    { field: "common_name", headerName: t("organisms.common_name"), width: 180 },
    { field: "taxonomy_id", headerName: t("organisms.taxonomy_id"), width: 120 },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Typography variant="h4" gutterBottom>{t("organisms.title")}</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label={t("search")}
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <DataGrid
        rows={filteredOrganisms.map((row, idx) => ({ id: row.id || idx, ...row }))}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        rowsPerPageOptions={[5, 10, 20]}
        pagination
        onRowClick={(params) => { setSelectedRow(params.row); setOpen(true); }}
        autoHeight
      />
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          {selectedRow && (
            <>
              <Typography variant="h6" gutterBottom>{t("organisms.detail")}</Typography>
              <Typography><b>{t("organisms.scientific_name")}:</b> {selectedRow.scientific_name}</Typography>
              <Typography><b>{t("organisms.common_name")}:</b> {selectedRow.common_name}</Typography>
              <Typography><b>{t("organisms.taxonomy_id")}:</b> {selectedRow.taxonomy_id}</Typography>
              <Button sx={{ mt: 2 }} variant="contained" color="secondary" onClick={() => setOpen(false)}>{t("close")}</Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default OrganismsList;
