// src/pages/MacromoleculesPage.js
import React from 'react';
import DataTableView from '../components/DataTableView';
import { macromoleculeAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Chip, Box, Typography } from '@mui/material';

const MacromoleculesPage = () => {
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
      field: 'entity_id',
      headerName: t('Entity ID'),
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="secondary" />
      ),
    },
    {
      field: 'molecule_name',
      headerName: t('Molecule Name'),
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'chain_ids',
      headerName: t('Chain IDs'),
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value || '-'} size="small" color="info" variant="outlined" />
      ),
    },
    {
      field: 'sequence_length',
      headerName: t('Sequence Length'),
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value} aa` : '-'}
        </Typography>
      ),
    },
    {
      field: 'organism',
      headerName: t('Organism'),
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'uniprot_id',
      headerName: 'UniProt ID',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value || '-'} 
          size="small" 
          color="success" 
          variant="outlined"
          clickable={!!params.value}
          onClick={() => params.value && window.open(`https://www.uniprot.org/uniprot/${params.value}`, '_blank')}
        />
      ),
    },
  ];

  const detailFields = [
    { key: 'pdb_id', label: 'PDB ID', type: 'text', required: true },
    { key: 'entity_id', label: t('Entity ID'), type: 'number', required: true },
    { key: 'molecule_name', label: t('Molecule Name'), type: 'text', required: true },
    { key: 'chain_ids', label: t('Chain IDs'), type: 'text' },
    { key: 'sequence_length', label: t('Sequence Length'), type: 'number' },
    { key: 'organism', label: t('Organism'), type: 'text' },
    { key: 'mutations', label: t('Mutations'), type: 'text' },
    { key: 'ec_number', label: 'EC Number', type: 'text' },
    { key: 'uniprot_id', label: 'UniProt ID', type: 'text' },
  ];

  const plotConfigs = [
    {
      title: t('Macromolecule Type Distribution'),
      generateData: (rows) => {
        const types = rows.reduce((acc, row) => {
          if (row.macromolecule_type) {
            acc[row.macromolecule_type] = (acc[row.macromolecule_type] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            labels: Object.keys(types),
            values: Object.values(types),
            type: 'pie',
            marker: {
              colors: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0']
            },
          }
        ];
      },
      layout: {
        title: t('Distribution of Macromolecule Types'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
    {
      title: t('Sequence Length Distribution'),
      generateData: (rows) => [
        {
          x: rows.map(row => row.sequence_length).filter(Boolean),
          type: 'histogram',
          name: t('Sequence Length'),
          marker: { color: '#1976d2' },
          nbinsx: 20,
        }
      ],
      layout: {
        title: t('Distribution of Sequence Lengths'),
        xaxis: { title: t('Sequence Length (residues)') },
        yaxis: { title: t('Count') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('Molecular Weight vs Sequence Length'),
      generateData: (rows) => {
        const proteinData = rows.filter(row => row.macromolecule_type === 'protein');
        const nucleicData = rows.filter(row => row.macromolecule_type === 'nucleic_acid');
        const hybridData = rows.filter(row => row.macromolecule_type === 'hybrid');

        return [
          {
            x: proteinData.map(row => row.sequence_length).filter(Boolean),
            y: proteinData.map(row => row.molecular_weight).filter(Boolean),
            mode: 'markers',
            type: 'scatter',
            name: t('Proteins'),
            marker: { color: '#4caf50', size: 6 },
          },
          {
            x: nucleicData.map(row => row.sequence_length).filter(Boolean),
            y: nucleicData.map(row => row.molecular_weight).filter(Boolean),
            mode: 'markers',
            type: 'scatter',
            name: t('Nucleic Acids'),
            marker: { color: '#2196f3', size: 6 },
          },
          {
            x: hybridData.map(row => row.sequence_length).filter(Boolean),
            y: hybridData.map(row => row.molecular_weight).filter(Boolean),
            mode: 'markers',
            type: 'scatter',
            name: t('Hybrids'),
            marker: { color: '#ff9800', size: 6 },
          }
        ];
      },
      layout: {
        title: t('Molecular Weight vs Sequence Length'),
        xaxis: { title: t('Sequence Length') },
        yaxis: { title: t('Molecular Weight (Da)') },
        margin: { t: 30, b: 40, l: 60, r: 20 },
      }
    },
    {
      title: t('Chain Distribution per PDB'),
      generateData: (rows) => {
        const pdbCounts = rows.reduce((acc, row) => {
          acc[row.pdb_id] = (acc[row.pdb_id] || 0) + 1;
          return acc;
        }, {});

        const chainCounts = Object.values(pdbCounts).reduce((acc, count) => {
          acc[count] = (acc[count] || 0) + 1;
          return acc;
        }, {});

        return [
          {
            x: Object.keys(chainCounts).map(Number),
            y: Object.values(chainCounts),
            type: 'bar',
            name: t('PDB Entries'),
            marker: { color: '#673ab7' },
          }
        ];
      },
      layout: {
        title: t('Number of Chains per PDB Entry'),
        xaxis: { title: t('Number of Chains') },
        yaxis: { title: t('Number of PDB Entries') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
  ];

  const customDetailComponent = (selectedRow, editMode, editData, setEditData) => {
    if (!selectedRow && !editMode) return null;

    const data = editMode ? editData : selectedRow;

    return (
      <Box>
        {/* Basic macromolecule information */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 3 }}>
          {detailFields.slice(0, 8).map((field) => (
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
                  <textarea
                    value={data[field.key] || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: field.multiline ? '80px' : '40px',
                      fontFamily: field.key === 'sequence' ? 'monospace' : 'inherit'
                    }}
                    required={field.required}
                  />
                )
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: field.key === 'sequence' ? 'monospace' : 'inherit',
                    fontSize: field.key === 'sequence' ? '0.875rem' : 'inherit',
                    wordBreak: field.key === 'sequence' ? 'break-all' : 'normal'
                  }}
                >
                  {field.key === 'sequence' && data[field.key] && data[field.key].length > 100 ? 
                    `${data[field.key].substring(0, 100)}...` : 
                    (data[field.key] || '-')
                  }
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Structural information */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('Structural Information')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {detailFields.slice(8).map((field) => (
              <Box key={field.key}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {field.label}
                </Typography>
                {editMode ? (
                  <textarea
                    value={data[field.key] || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: field.multiline ? '80px' : '40px'
                    }}
                  />
                ) : (
                  <Typography variant="body1">
                    {data[field.key] || '-'}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <DataTableView
      title={t('Macromolecules')}
      columns={columns}
      apiService={macromoleculeAPI}
      primaryKey="id"
      detailFields={detailFields}
      plotConfigs={plotConfigs}
      canAdd={true}
      canEdit={true}
      canDelete={true}
      customDetailComponent={customDetailComponent}
    />
  );
};

export default MacromoleculesPage;
