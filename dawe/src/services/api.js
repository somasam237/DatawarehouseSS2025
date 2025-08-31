// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API service for the new 7-table schema
export const proteinInfoAPI = {
  getAll: (params = {}) => apiClient.get('/protein-info', { params }),
  getById: (id) => apiClient.get(`/protein-info/${id}`),
  getStatistics: () => apiClient.get('/protein-info/statistics'),
  search: (query, params = {}) => apiClient.get('/protein-info/search', { params: { q: query, ...params } }),
  advancedSearch: (criteria, params = {}) => apiClient.post('/protein-info/advanced-search', { criteria, ...params }),
  create: (data) => apiClient.post('/protein-info', data),
  update: (id, data) => apiClient.put(`/protein-info/${id}`, data),
  delete: (id) => apiClient.delete(`/protein-info/${id}`),
};

export const authorsFundingAPI = {
  getAll: (params = {}) => apiClient.get('/authors-funding', { params }),
  getById: (id) => apiClient.get(`/authors-funding/${id}`),
  getByPdbId: (pdbId) => apiClient.get(`/authors-funding/pdb/${pdbId}`),
  getStatistics: () => apiClient.get('/authors-funding/statistics'),
  getTopFunding: (params = {}) => apiClient.get('/authors-funding/top-funding', { params }),
  create: (data) => apiClient.post('/authors-funding', data),
  update: (id, data) => apiClient.put(`/authors-funding/${id}`, data),
  delete: (id) => apiClient.delete(`/authors-funding/${id}`),
};

export const experimentalDataAPI = {
  getAll: (params = {}) => apiClient.get('/experimental-data', { params }),
  getByPdbId: (pdbId) => apiClient.get(`/experimental-data/pdb/${pdbId}`),
  getByMethod: (method, params = {}) => apiClient.get(`/experimental-data/method/${method}`, { params }),
  getByResolutionRange: (minRes, maxRes, params = {}) => apiClient.get('/experimental-data/resolution-range', { params: { minRes, maxRes, ...params } }),
  getStatistics: () => apiClient.get('/experimental-data/statistics'),
  getMethodDistribution: () => apiClient.get('/experimental-data/method-distribution'),
  create: (data) => apiClient.post('/experimental-data', data),
  update: (pdbId, data) => apiClient.put(`/experimental-data/${pdbId}`, data),
  delete: (pdbId) => apiClient.delete(`/experimental-data/${pdbId}`),
};

export const macromoleculeAPI = {
  getAll: (params = {}) => apiClient.get('/macromolecules', { params }),
  getById: (id) => apiClient.get(`/macromolecules/${id}`),
  getByPdbId: (pdbId) => apiClient.get(`/macromolecules/pdb/${pdbId}`),
  getByEntityId: (entityId, params = {}) => apiClient.get(`/macromolecules/entity/${entityId}`, { params }),
  searchByMoleculeName: (name, params = {}) => apiClient.get('/macromolecules/search/molecule-name', { params: { name, ...params } }),
  getStatistics: () => apiClient.get('/macromolecules/statistics'),
  create: (data) => apiClient.post('/macromolecules', data),
  update: (id, data) => apiClient.put(`/macromolecules/${id}`, data),
  delete: (id) => apiClient.delete(`/macromolecules/${id}`),
};

export const ligandsAPI = {
  getAll: (params = {}) => apiClient.get('/ligands-new', { params }),
  getById: (id) => apiClient.get(`/ligands-new/${id}`),
  getByPdbId: (pdbId) => apiClient.get(`/ligands-new/pdb/${pdbId}`),
  getByLigandId: (ligandId, params = {}) => apiClient.get(`/ligands-new/ligand/${ligandId}`, { params }),
  searchByName: (name, params = {}) => apiClient.get('/ligands-new/search/name', { params: { name, ...params } }),
  getStatistics: () => apiClient.get('/ligands-new/statistics'),
  create: (data) => apiClient.post('/ligands-new', data),
  update: (id, data) => apiClient.put(`/ligands-new/${id}`, data),
  delete: (id) => apiClient.delete(`/ligands-new/${id}`),
};

export const softwareUsedAPI = {
  getAll: (params = {}) => apiClient.get('/software-used', { params }),
  getById: (id) => apiClient.get(`/software-used/${id}`),
  getByPdbId: (pdbId) => apiClient.get(`/software-used/pdb/${pdbId}`),
  searchByName: (name, params = {}) => apiClient.get('/software-used/search/name', { params: { name, ...params } }),
  getStatistics: () => apiClient.get('/software-used/statistics'),
  getTopSoftware: (params = {}) => apiClient.get('/software-used/top-software', { params }),
  create: (data) => apiClient.post('/software-used', data),
  update: (id, data) => apiClient.put(`/software-used/${id}`, data),
  delete: (id) => apiClient.delete(`/software-used/${id}`),
};

export const versionHistoryAPI = {
  getAll: (params = {}) => apiClient.get('/version-history', { params }),
  getById: (id) => apiClient.get(`/version-history/${id}`),
  getByPdbId: (pdbId) => apiClient.get(`/version-history/pdb/${pdbId}`),
  getByVersion: (version, params = {}) => apiClient.get(`/version-history/version/${version}`, { params }),
  getStatistics: () => apiClient.get('/version-history/statistics'),
  create: (data) => apiClient.post('/version-history', data),
  update: (id, data) => apiClient.put(`/version-history/${id}`, data),
  delete: (id) => apiClient.delete(`/version-history/${id}`),
};

export default apiClient;
