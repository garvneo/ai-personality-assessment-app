import React from 'react';
import { Box, Typography, Paper, Avatar, Fade } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// Define colors for user and bot
const userColor = '#1976d2';
const botColor = '#f1f1f1';

const MessageBubble = ({ sender, text }) => {
    const isUser = sender === 'user';

    // Dynamic avatar based on sender
    const avatar = isUser ? (
        <Avatar sx={{ bgcolor: userColor, color: '#fff', width: 32, height: 32 }}>
            <PersonIcon />
        </Avatar>
    ) : (
        <Avatar sx={{ bgcolor: '#fff', color: userColor, border: `2px solid ${userColor}`, width: 32, height: 32 }}>
            <SmartToyIcon />
        </Avatar>
    );

    return (
        <Fade in timeout={400}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    mb: 2,
                    px: 1,
                }}
            >
                {/* Avatar */}
                <Box sx={{ mx: 1 }}>{avatar}</Box>

                {/* Message bubble with a "tail" effect */}
                <Paper
                    elevation={4}
                    sx={{
                        p: 2,
                        maxWidth: '70%',
                        background: isUser
                            ? `linear-gradient(135deg, ${userColor} 80%, #1565c0 100%)`
                            : `linear-gradient(135deg, ${botColor} 80%, #e0e0e0 100%)`,
                        color: isUser ? '#fff' : '#222',
                        borderRadius: isUser
                            ? '18px 18px 4px 18px'
                            : '18px 18px 18px 4px',
                        position: 'relative',
                        boxShadow: isUser
                            ? '0 4px 16px 0 rgba(25, 118, 210, 0.15)'
                            : '0 4px 16px 0 rgba(0,0,0,0.08)',
                        transition: 'background 0.3s',
                    }}
                >
                    {/* Sender label for bot */}
                    {!isUser && (
                        <Typography
                            variant="caption"
                            sx={{ color: '#888', fontWeight: 500, mb: 0.5, display: 'block' }}
                        >
                            AI
                        </Typography>
                    )}

                    {/* Message text */}
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                        {text}
                    </Typography>
                </Paper>
            </Box>
        </Fade>
    );
};

export default MessageBubble;
