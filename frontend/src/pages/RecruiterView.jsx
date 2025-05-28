import React, { useState, useEffect } from 'react';
import { getRecruiterCandidates, getTrends } from '../api/api';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Chip,
    CircularProgress,
    Fade,
    Tooltip,
    Paper,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from 'chart.js';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

Chart.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

const RecruiterView = ({ token }) => {
    const [candidates, setCandidates] = useState([]);
    const [trends, setTrends] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch candidates and trends on mount
    useEffect(() => {
        Promise.all([
            getRecruiterCandidates(token),
            getTrends(token),
        ]).then(([candidatesRes, trendsRes]) => {
            setCandidates(candidatesRes.data);
            setTrends(trendsRes.data);
            setLoading(false);
        });
    }, [token]);

    // Chart data and options for better visuals
    const chartData = {
        labels: Object.keys(trends),
        datasets: [
            {
                label: 'Average Trait Score',
                data: Object.values(trends),
                backgroundColor: [
                    '#1976d2',
                    '#388e3c',
                    '#fbc02d',
                    '#d32f2f',
                    '#7b1fa2',
                    '#0288d1',
                ],
                borderRadius: 8,
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
            },
        },
    };

    // Helper to get initials for avatars
    const getInitials = name =>
        name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
            }}
        >
            <Fade in>
                <Box>
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: '#1976d2',
                            letterSpacing: 1,
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                        }}
                    >
                        <TrendingUpIcon sx={{ mr: 1, fontSize: 40 }} />
                        Recruiter Dashboard
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                            <CircularProgress size={60} color="primary" />
                        </Box>
                    ) : (
                        <Grid container spacing={4}>
                            {/* Candidates List */}
                            <Grid item xs={12} md={5}>
                                <Card
                                    elevation={6}
                                    sx={{
                                        borderRadius: 4,
                                        background: 'rgba(255,255,255,0.95)',
                                        boxShadow: 6,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                            Candidates
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <List>
                                            {candidates.length === 0 ? (
                                                <Typography color="text.secondary">
                                                    No candidates found.
                                                </Typography>
                                            ) : (
                                                candidates.map((c, idx) => (
                                                    <Fade in key={c.id} style={{ transitionDelay: `${idx * 80}ms` }}>
                                                        <ListItem
                                                            sx={{
                                                                borderRadius: 2,
                                                                mb: 1,
                                                                '&:hover': {
                                                                    background: '#e3f2fd',
                                                                    transform: 'scale(1.02)',
                                                                },
                                                                transition: 'all 0.2s',
                                                            }}
                                                        >
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: '#1976d2' }}>
                                                                    {getInitials(c.name)}
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography sx={{ fontWeight: 500 }}>
                                                                        {c.name}
                                                                    </Typography>
                                                                }
                                                                secondary={
                                                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                                        {c.tags &&
                                                                            c.tags.slice(0, 3).map(tag => (
                                                                                <Chip
                                                                                    key={tag}
                                                                                    label={tag}
                                                                                    size="small"
                                                                                    color="primary"
                                                                                    variant="outlined"
                                                                                />
                                                                            ))}
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItem>
                                                    </Fade>
                                                ))
                                            )}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Trends Chart */}
                            <Grid item xs={12} md={7}>
                                <Card
                                    elevation={6}
                                    sx={{
                                        borderRadius: 4,
                                        background: 'rgba(255,255,255,0.95)',
                                        boxShadow: 6,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                            Behavioral Trends
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        {Object.keys(trends).length === 0 ? (
                                            <Typography color="text.secondary">
                                                No trend data available.
                                            </Typography>
                                        ) : (
                                            <Box sx={{ height: 340, position: 'relative' }}>
                                                <Bar data={chartData} options={chartOptions} />
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                                {/* Dynamic motivational quote */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mt: 3,
                                        p: 2,
                                        borderRadius: 3,
                                        background: 'linear-gradient(90deg, #1976d2 10%, #fbc02d 90%)',
                                        color: '#fff',
                                        fontWeight: 500,
                                        fontSize: 18,
                                        textAlign: 'center',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    <Tooltip title="Keep inspiring talent!">
                                        <span>
                                            “Great vision without great people is irrelevant.” – Jim Collins
                                        </span>
                                    </Tooltip>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Fade>
        </Box>
    );
};

export default RecruiterView;
