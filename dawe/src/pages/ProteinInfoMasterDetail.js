import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MasterDetailView from '../components/MasterDetailView';
import RecordForm from '../components/RecordForm';
import RelationshipManager from '../components/RelationshipManager';

const ProteinInfoMasterDetail = () => {
  const { t } = useTranslation();

  // Define columns for the master table
  const columns = [
    { field: 'pdb_id', headerName: 'PDB ID', width: 120 },
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'classification', headerName: 'Classification', width: 200 },
    { field: 'organism', headerName: 'Organism', width: 200 },
    { field: 'molecular_weight_kda', headerName: 'Molecular Weight (kDa)', width: 150 },
    { field: 'deposited_date', headerName: 'Deposited Date', width: 120 }
  ];

  // Define fields for the detail view
  const detailFields = [
    { name: 'pdb_id', label: 'PDB ID' },
    { name: 'title', label: 'Title' },
    { name: 'classification', label: 'Classification' },
    { name: 'organism', label: 'Organism' },
    { name: 'expression_system', label: 'Expression System' },
    { name: 'mutations', label: 'Mutations' },
    { name: 'deposited_date', label: 'Deposited Date' },
    { name: 'released_date', label: 'Released Date' },
    { name: 'molecular_weight_kda', label: 'Molecular Weight (kDa)' },
    { name: 'atom_count', label: 'Atom Count' },
    { name: 'residue_count_modeled', label: 'Residue Count (Modeled)' },
    { name: 'residue_count_deposited', label: 'Residue Count (Deposited)' },
    { name: 'unique_chains', label: 'Unique Chains' },
    { name: 'global_symmetry', label: 'Global Symmetry' },
    { name: 'global_stoichiometry', label: 'Global Stoichiometry' }
  ];

  // Define form fields for editing
  const formFields = [
    { name: 'pdb_id', label: 'PDB ID', type: 'text', required: true },
    { name: 'title', label: 'Title', type: 'textarea', rows: 3, required: true },
    { name: 'classification', label: 'Classification', type: 'text' },
    { name: 'organism', label: 'Organism', type: 'text' },
    { name: 'expression_system', label: 'Expression System', type: 'text' },
    { name: 'mutations', label: 'Mutations', type: 'text' },
    { name: 'deposited_date', label: 'Deposited Date', type: 'date' },
    { name: 'released_date', label: 'Released Date', type: 'date' },
    { name: 'molecular_weight_kda', label: 'Molecular Weight (kDa)', type: 'number' },
    { name: 'atom_count', label: 'Atom Count', type: 'number' },
    { name: 'residue_count_modeled', label: 'Residue Count (Modeled)', type: 'number' },
    { name: 'residue_count_deposited', label: 'Residue Count (Deposited)', type: 'number' },
    { name: 'unique_chains', label: 'Unique Chains', type: 'text' },
    { name: 'global_symmetry', label: 'Global Symmetry', type: 'text' },
    { name: 'global_stoichiometry', label: 'Global Stoichiometry', type: 'text' }
  ];

  // Define relationships
  const relationships = [
    {
      key: 'experimental-data',
      label: 'Experimental Data',
      endpoint: 'http://localhost:5000/api/experimental-data',
      columns: [
        { field: 'pdb_id', headerName: 'PDB ID', width: 120 },
        { field: 'method', headerName: 'Method', width: 200 },
        { field: 'resolution', headerName: 'Resolution', width: 120 },
        { field: 'r_value', headerName: 'R-Value', width: 120 },
        { field: 'r_free', headerName: 'R-Free', width: 120 }
      ],
      editFields: [
        { name: 'method', label: 'Method', type: 'text' },
        { name: 'resolution', label: 'Resolution', type: 'number' },
        { name: 'r_value', label: 'R-Value', type: 'number' },
        { name: 'r_free', label: 'R-Free', type: 'number' }
      ]
    },
    {
      key: 'macromolecules',
      label: 'Macromolecules',
      endpoint: 'http://localhost:5000/api/macromolecules',
      columns: [
        { field: 'pdb_id', headerName: 'PDB ID', width: 120 },
        { field: 'chain_id', headerName: 'Chain ID', width: 120 },
        { field: 'molecule_name', headerName: 'Molecule Name', width: 200 },
        { field: 'sequence_length', headerName: 'Sequence Length', width: 150 },
        { field: 'entity_type', headerName: 'Entity Type', width: 150 }
      ],
      editFields: [
        { name: 'chain_id', label: 'Chain ID', type: 'text' },
        { name: 'molecule_name', label: 'Molecule Name', type: 'text' },
        { name: 'sequence_length', label: 'Sequence Length', type: 'number' },
        { name: 'entity_type', label: 'Entity Type', type: 'text' }
      ]
    },
    {
      key: 'authors-funding',
      label: 'Authors & Funding',
      endpoint: 'http://localhost:5000/api/authors-funding',
      columns: [
        { field: 'pdb_id', headerName: 'PDB ID', width: 120 },
        { field: 'author_names', headerName: 'Author Names', width: 300 },
        { field: 'funding_org', headerName: 'Funding Organization', width: 200 },
        { field: 'funding_location', headerName: 'Funding Location', width: 150 },
        { field: 'grant_number', headerName: 'Grant Number', width: 150 }
      ],
      editFields: [
        { name: 'author_names', label: 'Author Names', type: 'textarea', rows: 2 },
        { name: 'funding_org', label: 'Funding Organization', type: 'text' },
        { name: 'funding_location', label: 'Funding Location', type: 'text' },
        { name: 'grant_number', label: 'Grant Number', type: 'text' }
      ]
    },
    {
      key: 'software-used',
      label: 'Software Used',
      endpoint: 'http://localhost:5000/api/software-used',
      columns: [
        { field: 'pdb_id', headerName: 'PDB ID', width: 120 },
        { field: 'software_name', headerName: 'Software Name', width: 200 },
        { field: 'version', headerName: 'Version', width: 120 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'description', headerName: 'Description', width: 300 }
      ],
      editFields: [
        { name: 'software_name', label: 'Software Name', type: 'text' },
        { name: 'version', label: 'Version', type: 'text' },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3 }
      ]
    },
    {
      key: 'version-history',
      label: 'Version History',
      endpoint: 'http://localhost:5000/api/version-history',
      columns: [
        { field: 'pdb_id', headerName: 'PDB ID', width: 120 },
        { field: 'version', headerName: 'Version', width: 120 },
        { field: 'release_date', headerName: 'Release Date', width: 150 },
        { field: 'changes', headerName: 'Changes', width: 400 }
      ],
      editFields: [
        { name: 'version', label: 'Version', type: 'text' },
        { name: 'release_date', label: 'Release Date', type: 'date' },
        { name: 'changes', label: 'Changes', type: 'textarea', rows: 4 }
      ]
    }
  ];

  return (
    <MasterDetailView
      title={t('ProteinInformation')}
      endpoint="http://localhost:5000/api/protein-info"
      columns={columns}
      detailFields={detailFields}
      relationships={relationships}
      formFields={formFields}
    />
  );
};

export default ProteinInfoMasterDetail; 