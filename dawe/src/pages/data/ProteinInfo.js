// src/pages/ProteinInfo.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {proteinInfoAPI} from "../../services/api";

const ProteinInfo = () => {
  const { pdb_id } = useParams();
  const [protein, setProtein] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtein = async () => {
      try {
        const response = await proteinInfoAPI.getById(pdb_id);
        setProtein(response.data);
      } catch (error) {
        console.error("Error fetching protein info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProtein();
  }, [pdb_id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!protein) return <div className="p-4 text-red-600">Protein not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Protein Info: {protein.pdb_id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md p-6 rounded-lg">
        <div><strong>Title:</strong> {protein.title}</div>
        <div><strong>Classification:</strong> {protein.classification}</div>
        <div><strong>Organism:</strong> {protein.organism}</div>
        <div><strong>Expression System:</strong> {protein.expression_system}</div>
        <div><strong>Mutations:</strong> {protein.mutations || "None"}</div>
        <div><strong>Deposited Date:</strong> {new Date(protein.deposited_date).toLocaleDateString()}</div>
        <div><strong>Released Date:</strong> {protein.released_date ? new Date(protein.released_date).toLocaleDateString() : "Not available"}</div>
        <div><strong>Molecular Weight (kDa):</strong> {protein.molecular_weight_kda || "N/A"}</div>
        <div><strong>Atom Count:</strong> {protein.atom_count}</div>
        <div><strong>Residues Modeled:</strong> {protein.residue_count_modeled}</div>
        <div><strong>Residues Deposited:</strong> {protein.residue_count_deposited}</div>
        <div><strong>Unique Chains:</strong> {protein.unique_chains}</div>
        <div><strong>Global Symmetry:</strong> {protein.global_symmetry}</div>
        <div><strong>Stoichiometry:</strong> {protein.global_stoichiometry}</div>
      </div>
    </div>
  );
};

export default ProteinInfo;
