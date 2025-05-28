import React from 'react';
import { LinearProgress, Box, Typography, Stack, Avatar, Fade } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Trophy icon for completion

const getProgressColor = (progress) => {
    // Dynamic color based on progress
    if (progress < 40) return 'error';
    if (progress < 80) return 'warning';
    return 'success';
};

const ProgressBar = ({ progress }) => {
    // Clamp progress between 0 and 100
    const safeProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <Box
            sx={{
                width: '100%',
                mb: 3,
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                background: 'linear-gradient(90deg, #e3ffe6 0%, #f7faff 100%)',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                {/* Animated avatar that fills up as progress increases */}
                <Avatar
                    sx={{
                        bgcolor: getProgressColor(safeProgress) + '.main',
                        width: 48,
                        height: 48,
                        fontSize: 24,
                        transition: 'background 0.5s',
                    }}
                >
                    {/* Show trophy icon at 100% */}
                    <Fade in={safeProgress === 100}>
                        <span>
                            <EmojiEventsIcon fontSize="inherit" />
                        </span>
                    </Fade>
                    {/* Show percentage otherwise */}
                    <Fade in={safeProgress < 100}>
                        <span>{safeProgress < 100 ? `${safeProgress}%` : ''}</span>
                    </Fade>
                </Avatar>
                <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                        {safeProgress === 100 ? 'Completed!' : 'Progress'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {safeProgress === 100
                            ? 'Congratulations! You have finished.'
                            : `You are ${safeProgress}% done.`}
                    </Typography>
                </Box>
            </Stack>
            {/* Dynamic colored progress bar */}
            <LinearProgress
                variant="determinate"
                value={safeProgress}
                color={getProgressColor(safeProgress)}
                sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                }}
            />
        </Box>
    );
};

export default ProgressBar;
