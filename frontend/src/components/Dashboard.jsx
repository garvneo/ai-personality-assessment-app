import React, { useEffect, useState } from 'react';
import { getProfile, getFeedback } from '../api/api';
import {
    Box,
    Typography,
    List,
    ListItem,
    Button,
    Paper,
    LinearProgress,
    Avatar,
    Stack,
    Fade,
    Divider,
    Tooltip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssessmentIcon from '@mui/icons-material/Assessment';

const traitColors = [
    '#1976d2', // blue
    '#388e3c', // green
    '#fbc02d', // yellow
    '#d32f2f', // red
    '#7b1fa2', // purple
    '#00838f', // teal
];

// Helper to pick color for each trait
const getTraitColor = idx => traitColors[idx % traitColors.length];

const Dashboard = ({ sessionId, token }) => {
    const [scores, setScores] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch profile and feedback data on mount
    useEffect(() => {
        setLoading(true);
        Promise.all([
            getProfile(sessionId, token),
            getFeedback(sessionId, token)
        ]).then(([profileRes, feedbackRes]) => {
            setScores(profileRes.data);
            setFeedback(feedbackRes.data.feedback_summary);
        }).finally(() => setLoading(false));
    }, [sessionId, token]);

    // Open PDF report in new tab
    const downloadPDF = () => {
        window.open(`http://localhost:5000/candidate/feedback-pdf/${sessionId}`, '_blank');
    };

    return (
        <Fade in>
            <Box
                sx={{
                    p: { xs: 2, md: 4 },
                    maxWidth: 600,
                    mx: 'auto',
                    mt: 4,
                }}
            >
                {/* Header with icon */}
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                        <AssessmentIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h4" fontWeight={700}>
                        Personality Dashboard
                    </Typography>
                </Stack>

                <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Personality Scores
                    </Typography>
                    {loading ? (
                        <LinearProgress sx={{ my: 2 }} />
                    ) : (
                        <List>
                            {scores.map((s, i) => (
                                <ListItem
                                    key={i}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        mb: 2,
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1} width="100%">
                                        <Tooltip title={s.trait} arrow>
                                            <Avatar
                                                sx={{
                                                    bgcolor: getTraitColor(i),
                                                    width: 32,
                                                    height: 32,
                                                    fontWeight: 700,
                                                    mr: 1,
                                                }}
                                            >
                                                {s.trait[0]}
                                            </Avatar>
                                        </Tooltip>
                                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                            {s.trait}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {s.score}
                                        </Typography>
                                    </Stack>
                                    {/* Animated progress bar for score */}
                                    <LinearProgress
                                        variant="determinate"
                                        value={s.score}
                                        sx={{
                                            width: '100%',
                                            height: 8,
                                            borderRadius: 5,
                                            bgcolor: '#f5f5f5',
                                            my: 1,
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: getTraitColor(i),
                                            },
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>

                <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3, bgcolor: '#f9fbe7' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <EmojiEventsIcon color="warning" />
                        <Typography variant="h6" fontWeight={600}>
                            Feedback Summary
                        </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#333' }}>
                        {loading ? <LinearProgress /> : feedback}
                    </Typography>
                </Paper>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                        mt: 2,
                        borderRadius: 2,
                        boxShadow: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        letterSpacing: 1,
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                    onClick={downloadPDF}
                    startIcon={<AssessmentIcon />}
                >
                    Download PDF Report
                </Button>
            </Box>
        </Fade>
    );
};

export default Dashboard;
