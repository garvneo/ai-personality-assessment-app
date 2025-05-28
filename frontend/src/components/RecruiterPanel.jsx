import React, { useState, useEffect } from 'react';
import { getRecruiterCandidates, getTrends } from '../api/api';
import {
    Box,
    Typography,
    List,
    ListItem,
    Avatar,
    Card,
    CardContent,
    Grid,
    Chip,
    CircularProgress,
    LinearProgress,
    Paper,
    Fade,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';

const traitColors = [
    'primary',
    'secondary',
    'success',
    'warning',
    'info',
    'error',
];

// Helper to pick color for trait chips
const getTraitColor = (i) => traitColors[i % traitColors.length];

const RecruiterPanel = ({ token }) => {
    const [candidates, setCandidates] = useState([]);
    const [trends, setTrends] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch candidates and trends in parallel
        Promise.all([
            getRecruiterCandidates(token),
            getTrends(token)
        ]).then(([candidatesRes, trendsRes]) => {
            setCandidates(candidatesRes.data);
            setTrends(trendsRes.data);
            setLoading(false);
        });
    }, [token]);

    return (
        <Fade in>
            <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, letterSpacing: 1 }}>
                    <TrendingUpIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Recruiter Dashboard
                </Typography>

                {/* Candidates Section */}
                <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        <PersonIcon color="secondary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Candidates
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {candidates.map((c, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={c.id}>
                                    <Card sx={{
                                        borderRadius: 2,
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
                                    }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                    {c.name[0]}
                                                </Avatar>
                                                <Typography variant="h6">{c.name}</Typography>
                                            </Box>
                                            {/* Example: Show candidate's top trait if available */}
                                            {c.topTrait && (
                                                <Chip
                                                    label={`Top Trait: ${c.topTrait}`}
                                                    color="info"
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>

                {/* Trends Section */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        <TrendingUpIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Overall Trait Trends
                    </Typography>
                    {loading ? (
                        <LinearProgress />
                    ) : (
                        <List>
                            {Object.entries(trends).map(([trait, avg], i) => (
                                <ListItem key={trait} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Chip
                                        label={trait}
                                        color={getTraitColor(i)}
                                        sx={{ mr: 2, fontWeight: 500 }}
                                    />
                                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(avg * 20, 100)}
                                            color={getTraitColor(i)}
                                            sx={{ height: 8, borderRadius: 5 }}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ minWidth: 40, fontWeight: 600 }}>
                                        {avg.toFixed(2)}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>
        </Fade>
    );
};

export default RecruiterPanel;
