// src/pages/SoftwareUsedPage.js
import React from 'react';
import DataTableView from '../components/DataTableView';
import { softwareUsedAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Chip, Box, Typography } from '@mui/material';

const SoftwareUsedPage = () => {
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
      field: 'software_name',
      headerName: t('Software Name'),
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'software_purpose',
      headerName: t('Purpose'),
      width: 200,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Unknown'}
          size="small"
          color={
            params.value === 'Data Collection' ? 'success' :
            params.value === 'Data Processing' ? 'info' :
            params.value === 'Structure Solution' ? 'warning' :
            params.value === 'Refinement' ? 'error' :
            params.value === 'Visualization' ? 'secondary' : 'default'
          }
        />
      ),
    },
  ];

  const detailFields = [
    { key: 'pdb_id', label: 'PDB ID', type: 'text', required: true },
    { key: 'software_name', label: t('Software Name'), type: 'text', required: true },
    { key: 'software_purpose', label: t('Software Purpose'), type: 'text', required: true },
  ];

  const plotConfigs = [
    {
      title: t('Software Type Distribution'),
      generateData: (rows) => {
        const types = rows.reduce((acc, row) => {
          if (row.software_type) {
            acc[row.software_type] = (acc[row.software_type] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            labels: Object.keys(types),
            values: Object.values(types),
            type: 'pie',
            marker: {
              colors: ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#607d8b', '#795548', '#009688']
            },
          }
        ];
      },
      layout: {
        title: t('Distribution of Software Types'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
    {
      title: t('Popular Software Tools'),
      generateData: (rows) => {
        const software = rows.reduce((acc, row) => {
          if (row.software_name) {
            acc[row.software_name] = (acc[row.software_name] || 0) + 1;
          }
          return acc;
        }, {});

        // Get top 15 most used software
        const sortedSoftware = Object.entries(software)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 15);

        return [
          {
            x: sortedSoftware.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name),
            y: sortedSoftware.map(([, count]) => count),
            type: 'bar',
            marker: { color: '#1976d2' },
          }
        ];
      },
      layout: {
        title: t('Most Popular Software Tools'),
        xaxis: { title: t('Software Name') },
        yaxis: { title: t('Usage Count') },
        margin: { t: 30, b: 100, l: 50, r: 20 },
      }
    },
    {
      title: t('License Type Distribution'),
      generateData: (rows) => {
        const licenses = rows.reduce((acc, row) => {
          if (row.license_type) {
            acc[row.license_type] = (acc[row.license_type] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            x: Object.keys(licenses),
            y: Object.values(licenses),
            type: 'bar',
            marker: { color: '#4caf50' },
          }
        ];
      },
      layout: {
        title: t('Software License Distribution'),
        xaxis: { title: t('License Type') },
        yaxis: { title: t('Count') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('Operating System Support'),
      generateData: (rows) => {
        const os = rows.reduce((acc, row) => {
          if (row.operating_system) {
            acc[row.operating_system] = (acc[row.operating_system] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            labels: Object.keys(os),
            values: Object.values(os),
            type: 'pie',
            marker: {
              colors: ['#ff9800', '#2196f3', '#4caf50', '#9c27b0', '#607d8b']
            },
          }
        ];
      },
      layout: {
        title: t('Operating System Support'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
  ];

  const customDetailComponent = (selectedRow, editMode, editData, setEditData) => {
    if (!selectedRow && !editMode) return null;

    const data = editMode ? editData : selectedRow;

    return (
      <Box>
        {/* Basic Software Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('Software Information')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {detailFields.slice(0, 10).map((field) => (
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
                  <Typography variant="body1">
                    {field.key === 'website_url' && data[field.key] ? (
                      <a href={data[field.key]} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                        {data[field.key]}
                      </a>
                    ) : (
                      data[field.key] || '-'
                    )}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Technical Details */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('Technical Details')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {detailFields.slice(10).map((field) => (
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
                  <Typography variant="body1" sx={{ fontFamily: field.key === 'doi' ? 'monospace' : 'inherit' }}>
                    {field.key === 'doi' && data[field.key] ? (
                      <a href={`https://doi.org/${data[field.key]}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                        {data[field.key]}
                      </a>
                    ) : (
                      data[field.key] || '-'
                    )}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* External Links */}
        {!editMode && selectedRow && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('External Links')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {selectedRow.website_url && (
                <Chip
                  label={t('Website')}
                  color="info"
                  clickable
                  onClick={() => window.open(selectedRow.website_url, '_blank')}
                />
              )}
              {selectedRow.doi && (
                <Chip
                  label={`DOI: ${selectedRow.doi}`}
                  color="secondary"
                  clickable
                  onClick={() => window.open(`https://doi.org/${selectedRow.doi}`, '_blank')}
                />
              )}
              <Chip
                label={`PDB: ${selectedRow.pdb_id}`}
                color="primary"
                clickable
                onClick={() => window.open(`https://www.rcsb.org/structure/${selectedRow.pdb_id}`, '_blank')}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <DataTableView
      title={t('Software Used')}
      columns={columns}
      apiService={softwareUsedAPI}
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

export default SoftwareUsedPage;
