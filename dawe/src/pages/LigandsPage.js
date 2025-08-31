// src/pages/LigandsPage.js
import React from 'react';
import DataTableView from '../components/DataTableView';
import { ligandsAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Chip, Box, Typography } from '@mui/material';

const LigandsPage = () => {
  const { t } = useTranslation();

  const columns = [
    {
      field: 'pdb_id',
      headerName: 'PDB ID',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      field: 'ligand_id',
      headerName: 'Ligand ID',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="secondary" variant="outlined" />
      ),
    },
    {
      field: 'ligand_name',
      headerName: t('Ligand Name'),
      width: 200,
      flex: 1,
    },
    {
      field: 'chemical_formula',
      headerName: t('Formula'),
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'inchi_key',
      headerName: 'InChI Key',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'bound_chains',
      headerName: t('Bound Chains'),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Unknown'}
          size="small"
          color="info"
          variant="outlined"
        />
      ),
    },
  ];

  const detailFields = [
    { key: 'pdb_id', label: 'PDB ID', type: 'text', required: true },
    { key: 'ligand_id', label: 'Ligand ID', type: 'text', required: true },
    { key: 'ligand_name', label: t('Ligand Name'), type: 'text', required: true },
    { key: 'chemical_formula', label: t('Chemical Formula'), type: 'text' },
    { key: 'inchi_key', label: 'InChI Key', type: 'text' },
    { key: 'bound_chains', label: t('Bound Chains'), type: 'text' },
  ];

  const plotConfigs = [
    {
      title: t('Molecular Weight Distribution'),
      generateData: (rows) => [
        {
          x: rows.map(row => row.molecular_weight).filter(Boolean),
          type: 'histogram',
          name: t('Molecular Weight'),
          marker: { color: '#9c27b0' },
          nbinsx: 20,
        }
      ],
      layout: {
        title: t('Ligand Molecular Weight Distribution'),
        xaxis: { title: t('Molecular Weight (Da)') },
        yaxis: { title: t('Count') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('Function Distribution'),
      generateData: (rows) => {
        const functions = rows.reduce((acc, row) => {
          const func = row.function || 'Unknown';
          acc[func] = (acc[func] || 0) + 1;
          return acc;
        }, {});

        return [
          {
            labels: Object.keys(functions),
            values: Object.values(functions),
            type: 'pie',
            marker: {
              colors: ['#f44336', '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#607d8b']
            },
          }
        ];
      },
      layout: {
        title: t('Ligand Function Distribution'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
    {
      title: t('Binding Affinity vs Molecular Weight'),
      generateData: (rows) => [
        {
          x: rows.map(row => row.molecular_weight).filter(Boolean),
          y: rows.map(row => row.binding_affinity).filter(Boolean),
          mode: 'markers',
          type: 'scatter',
          name: t('Ligands'),
          marker: { 
            color: '#9c27b0',
            size: 8,
            opacity: 0.7,
          },
          text: rows.map(row => `${row.ligand_id}: ${row.ligand_name}`),
          hovertemplate: '<b>%{text}</b><br>' +
                         'Mol. Weight: %{x:.2f} Da<br>' +
                         'Binding Affinity: %{y:.2f} μM<br>' +
                         '<extra></extra>',
        }
      ],
      layout: {
        title: t('Binding Affinity vs Molecular Weight'),
        xaxis: { title: t('Molecular Weight (Da)') },
        yaxis: { title: t('Binding Affinity (μM)'), type: 'log' },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('Drug Likeness Distribution'),
      generateData: (rows) => [
        {
          x: rows.map(row => row.drug_likeness).filter(Boolean),
          type: 'histogram',
          name: t('Drug Likeness'),
          marker: { color: '#4caf50' },
          nbinsx: 15,
        }
      ],
      layout: {
        title: t('Drug Likeness Score Distribution'),
        xaxis: { title: t('Drug Likeness Score') },
        yaxis: { title: t('Count') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
  ];

  const customDetailComponent = (selectedRow, editMode, editData, setEditData) => {
    if (!selectedRow && !editMode) return null;

    const data = editMode ? editData : selectedRow;

    return (
      <Box>
        {/* Basic ligand information */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 3 }}>
          {detailFields.map((field) => (
            <Box key={field.key}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {field.label}
              </Typography>
              {editMode ? (
                field.type === 'select' ? (
                  <select
                    value={data[field.key] || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">{t('Select...')}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={data[field.key] || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: field.multiline ? '80px' : 'auto'
                    }}
                    required={field.required}
                  />
                )
              ) : (
                <Typography variant="body1" sx={{ fontFamily: field.key === 'molecular_formula' ? 'monospace' : 'inherit' }}>
                  {data[field.key] || '-'}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Ligand-specific information */}
        {!editMode && selectedRow && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('Chemical Information')}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('ChEMBL Link')}
                </Typography>
                <Chip
                  label={`ChEMBL: ${selectedRow.ligand_id}`}
                  color="secondary"
                  onClick={() => window.open(`https://www.ebi.ac.uk/chembl/compound_report_card/${selectedRow.ligand_id}`, '_blank')}
                  clickable
                />
              </Box>
              {selectedRow.molecular_formula && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('Chemical Formula')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {selectedRow.molecular_formula}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <DataTableView
      title={t('Ligands')}
      columns={columns}
      apiService={ligandsAPI}
      primaryKey="ligand_id"
      detailFields={detailFields}
      plotConfigs={plotConfigs}
      canAdd={true}
      canEdit={true}
      canDelete={true}
      customDetailComponent={customDetailComponent}
    />
  );
};

export default LigandsPage;
