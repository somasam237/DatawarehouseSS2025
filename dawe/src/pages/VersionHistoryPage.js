// src/pages/VersionHistoryPage.js
import React from 'react';
import DataTableView from '../components/DataTableView';
import { versionHistoryAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Chip, Box, Typography, Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/material';

const VersionHistoryPage = () => {
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
      field: 'version',
      headerName: t('Version'),
      width: 100,
      renderCell: (params) => (
        <Chip label={`v${params.value}`} size="small" color="info" />
      ),
    },
    {
      field: 'release_date',
      headerName: t('Release Date'),
      width: 120,
      type: 'date',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
    {
      field: 'changes',
      headerName: t('Changes'),
      width: 300,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
  ];

  const detailFields = [
    { key: 'pdb_id', label: 'PDB ID', type: 'text', required: true },
    { key: 'version', label: t('Version'), type: 'text', required: true },
    { key: 'release_date', label: t('Release Date'), type: 'date', required: true },
    { key: 'changes', label: t('Changes'), type: 'text', multiline: true, required: true },
  ];

  const plotConfigs = [
    {
      title: t('Modification Type Distribution'),
      generateData: (rows) => {
        const types = rows.reduce((acc, row) => {
          if (row.modification_type) {
            acc[row.modification_type] = (acc[row.modification_type] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            labels: Object.keys(types),
            values: Object.values(types),
            type: 'pie',
            marker: {
              colors: ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#f44336', '#607d8b', '#795548']
            },
          }
        ];
      },
      layout: {
        title: t('Distribution of Modification Types'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
    {
      title: t('Modifications Over Time'),
      generateData: (rows) => {
        const monthlyData = rows.reduce((acc, row) => {
          if (row.modification_date) {
            const date = new Date(row.modification_date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            acc[monthYear] = (acc[monthYear] || 0) + 1;
          }
          return acc;
        }, {});

        const sortedData = Object.entries(monthlyData).sort(([a], [b]) => a.localeCompare(b));

        return [
          {
            x: sortedData.map(([date]) => date),
            y: sortedData.map(([, count]) => count),
            type: 'scatter',
            mode: 'lines+markers',
            name: t('Modifications'),
            line: { color: '#1976d2', width: 2 },
            marker: { size: 6 },
          }
        ];
      },
      layout: {
        title: t('Modification Activity Over Time'),
        xaxis: { title: t('Date (Year-Month)') },
        yaxis: { title: t('Number of Modifications') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('Impact Level Distribution'),
      generateData: (rows) => {
        const impacts = rows.reduce((acc, row) => {
          if (row.impact_level) {
            acc[row.impact_level] = (acc[row.impact_level] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            x: Object.keys(impacts),
            y: Object.values(impacts),
            type: 'bar',
            marker: {
              color: ['#4caf50', '#ff9800', '#f44336', '#9c27b0']
            },
          }
        ];
      },
      layout: {
        title: t('Impact Level of Modifications'),
        xaxis: { title: t('Impact Level') },
        yaxis: { title: t('Count') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('Version Status Overview'),
      generateData: (rows) => {
        const statuses = rows.reduce((acc, row) => {
          if (row.status) {
            acc[row.status] = (acc[row.status] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            labels: Object.keys(statuses),
            values: Object.values(statuses),
            type: 'pie',
            marker: {
              colors: ['#4caf50', '#ff9800', '#f44336', '#2196f3']
            },
          }
        ];
      },
      layout: {
        title: t('Version Status Distribution'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
  ];

  const customDetailComponent = (selectedRow, editMode, editData, setEditData) => {
    if (!selectedRow && !editMode) return null;

    const data = editMode ? editData : selectedRow;

    return (
      <Box>
        {/* Basic Version Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('Version Information')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {detailFields.slice(0, 12).map((field) => (
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
                    {field.key === 'quality_score' && data[field.key] ? 
                      `${data[field.key]}/100` :
                      field.key === 'file_size_change' && data[field.key] ? 
                      `${data[field.key] > 0 ? '+' : ''}${data[field.key]}%` :
                      (data[field.key] || '-')
                    }
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Technical Changes */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('Technical Changes')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {detailFields.slice(12).map((field) => (
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
                      minHeight: '80px'
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

        {/* Version Timeline (only in view mode) */}
        {!editMode && selectedRow && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('Version Timeline')}
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                {t('Current Version')}: v{selectedRow.version_number}
              </Typography>
              {selectedRow.previous_version && (
                <Typography variant="body2" color="text.secondary">
                  {t('Previous Version')}: v{selectedRow.previous_version}
                </Typography>
              )}
              {selectedRow.next_version && (
                <Typography variant="body2" color="text.secondary">
                  {t('Next Version')}: v{selectedRow.next_version}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* External Links */}
        {!editMode && selectedRow && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('External Links')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`PDB: ${selectedRow.pdb_id}`}
                color="primary"
                clickable
                onClick={() => window.open(`https://www.rcsb.org/structure/${selectedRow.pdb_id}`, '_blank')}
              />
              <Chip
                label={`Version: ${selectedRow.version_number}`}
                color="info"
                variant="outlined"
              />
              <Chip
                label={selectedRow.status}
                color={
                  selectedRow.status === 'Active' ? 'success' :
                  selectedRow.status === 'Superseded' ? 'warning' :
                  selectedRow.status === 'Obsolete' ? 'error' : 'default'
                }
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <DataTableView
      title={t('Version History')}
      columns={columns}
      apiService={versionHistoryAPI}
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

export default VersionHistoryPage;
