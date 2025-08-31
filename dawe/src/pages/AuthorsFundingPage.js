// src/pages/AuthorsFundingPage.js
import React from 'react';
import DataTableView from '../components/DataTableView';
import { authorsFundingAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Chip, Box, Typography } from '@mui/material';

const AuthorsFundingPage = () => {
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
      field: 'author_names',
      headerName: t('Author Names'),
      width: 250,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'funding_org',
      headerName: t('Funding Organization'),
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'funding_location',
      headerName: t('Funding Location'),
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value || '-'} size="small" color="info" />
      ),
    },
    {
      field: 'grant_number',
      headerName: t('Grant Number'),
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
  ];

  const detailFields = [
    { key: 'pdb_id', label: 'PDB ID', type: 'text', required: true },
    { key: 'author_names', label: t('Author Names'), type: 'text', required: true },
    { key: 'funding_org', label: t('Funding Organization'), type: 'text' },
    { key: 'funding_location', label: t('Funding Location'), type: 'text' },
    { key: 'grant_number', label: t('Grant Number'), type: 'text' },
  ];

  const plotConfigs = [
    {
      title: t('Country Distribution'),
      generateData: (rows) => {
        const countries = rows.reduce((acc, row) => {
          if (row.country) {
            acc[row.country] = (acc[row.country] || 0) + 1;
          }
          return acc;
        }, {});

        // Get top 10 countries
        const sortedCountries = Object.entries(countries)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10);

        return [
          {
            labels: sortedCountries.map(([country]) => country),
            values: sortedCountries.map(([, count]) => count),
            type: 'pie',
            marker: {
              colors: ['#1976d2', '#dc004e', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50']
            },
          }
        ];
      },
      layout: {
        title: t('Top 10 Countries by Author Count'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
    {
      title: t('Funding Distribution'),
      generateData: (rows) => {
        const agencies = rows.reduce((acc, row) => {
          if (row.funding_agency) {
            acc[row.funding_agency] = (acc[row.funding_agency] || 0) + 1;
          }
          return acc;
        }, {});

        // Get top 8 funding agencies
        const sortedAgencies = Object.entries(agencies)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 8);

        return [
          {
            x: sortedAgencies.map(([agency]) => agency.length > 20 ? agency.substring(0, 20) + '...' : agency),
            y: sortedAgencies.map(([, count]) => count),
            type: 'bar',
            marker: { color: '#4caf50' },
          }
        ];
      },
      layout: {
        title: t('Top Funding Agencies'),
        xaxis: { title: t('Funding Agency') },
        yaxis: { title: t('Number of Grants') },
        margin: { t: 30, b: 80, l: 50, r: 20 },
      }
    },
    {
      title: t('Research Field Distribution'),
      generateData: (rows) => {
        const fields = rows.reduce((acc, row) => {
          if (row.research_field) {
            acc[row.research_field] = (acc[row.research_field] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            labels: Object.keys(fields),
            values: Object.values(fields),
            type: 'pie',
            marker: {
              colors: ['#ff9800', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4']
            },
          }
        ];
      },
      layout: {
        title: t('Research Field Distribution'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
    {
      title: t('Collaboration Network'),
      generateData: (rows) => {
        const collaborations = rows.reduce((acc, row) => {
          if (row.collaboration_type) {
            acc[row.collaboration_type] = (acc[row.collaboration_type] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            x: Object.keys(collaborations),
            y: Object.values(collaborations),
            type: 'bar',
            marker: { color: '#9c27b0' },
          }
        ];
      },
      layout: {
        title: t('Collaboration Types'),
        xaxis: { title: t('Collaboration Type') },
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
        {/* Author Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('Author Information')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {detailFields.slice(0, 9).map((field) => (
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
                      fontSize: '14px'
                    }}
                    required={field.required}
                  />
                ) : (
                  <Typography variant="body1">
                    {field.key === 'email' && data[field.key] ? (
                      <a href={`mailto:${data[field.key]}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
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

        {/* Funding Information */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('Funding Information')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {detailFields.slice(9).map((field) => (
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
                    />
                  )
                ) : (
                  <Typography variant="body1">
                    {field.key === 'funding_amount' && data[field.key] ? 
                      `${data[field.key].toLocaleString()} ${data.funding_currency || ''}` :
                      (data[field.key] || '-')
                    }
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
              {selectedRow.orcid_id && (
                <Chip
                  label={`ORCID: ${selectedRow.orcid_id}`}
                  color="success"
                  clickable
                  onClick={() => window.open(`https://orcid.org/${selectedRow.orcid_id}`, '_blank')}
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
      title={t('Authors & Funding')}
      columns={columns}
      apiService={authorsFundingAPI}
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

export default AuthorsFundingPage;
