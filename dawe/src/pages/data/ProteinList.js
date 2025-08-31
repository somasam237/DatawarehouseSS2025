// src/pages/ProteinList.jsx
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {proteinInfoAPI} from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ProteinList = () => {
  const [proteins, setProteins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProteins = async () => {
    try {
      const response = await proteinInfoAPI.getAll();
      setProteins(response.data);
    } catch (error) {
      console.error("Error fetching proteins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProteins();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await proteinInfoAPI.delete(id);
        fetchProteins(); // Refresh
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const columns = [
    { field: "pdb_id", headerName: "PDB ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 2 },
    { field: "organism", headerName: "Organism", flex: 1.5 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => navigate(`/protein/${params.row.pdb_id}`)}>View</Button>
          <Button size="small" onClick={() => navigate(`/protein/${params.row.pdb_id}/edit`)}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleDelete(params.row.pdb_id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Proteins</h2>
        <Button variant="contained" color="primary" onClick={() => navigate("/protein/new")}>
          + Add New
        </Button>
      </div>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={proteins}
          columns={columns}
          getRowId={(row) => row.pdb_id}
          loading={loading}
          pagination
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ProteinList;
