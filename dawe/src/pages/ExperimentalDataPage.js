// src/pages/ExperimentalDataPage.js
import React from 'react';
import DataTableView from '../components/DataTableView';
import { experimentalDataAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Chip, Box, Typography } from '@mui/material';

const ExperimentalDataPage = () => {
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
      field: 'method',
      headerName: t('Method'),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'X-RAY DIFFRACTION' ? 'success' : 
                 params.value === 'SOLUTION NMR' ? 'info' : 
                 params.value === 'ELECTRON MICROSCOPY' ? 'warning' : 'default'}
        />
      ),
    },
    {
      field: 'resolution_A',
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
      field: 'r_value_free_depositor',
      headerName: 'R-free',
      width: 100,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? params.value.toFixed(3) : '-'}
        </Typography>
      ),
    },
    {
      field: 'r_value_work_depositor',
      headerName: 'R-work',
      width: 100,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? params.value.toFixed(3) : '-'}
        </Typography>
      ),
    },
    {
      field: 'r_value_observed',
      headerName: 'R-observed',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? params.value.toFixed(3) : '-'}
        </Typography>
      ),
    },
    {
      field: 'space_group',
      headerName: t('Space Group'),
      width: 120,
    },
    {
      field: 'unit_cell_a',
      headerName: 'Unit Cell a (Å)',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value.toFixed(2)} Å` : '-'}
        </Typography>
      ),
    },
    {
      field: 'unit_cell_b',
      headerName: 'Unit Cell b (Å)',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value.toFixed(2)} Å` : '-'}
        </Typography>
      ),
    },
    {
      field: 'unit_cell_c',
      headerName: 'Unit Cell c (Å)',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value.toFixed(2)} Å` : '-'}
        </Typography>
      ),
    },
  ];

  const detailFields = [
    { key: 'pdb_id', label: 'PDB ID', type: 'text', required: true },
    { key: 'method', label: t('Method'), type: 'text', required: true },
    { key: 'resolution_A', label: t('Resolution (Å)'), type: 'number' },
    { key: 'r_value_free_depositor', label: 'R-free', type: 'number' },
    { key: 'r_value_free_dcc', label: 'R-free DCC', type: 'number' },
    { key: 'r_value_work_depositor', label: 'R-work', type: 'number' },
    { key: 'r_value_work_dcc', label: 'R-work DCC', type: 'number' },
    { key: 'r_value_observed', label: 'R-observed', type: 'number' },
    { key: 'space_group', label: t('Space Group'), type: 'text' },
    { key: 'unit_cell_a', label: 'Unit Cell a (Å)', type: 'number' },
    { key: 'unit_cell_b', label: 'Unit Cell b (Å)', type: 'number' },
    { key: 'unit_cell_c', label: 'Unit Cell c (Å)', type: 'number' },
    { key: 'unit_cell_alpha', label: 'Unit Cell α (°)', type: 'number' },
    { key: 'unit_cell_beta', label: 'Unit Cell β (°)', type: 'number' },
    { key: 'unit_cell_gamma', label: 'Unit Cell γ (°)', type: 'number' },
  ];

  const plotConfigs = [
    {
      title: t('Experiment Type Distribution'),
      generateData: (rows) => {
        const types = rows.reduce((acc, row) => {
          if (row.experiment_type) {
            acc[row.experiment_type] = (acc[row.experiment_type] || 0) + 1;
          }
          return acc;
        }, {});

        return [
          {
            labels: Object.keys(types),
            values: Object.values(types),
            type: 'pie',
            marker: {
              colors: ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0']
            },
          }
        ];
      },
      layout: {
        title: t('Distribution of Experiment Types'),
        margin: { t: 30, b: 20, l: 20, r: 20 },
      }
    },
    {
      title: t('Resolution Distribution'),
      generateData: (rows) => [
        {
          x: rows.map(row => row.resolution).filter(Boolean),
          type: 'histogram',
          name: t('Resolution'),
          marker: { color: '#4caf50' },
          nbinsx: 20,
        }
      ],
      layout: {
        title: t('Resolution Distribution'),
        xaxis: { title: t('Resolution (Å)') },
        yaxis: { title: t('Count') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('R-factor vs Resolution'),
      generateData: (rows) => [
        {
          x: rows.map(row => row.resolution).filter(Boolean),
          y: rows.map(row => row.r_factor).filter(Boolean),
          mode: 'markers',
          type: 'scatter',
          name: t('Experiments'),
          marker: { 
            color: '#ff9800',
            size: 8,
            opacity: 0.7,
          },
          text: rows.map(row => `${row.pdb_id}: ${row.experiment_type}`),
          hovertemplate: '<b>%{text}</b><br>' +
                         'Resolution: %{x:.2f} Å<br>' +
                         'R-factor: %{y:.3f}<br>' +
                         '<extra></extra>',
        }
      ],
      layout: {
        title: t('R-factor vs Resolution'),
        xaxis: { title: t('Resolution (Å)') },
        yaxis: { title: t('R-factor') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
    {
      title: t('Temperature Distribution'),
      generateData: (rows) => [
        {
          x: rows.map(row => row.temperature).filter(Boolean),
          type: 'histogram',
          name: t('Temperature'),
          marker: { color: '#f44336' },
          nbinsx: 15,
        }
      ],
      layout: {
        title: t('Temperature Distribution'),
        xaxis: { title: t('Temperature (K)') },
        yaxis: { title: t('Count') },
        margin: { t: 30, b: 40, l: 50, r: 20 },
      }
    },
  ];

  return (
    <DataTableView
      title={t('Experimental Data')}
      columns={columns}
      apiService={experimentalDataAPI}
      primaryKey="pdb_id"
      detailFields={detailFields}
      plotConfigs={plotConfigs}
      canAdd={true}
      canEdit={true}
      canDelete={true}
    />
  );
};

export default ExperimentalDataPage;
