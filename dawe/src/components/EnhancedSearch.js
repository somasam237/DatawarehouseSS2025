// dawe/src/components/EnhancedSearch.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Card, 
    CardContent, 
    Typography, 
    TextField, 
    Button, 
    Box, 
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import { 
    ExpandMore as ExpandMoreIcon,
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';

const EnhancedSearch = ({ onSearchResults }) => {
    const { t } = useTranslation();
    const [searchType, setSearchType] = useState('entries');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOptions, setSearchOptions] = useState({
        limit: 50,
        offset: 0,
        sortBy: 'pdb_id',
        sortOrder: 'ASC'
    });
    const [advancedMode, setAdvancedMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);

    // Advanced search filters
    const [filters, setFilters] = useState({
        minResolution: '',
        maxResolution: '',
        experimentalMethod: '',
        organism: '',
        minLength: '',
        maxLength: '',
        depositionYear: '',
        hasLigands: false,
        author: '',
        journal: ''
    });

    useEffect(() => {
        // Load search history from localStorage
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setSearchHistory(history);
    }, []);

    const saveSearchToHistory = (query, type) => {
        const newSearch = {
            query,
            type,
            timestamp: new Date().toISOString()
        };
        const updatedHistory = [newSearch, ...searchHistory].slice(0, 10); // Keep last 10 searches
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    };

    const buildSearchQuery = () => {
        if (!advancedMode) {
            return searchQuery;
        }

        const conditions = [];

        // Basic text search
        if (searchQuery.trim()) {
            conditions.push(`pdb_id LIKE '%${searchQuery}%' OR title LIKE '%${searchQuery}%'`);
        }

        // Resolution filters
        if (filters.minResolution) {
            conditions.push(`resolution >= ${filters.minResolution}`);
        }
        if (filters.maxResolution) {
            conditions.push(`resolution <= ${filters.maxResolution}`);
        }

        // Experimental method
        if (filters.experimentalMethod) {
            conditions.push(`experimental_method = '${filters.experimentalMethod}'`);
        }

        // Organism filter
        if (filters.organism) {
            conditions.push(`EXISTS (SELECT 1 FROM entry_organisms eo JOIN organisms o ON eo.organism_id = o.id WHERE eo.entry_id = entries.id AND o.scientific_name LIKE '%${filters.organism}%')`);
        }

        // Length filters
        if (filters.minLength) {
            conditions.push(`EXISTS (SELECT 1 FROM chains c WHERE c.entry_id = entries.id AND LENGTH(c.sequence) >= ${filters.minLength})`);
        }
        if (filters.maxLength) {
            conditions.push(`EXISTS (SELECT 1 FROM chains c WHERE c.entry_id = entries.id AND LENGTH(c.sequence) <= ${filters.maxLength})`);
        }

        // Deposition year
        if (filters.depositionYear) {
            conditions.push(`EXTRACT(YEAR FROM deposition_date) = ${filters.depositionYear}`);
        }

        // Has ligands
        if (filters.hasLigands) {
            conditions.push(`EXISTS (SELECT 1 FROM entry_ligands el WHERE el.entry_id = entries.id)`);
        }

        // Author filter
        if (filters.author) {
            conditions.push(`EXISTS (SELECT 1 FROM entry_citations ec JOIN citations c ON ec.citation_id = c.id WHERE ec.entry_id = entries.id AND c.authors LIKE '%${filters.author}%')`);
        }

        // Journal filter
        if (filters.journal) {
            conditions.push(`EXISTS (SELECT 1 FROM entry_citations ec JOIN citations c ON ec.citation_id = c.id WHERE ec.entry_id = entries.id AND c.journal LIKE '%${filters.journal}%')`);
        }

        return conditions.length > 0 ? conditions.join(' AND ') : '';
    };

    const handleSearch = async () => {
        if (!searchQuery.trim() && !advancedMode) {
            setError(t('Please enter a search query'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const query = buildSearchQuery();
            const params = new URLSearchParams({
                query: query,
                ...searchOptions
            });

            const response = await fetch(`http://localhost:5000/api/${searchType}/search?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (onSearchResults) {
                onSearchResults(data);
            }

            // Save to history
            saveSearchToHistory(searchQuery || 'Advanced Search', searchType);

        } catch (err) {
            setError(err.message);
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setFilters({
            minResolution: '',
            maxResolution: '',
            experimentalMethod: '',
            organism: '',
            minLength: '',
            maxLength: '',
            depositionYear: '',
            hasLigands: false,
            author: '',
            journal: ''
        });
        setSearchQuery('');
        setError(null);
    };

    const handleHistorySearch = (historyItem) => {
        setSearchQuery(historyItem.query);
        setSearchType(historyItem.type);
        handleSearch();
    };

    const renderBasicSearch = () => (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                    <InputLabel>{t('Search Type')}</InputLabel>
                    <Select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        label={t('Search Type')}
                    >
                        <MenuItem value="entries">{t('Entries')}</MenuItem>
                        <MenuItem value="chains">{t('Chains')}</MenuItem>
                        <MenuItem value="ligands">{t('Ligands')}</MenuItem>
                        <MenuItem value="organisms">{t('Organisms')}</MenuItem>
                        <MenuItem value="citations">{t('Citations')}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label={t('Search Query')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('Enter search terms...')}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                    fullWidth
                >
                    {loading ? t('Searching...') : t('Search')}
                </Button>
            </Grid>
        </Grid>
    );

    const renderAdvancedFilters = () => (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label={t('Min Resolution (Å)')}
                    type="number"
                    value={filters.minResolution}
                    onChange={(e) => setFilters({...filters, minResolution: e.target.value})}
                    inputProps={{ step: 0.1, min: 0 }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label={t('Max Resolution (Å)')}
                    type="number"
                    value={filters.maxResolution}
                    onChange={(e) => setFilters({...filters, maxResolution: e.target.value})}
                    inputProps={{ step: 0.1, min: 0 }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                    <InputLabel>{t('Experimental Method')}</InputLabel>
                    <Select
                        value={filters.experimentalMethod}
                        onChange={(e) => setFilters({...filters, experimentalMethod: e.target.value})}
                        label={t('Experimental Method')}
                    >
                        <MenuItem value="">{t('Any')}</MenuItem>
                        <MenuItem value="X-RAY DIFFRACTION">X-RAY DIFFRACTION</MenuItem>
                        <MenuItem value="SOLUTION NMR">SOLUTION NMR</MenuItem>
                        <MenuItem value="ELECTRON MICROSCOPY">ELECTRON MICROSCOPY</MenuItem>
                        <MenuItem value="NEUTRON DIFFRACTION">NEUTRON DIFFRACTION</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label={t('Organism')}
                    value={filters.organism}
                    onChange={(e) => setFilters({...filters, organism: e.target.value})}
                    placeholder={t('e.g., Homo sapiens')}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label={t('Min Chain Length')}
                    type="number"
                    value={filters.minLength}
                    onChange={(e) => setFilters({...filters, minLength: e.target.value})}
                    inputProps={{ min: 1 }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label={t('Max Chain Length')}
                    type="number"
                    value={filters.maxLength}
                    onChange={(e) => setFilters({...filters, maxLength: e.target.value})}
                    inputProps={{ min: 1 }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label={t('Deposition Year')}
                    type="number"
                    value={filters.depositionYear}
                    onChange={(e) => setFilters({...filters, depositionYear: e.target.value})}
                    inputProps={{ min: 1970, max: new Date().getFullYear() }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label={t('Author')}
                    value={filters.author}
                    onChange={(e) => setFilters({...filters, author: e.target.value})}
                    placeholder={t('Author name')}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label={t('Journal')}
                    value={filters.journal}
                    onChange={(e) => setFilters({...filters, journal: e.target.value})}
                    placeholder={t('Journal name')}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={filters.hasLigands}
                            onChange={(e) => setFilters({...filters, hasLigands: e.target.checked})}
                        />
                    }
                    label={t('Has Ligands')}
                />
            </Grid>
        </Grid>
    );

    const renderSearchHistory = () => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                {t('Recent Searches')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {searchHistory.map((item, index) => (
                    <Chip
                        key={index}
                        label={`${item.query} (${item.type})`}
                        onClick={() => handleHistorySearch(item)}
                        variant="outlined"
                        size="small"
                    />
                ))}
            </Box>
        </Box>
    );

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">
                        {t('Advanced Search')}
                    </Typography>
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={advancedMode}
                                    onChange={(e) => setAdvancedMode(e.target.checked)}
                                />
                            }
                            label={t('Advanced Mode')}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleClearFilters}
                            startIcon={<ClearIcon />}
                            sx={{ ml: 1 }}
                        >
                            {t('Clear')}
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {renderBasicSearch()}

                {advancedMode && (
                    <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{t('Advanced Filters')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {renderAdvancedFilters()}
                        </AccordionDetails>
                    </Accordion>
                )}

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>{t('Results per page')}</InputLabel>
                            <Select
                                value={searchOptions.limit}
                                onChange={(e) => setSearchOptions({...searchOptions, limit: e.target.value})}
                                label={t('Results per page')}
                            >
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={200}>200</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>{t('Sort by')}</InputLabel>
                            <Select
                                value={searchOptions.sortBy}
                                onChange={(e) => setSearchOptions({...searchOptions, sortBy: e.target.value})}
                                label={t('Sort by')}
                            >
                                <MenuItem value="pdb_id">PDB ID</MenuItem>
                                <MenuItem value="title">Title</MenuItem>
                                <MenuItem value="resolution">Resolution</MenuItem>
                                <MenuItem value="deposition_date">Deposition Date</MenuItem>
                                <MenuItem value="experimental_method">Method</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {searchHistory.length > 0 && renderSearchHistory()}
            </CardContent>
        </Card>
    );
};

export default EnhancedSearch;
