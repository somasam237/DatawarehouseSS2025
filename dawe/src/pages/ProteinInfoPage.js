// src/pages/ProteinInfoPage.js
import React from 'react';
import DataTableView from '../components/DataTableView';
import { proteinInfoAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Chip, Box, Typography } from '@mui/material';

const ProteinInfoPage = () => {
  const { t } = useTranslation();

  const buildRcsbImageUrlNested = (pdbId) => {
    if (!pdbId) return '';
    const idLower = pdbId.toLowerCase();
    if (idLower.length === 4) {
      const firstTwo = idLower.substring(0, 2);
      return `https://cdn.rcsb.org/images/structures/${firstTwo}/${idLower}/${idLower}.png`;
    }
    return `https://cdn.rcsb.org/images/structures/${idLower}.png`;
  };

  const buildRcsbImageUrlFlat = (pdbId) => {
    if (!pdbId) return '';
    const idLower = pdbId.toLowerCase();
    return `https://cdn.rcsb.org/images/structures/${idLower}.png`;
  };

  // Column configuration for DataGrid
  const columns = [
    {
      field: 'pdb_id',
      headerName: 'PDB ID',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'title',
      headerName: t('Protein Name'),
      width: 300,
      flex: 1,
      renderCell: (params) => {
        const imageUrl = params.row?.image_url || buildRcsbImageUrlNested(params.row?.pdb_id);
        const name = params.value || params.row?.pdb_id;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={params.row?.pdb_id}
                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                loading="lazy"
                onError={(e) => {
                  const alt = buildRcsbImageUrlFlat(params.row?.pdb_id);
                  if (e.currentTarget.src !== alt) {
                    e.currentTarget.src = alt;
                  }
                }}
              />
            ) : null}
            <Typography variant="body2" noWrap title={name}>
              {name}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'organism',
      headerName: t('Organism'),
      width: 180,
    },
    {
      field: 'length',
      headerName: t('Length'),
      width: 100,
      type: 'number',
    },
    {
      field: 'resolution',
      headerName: t('Resolution (Å)'),
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value} Å` : '-'}
        </Typography>
      ),
    },
    {
      field: 'molecular_weight',
      headerName: t('Mol. Weight (Da)'),
      width: 140,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value.toLocaleString()} Da` : '-'}
        </Typography>
      ),
    },
    {
      field: 'classification',
      headerName: t('Classification'),
      width: 150,
    },
    {
      field: 'created_at',
      headerName: t('Created'),
      width: 120,
      type: 'date',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
  ];

  // Detail fields configuration
  const detailFields = [
    {
      key: 'pdb_id',
      label: 'PDB ID',
      type: 'text',
      required: true,
    },
    {
      key: 'title',
      label: t('Protein Name'),
      type: 'text',
      required: true,
    },
    {
      key: 'organism',
      label: t('Organism'),
      type: 'text',
      required: true,
    },
    {
      key: 'length',
      label: t('Length (residues)'),
      type: 'number',
      required: true,
    },
    {
      key: 'resolution',
      label: t('Resolution (Å)'),
      type: 'number',
    },
    {
      key: 'molecular_weight',
      label: t('Molecular Weight (Da)'),
      type: 'number',
    },
    {
      key: 'classification',
      label: t('Classification'),
      type: 'text',
    },
    {
      key: 'keywords',
      label: t('Keywords'),
      type: 'text',
      multiline: true,
    },
    {
      key: 'description',
      label: t('Description'),
      type: 'text',
      multiline: true,
    },
    {
      key: 'ec_number',
      label: t('EC Number'),
      type: 'text',
    },
    {
      key: 'go_terms',
      label: t('GO Terms'),
      type: 'text',
      multiline: true,
    },
    {
      key: 'domain_architecture',
      label: t('Domain Architecture'),
      type: 'text',
      multiline: true,
    },
  ];

  // Plot configurations
  const plotConfigs = [
    {
      title: t('Length Distribution'),
      generateData: (rows) => [
        {
          x: rows.map(row => row.length).filter(Boolean),
          type: 'histogram',
          name: t('Protein Length'),
          marker: { color: '#1976d2' },
          nbinsx: 20,
        }
      ],
      layout: {
        title: t('Distribution of Protein Lengths'),
        xaxis: { title: t('Length (residues)') },
        yaxis: { title: t('Count') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('Molecular Weight vs Resolution'),
      generateData: (rows) => [
        {
          x: rows.map(row => row.molecular_weight).filter(Boolean),
          y: rows.map(row => row.resolution).filter(Boolean),
          mode: 'markers',
          type: 'scatter',
          name: t('Proteins'),
          marker: { 
            color: '#1976d2',
            size: 8,
            opacity: 0.7,
          },
          text: rows.map(row => `${row.pdb_id}: ${row.title}`),
          hovertemplate: '<b>%{text}</b><br>' +
                         'Mol. Weight: %{x:.0f} Da<br>' +
                         'Resolution: %{y:.2f} Å<br>' +
                         '<extra></extra>',
        }
      ],
      layout: {
        title: t('Molecular Weight vs Resolution'),
        xaxis: { title: t('Molecular Weight (Da)') },
        yaxis: { title: t('Resolution (Å)') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('Classification Distribution'),
      generateData: (rows) => {
        const classifications = rows.reduce((acc, row) => {
          if (row.classification) {
            acc[row.classification] = (acc[row.classification] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            labels: Object.keys(classifications),
            values: Object.values(classifications),
            type: 'pie',
            name: t('Classifications'),
            marker: {
              colors: ['#1976d2', '#dc004e', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4']
            },
          }
        ];
      },
      layout: {
        title: t('Protein Classification Distribution'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
    {
      title: t('Resolution Quality Analysis'),
      generateData: (rows) => {
        const resolutions = rows.map(row => row.resolution).filter(Boolean).sort((a, b) => a - b);
        
        return [
          {
            x: resolutions,
            type: 'histogram',
            name: t('Resolution Distribution'),
            marker: { color: '#4caf50' },
            nbinsx: 15,
          }
        ];
      },
      layout: {
        title: t('Resolution Quality Distribution'),
        xaxis: { title: t('Resolution (Å)') },
        yaxis: { title: t('Count') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
        annotations: [
          {
            text: t('Better resolution →'),
            x: 0.1,
            y: 0.9,
            xref: 'paper',
            yref: 'paper',
            showarrow: true,
            arrowhead: 2,
            ax: 30,
            ay: 0
          }
        ]
      }
    },
  ];

  // Custom detail component for rich protein information display
  const customDetailComponent = (selectedRow, editMode, editData, setEditData) => {
    if (!selectedRow && !editMode) return null;

    const data = editMode ? editData : selectedRow;

    return (
      <Box>
        {/* Basic protein information in a grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 3 }}>
          {detailFields.map((field) => (
            <Box key={field.key}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {field.label}
              </Typography>
              {editMode ? (
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
              ) : (
                <Typography variant="body1">
                  {data[field.key] || '-'}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Additional protein-specific information */}
        {!editMode && selectedRow && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('Additional Information')}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('PDB Entry')}
                </Typography>
                <Chip
                  label={selectedRow.pdb_id}
                  color="primary"
                  onClick={() => window.open(`https://www.rcsb.org/structure/${selectedRow.pdb_id}`, '_blank')}
                  clickable
                />
              </Box>
              {selectedRow.resolution && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('Resolution Quality')}
                  </Typography>
                  <Chip
                    label={`${selectedRow.resolution} Å`}
                    color={selectedRow.resolution < 2.0 ? 'success' : selectedRow.resolution < 3.0 ? 'warning' : 'default'}
                  />
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
      title={t('Protein Information')}
      columns={columns}
      apiService={proteinInfoAPI}
      primaryKey="pdb_id"
      detailFields={detailFields}
      plotConfigs={plotConfigs}
      canAdd={true}
      canEdit={true}
      canDelete={true}
      customDetailComponent={customDetailComponent}
    />
  );
};

export default ProteinInfoPage;
