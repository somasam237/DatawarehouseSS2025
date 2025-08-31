import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from "@mui/material";

const initialForm = {
  pdb_id: "",
  title: "",
  deposition_date: "",
  experimental_method: "",
  resolution: "",
  r_factor: "",
};

const AddEntryModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.pdb_id || !form.title) {
      setError("PDB ID and Title are required.");
      return;
    }
    setError("");
    onSubmit(form);
    setForm(initialForm);
  };

  const handleClose = () => {
    setForm(initialForm);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Entry</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="PDB ID" name="pdb_id" value={form.pdb_id} onChange={handleChange} required />
          <TextField label="Title" name="title" value={form.title} onChange={handleChange} required />
          <TextField label="Deposition Date" name="deposition_date" value={form.deposition_date} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
          <TextField label="Experimental Method" name="experimental_method" value={form.experimental_method} onChange={handleChange} />
          <TextField label="Resolution" name="resolution" value={form.resolution} onChange={handleChange} />
          <TextField label="R Factor" name="r_factor" value={form.r_factor} onChange={handleChange} />
          {error && <div style={{ color: "red" }}>{error}</div>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="success">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEntryModal;
