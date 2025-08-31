import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
  Paper,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
  Tooltip,
  Zoom
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Science as ScienceIcon,
  Memory as MemoryIcon,
  AccountTree as AccountTreeIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  History as HistoryIcon
} from '@mui/icons-material';

const GlobalSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  // Search across all endpoints
  const searchEndpoints = [
    { key: 'protein-info', label: t('ProteinInformation'), icon: ScienceIcon, path: '/protein-info' },
    { key: 'experimental-data', label: t('ExperimentalData'), icon: MemoryIcon, path: '/experimental-data' },
    { key: 'macromolecules', label: t('Macromolecules'), icon: AccountTreeIcon, path: '/macromolecules' },
    { key: 'authors-funding', label: t('AuthorsFunding'), icon: PeopleIcon, path: '/authors-funding' },
    { key: 'software-used', label: t('SoftwareUsed'), icon: SettingsIcon, path: '/software-used' },
    { key: 'version-history', label: t('VersionHistory'), icon: HistoryIcon, path: '/version-history' }
  ];

  const searchAllEndpoints = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    const results = [];

    try {
      // Search in protein-info (main endpoint)
      const proteinResponse = await fetch(`http://localhost:5000/api/protein-info?search=${encodeURIComponent(query)}&limit=5`);
      if (proteinResponse.ok) {
        const proteinData = await proteinResponse.json();
        if (Array.isArray(proteinData)) {
          proteinData.forEach(item => {
            results.push({
              id: item.pdb_id,
              type: 'protein-info',
              label: item.pdb_id,
              title: item.title || item.pdb_id,
              endpoint: 'protein-info',
              path: `/protein-info/${item.pdb_id}`
            });
          });
        }
      }

      // Search in experimental-data
      const experimentalResponse = await fetch(`http://localhost:5000/api/experimental-data/search?search=${encodeURIComponent(query)}&limit=3`);
      if (experimentalResponse.ok) {
        const experimentalData = await experimentalResponse.json();
        if (Array.isArray(experimentalData)) {
          experimentalData.forEach(item => {
            results.push({
              id: item.pdb_id,
              type: 'experimental-data',
              label: item.pdb_id,
              title: `Experimental Data - ${item.method || 'Method'}`,
              endpoint: 'experimental-data',
              path: `/experimental-data`
            });
          });
        }
      }

      // Search in macromolecules
      const macromoleculesResponse = await fetch(`http://localhost:5000/api/macromolecules/search?search=${encodeURIComponent(query)}&limit=3`);
      if (macromoleculesResponse.ok) {
        const macromoleculesData = await macromoleculesResponse.json();
        if (Array.isArray(macromoleculesData)) {
          macromoleculesData.forEach(item => {
            results.push({
              id: item.pdb_id,
              type: 'macromolecules',
              label: item.pdb_id,
              title: `Macromolecule - ${item.chain_id || 'Chain'}`,
              endpoint: 'macromolecules',
              path: `/macromolecules`
            });
          });
        }
      }

      // Remove duplicates based on pdb_id
      const uniqueResults = results.filter((result, index, self) => 
        index === self.findIndex(r => r.id === result.id)
      );

      setSearchResults(uniqueResults.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchAllEndpoints(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (event, value) => {
    if (value && typeof value === 'object') {
      // Navigate to the selected result
      navigate(value.path);
      setSearchTerm('');
      setOpen(false);
    }
  };

  const handleInputChange = (event, newValue) => {
    setSearchTerm(newValue);
    setOpen(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setOpen(false);
  };

  const getIconForType = (type) => {
    const endpoint = searchEndpoints.find(ep => ep.key === type);
    return endpoint ? endpoint.icon : ScienceIcon;
  };

  return (
    <Box sx={{ position: 'relative', minWidth: 300, maxWidth: 500 }}>
      <Autocomplete
        ref={searchRef}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={searchResults}
        getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        loading={loading}
        value={null}
        onChange={handleSearch}
        onInputChange={handleInputChange}
        inputValue={searchTerm}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={t('SearchPDBID')}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 50%, #ec4899 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                '&:hover': {
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                },
                '&.Mui-focused': {
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              },
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress size={20} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  ) : searchTerm ? (
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => {
          const IconComponent = getIconForType(option.type);
          return (
            <Box component="li" {...props}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <IconComponent sx={{ fontSize: 20, color: 'primary.main' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {option.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {option.title}
                  </Typography>
                </Box>
                <Chip 
                  label={option.type.replace('-', ' ')} 
                  size="small" 
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            </Box>
          );
        }}
        PaperComponent={(props) => (
          <Paper
            {...props}
            sx={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(162, 28, 175, 0.95) 50%, rgba(236, 72, 153, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              '& .MuiAutocomplete-listbox': {
                '& .MuiAutocomplete-option': {
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&[aria-selected="true"]': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                },
              },
            }}
          />
        )}
        noOptionsText={searchTerm ? t('NoResultsFound') : t('StartTypingToSearch')}
        loadingText={t('Searching')}
      />
    </Box>
  );
};

export default GlobalSearch; 