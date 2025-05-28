import React, { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import Dashboard from '../components/Dashboard';
import { startAssessment } from '../api/api';
import {
    Button,
    Box,
    CircularProgress,
    Typography,
    Paper,
    Fade,
    Stack,
    Avatar,
    LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const CandidateView = ({ token }) => {
    const [sessionId, setSessionId] = useState('');
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Handles assessment start
    const start = async () => {
        setLoading(true);
        const res = await startAssessment('John Doe', token);
        setSessionId(res.data.session_id);
        setLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: { xs: 2, md: 6 },
                    borderRadius: 4,
                    minWidth: { xs: '90vw', md: 500 },
                    maxWidth: 600,
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    background: 'rgba(255,255,255,0.95)',
                }}
            >
                {/* Welcome / Start Assessment Section */}
                {!sessionId && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Stack spacing={3} alignItems="center">
                            <Avatar
                                sx={{
                                    bgcolor: '#6366f1',
                                    width: 72,
                                    height: 72,
                                    boxShadow: 3,
                                }}
                            >
                                <AssessmentIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                color="primary"
                                textAlign="center"
                                gutterBottom
                            >
                                Ready for Your AI Assessment?
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ mb: 1, color: 'text.secondary', textAlign: 'center' }}
                            >
                                Answer thoughtfully. The system will provide real-time feedback and a full personality report.
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <EmojiObjectsIcon color="warning" />
                                <Typography variant="caption" color="text.secondary">
                                    Tip: Be yourself for the most accurate results!
                                </Typography>
                            </Stack>
                            <Box sx={{ width: '100%', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={start}
                                    disabled={loading}
                                    sx={{
                                        px: 5,
                                        py: 1.5,
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        background: 'linear-gradient(90deg, #6366f1 30%, #06b6d4 100%)',
                                        boxShadow: '0 4px 20px 0 rgba(99,102,241,0.15)',
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, #6366f1 10%, #06b6d4 90%)',
                                        },
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <CircularProgress size={24} color="inherit" />
                                            <Typography variant="button" sx={{ ml: 2 }}>
                                                Starting...
                                            </Typography>
                                        </>
                                    ) : (
                                        'Start Assessment'
                                    )}
                                </Button>
                                {/* Animated progress bar while loading */}
                                {loading && (
                                    <Box sx={{ mt: 2 }}>
                                        <LinearProgress color="primary" />
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    </motion.div>
                )}

                {/* Chat Window Section */}
                {sessionId && !completed && (
                    <Fade in>
                        <Box>
                            {/* Animated transition for chat window */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ChatWindow sessionId={sessionId} token={token} setCompleted={setCompleted} />
                            </motion.div>
                        </Box>
                    </Fade>
                )}

                {/* Dashboard Section */}
                {completed && (
                    <Fade in>
                        <Box>
                            {/* Animated transition for dashboard */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Dashboard sessionId={sessionId} token={token} />
                            </motion.div>
                        </Box>
                    </Fade>
                )}
            </Paper>
        </Box>
    );
};

export default CandidateView;
