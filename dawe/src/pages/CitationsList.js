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

function CitationsList() {
  const { t } = useTranslation();
  const [citations, setCitations] = useState([]);
  const [filteredCitations, setFilteredCitations] = useState([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/citations")
      .then((res) => res.json())
      .then((data) => {
        setCitations(data);
        setFilteredCitations(data);
      });
  }, []);

  useEffect(() => {
    setFilteredCitations(
      citations.filter((row) =>
        row.title?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, citations]);

  const columns = [
    { field: "id", headerName: t("citations.id"), width: 90 },
    { field: "title", headerName: t("citations.title_col"), width: 220 },
    { field: "journal", headerName: t("citations.journal"), width: 180 },
    { field: "year", headerName: t("citations.year"), width: 100 },
    { field: "authors", headerName: t("citations.authors"), width: 200 },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Typography variant="h4" gutterBottom>{t("citations.title")}</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label={t("search")}
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <DataGrid
        rows={filteredCitations.map((row, idx) => ({ id: row.id || idx, ...row }))}
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
              <Typography variant="h6" gutterBottom>{t("citations.detail")}</Typography>
              <Typography><b>{t("citations.title_col")}:</b> {selectedRow.title}</Typography>
              <Typography><b>{t("citations.journal")}:</b> {selectedRow.journal}</Typography>
              <Typography><b>{t("citations.year")}:</b> {selectedRow.year}</Typography>
              <Typography><b>{t("citations.authors")}:</b> {selectedRow.authors}</Typography>
              <Button sx={{ mt: 2 }} variant="contained" color="secondary" onClick={() => setOpen(false)}>{t("close")}</Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default CitationsList;
