 
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box, 
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@mui/material';
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    ScatterController
} from 'chart.js';
import { Bar, Pie, Line, Scatter } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    ScatterController
);

const ScientificPlots = () => {
    const { t } = useTranslation();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [plotType, setPlotType] = useState('resolution');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/stats');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setStatistics(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching statistics:', err);
        } finally {
            setLoading(false);
        }
    };

    const getChartOptions = (title, xAxisLabel, yAxisLabel) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#a21caf',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisLabel
                },
                grid: {
                    color: 'rgba(162, 28, 175, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: yAxisLabel
                },
                grid: {
                    color: 'rgba(162, 28, 175, 0.1)'
                }
            }
        }
    });

    const generateColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 137.508) % 360; // Golden angle approximation
            colors.push(`hsl(${hue}, 70%, 50%)`);
        }
        return colors;
    };

    const renderResolutionDistribution = () => {
        if (!statistics?.resolutionDistribution) return null;

        const data = {
            labels: statistics.resolutionDistribution.map(item => item.resolution_range),
            datasets: [{
                label: t('Number of Structures'),
                data: statistics.resolutionDistribution.map(item => item.count),
                backgroundColor: generateColors(statistics.resolutionDistribution.length),
                borderColor: '#a21caf',
                borderWidth: 2
            }]
        };

        return (
            <Box sx={{ height: 400 }}>
                <Bar 
                    data={data} 
                    options={getChartOptions(
                        t('Resolution Distribution'),
                        t('Resolution Range'),
                        t('Number of Structures')
                    )}
                />
            </Box>
        );
    };

    const renderMethodDistribution = () => {
        if (!statistics?.methodDistribution) return null;

        const data = {
            labels: statistics.methodDistribution.map(item => item.experimental_method),
            datasets: [{
                data: statistics.methodDistribution.map(item => item.count),
                backgroundColor: generateColors(statistics.methodDistribution.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        };

        return (
            <Box sx={{ height: 400 }}>
                <Pie 
                    data={data} 
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                            },
                            title: {
                                display: true,
                                text: t('Experimental Methods Distribution'),
                                font: {
                                    size: 16,
                                    weight: 'bold'
                                }
                            }
                        }
                    }}
                />
            </Box>
        );
    };

    const renderYearDistribution = () => {
        if (!statistics?.yearDistribution) return null;

        const data = {
            labels: statistics.yearDistribution.map(item => item.year),
            datasets: [{
                label: t('Structures Deposited'),
                data: statistics.yearDistribution.map(item => item.count),
                borderColor: '#a21caf',
                backgroundColor: 'rgba(162, 28, 175, 0.1)',
                fill: true,
                tension: 0.4
            }]
        };

        return (
            <Box sx={{ height: 400 }}>
                <Line 
                    data={data} 
                    options={getChartOptions(
                        t('Structures Deposited Over Time'),
                        t('Year'),
                        t('Number of Structures')
                    )}
                />
            </Box>
        );
    };

    const renderProteinLengthDistribution = () => {
        if (!statistics?.proteinLengthDistribution) return null;

        const data = {
            labels: statistics.proteinLengthDistribution.map(item => item.length_range),
            datasets: [{
                label: t('Number of Proteins'),
                data: statistics.proteinLengthDistribution.map(item => item.count),
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderColor: '#6366f1',
                borderWidth: 2
            }]
        };

        return (
            <Box sx={{ height: 400 }}>
                <Bar 
                    data={data} 
                    options={getChartOptions(
                        t('Protein Length Distribution'),
                        t('Length Range (amino acids)'),
                        t('Number of Proteins')
                    )}
                />
            </Box>
        );
    };

    const renderScatterPlot = () => {
        if (!statistics?.resolutionDistribution || !statistics?.proteinLengthDistribution) return null;

        // This is a simplified scatter plot - in real implementation, you'd need actual data points
        const data = {
            datasets: [{
                label: t('Resolution vs Protein Length'),
                data: [
                    { x: 1.5, y: 150 },
                    { x: 2.0, y: 300 },
                    { x: 2.5, y: 250 },
                    { x: 3.0, y: 400 },
                    { x: 1.8, y: 200 },
                    { x: 2.2, y: 350 },
                    { x: 2.8, y: 180 },
                    { x: 3.5, y: 500 }
                ],
                backgroundColor: 'rgba(162, 28, 175, 0.6)',
                borderColor: '#a21caf',
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        };

        return (
            <Box sx={{ height: 400 }}>
                <Scatter 
                    data={data} 
                    options={getChartOptions(
                        t('Resolution vs Protein Length'),
                        t('Resolution (Å)'),
                        t('Protein Length (amino acids)')
                    )}
                />
            </Box>
        );
    };

    const renderSelectedPlot = () => {
        switch (plotType) {
            case 'resolution':
                return renderResolutionDistribution();
            case 'method':
                return renderMethodDistribution();
            case 'year':
                return renderYearDistribution();
            case 'length':
                return renderProteinLengthDistribution();
            case 'scatter':
                return renderScatterPlot();
            default:
                return renderResolutionDistribution();
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">{t('Error loading statistics')}: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                {t('Scientific Data Visualization')}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {t('Plot Selection')}
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>{t('Plot Type')}</InputLabel>
                                <Select
                                    value={plotType}
                                    onChange={(e) => setPlotType(e.target.value)}
                                    label={t('Plot Type')}
                                >
                                    <MenuItem value="resolution">{t('Resolution Distribution')}</MenuItem>
                                    <MenuItem value="method">{t('Experimental Methods')}</MenuItem>
                                    <MenuItem value="year">{t('Deposition Trends')}</MenuItem>
                                    <MenuItem value="length">{t('Protein Length')}</MenuItem>
                                    <MenuItem value="scatter">{t('Resolution vs Length')}</MenuItem>
                                </Select>
                            </FormControl>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={fetchStatistics}
                                fullWidth
                            >
                                {t('Refresh Data')}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Card>
                        <CardContent>
                            {renderSelectedPlot()}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {t('Data Summary')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('Total Structures')}: {statistics?.resolutionDistribution?.reduce((sum, item) => sum + parseInt(item.count), 0) || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('Methods Available')}: {statistics?.methodDistribution?.length || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('Years Covered')}: {statistics?.yearDistribution?.length || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {t('Interactive Features')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • {t('Hover over data points for details')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • {t('Click legend items to toggle visibility')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • {t('Use plot selection to explore different datasets')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ScientificPlots;
