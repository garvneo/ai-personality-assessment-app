import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { submitResponse, getNextQuestion } from '../api/api';

const ChatWindow = ({ sessionId, token }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');

    useEffect(() => {
        // Fetch the first question when the component mounts
        getNextQuestion(sessionId, token).then(res => setCurrentQuestion(res.data.next_question));
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { sender: 'You', text: input };
        setMessages(prev => [...prev, userMessage]);

        // Submit user's response and get AI analysis
        const res = await submitResponse(sessionId, currentQuestion, input, token);
        const aiMessage = { sender: 'AI', text: JSON.stringify(res.data.analysis) };

        setMessages(prev => [...prev, aiMessage]);

        // Fetch the next question after AI response
        const nextQ = await getNextQuestion(sessionId, token);
        setCurrentQuestion(nextQ.data.next_question);
        setInput('');
    };

    return (
        <Box
            sx={{
                p: 3,
                maxWidth: 500,
                mx: 'auto',
                mt: 5,
                bgcolor: '#f5f7fa',
                borderRadius: 3,
                boxShadow: 3,
            }}
        >
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700, color: '#1976d2' }}>
                AI Personality Assessment
            </Typography>
            <Paper
                elevation={2}
                sx={{
                    height: 320,
                    overflowY: 'auto',
                    p: 2,
                    mb: 2,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    border: '1px solid #e3e3e3',
                }}
            >
                {messages.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ mt: 10 }}>
                        Start the conversation by answering the question below!
                    </Typography>
                ) : (
                    messages.map((msg, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: 'flex',
                                flexDirection: msg.sender === 'You' ? 'row-reverse' : 'row',
                                mb: 1.5,
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: msg.sender === 'You' ? '#1976d2' : '#e3e3e3',
                                    color: msg.sender === 'You' ? '#fff' : '#333',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    maxWidth: '75%',
                                    wordBreak: 'break-word',
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {msg.sender}
                                </Typography>
                                <Typography variant="body2">{msg.text}</Typography>
                            </Box>
                        </Box>
                    ))
                )}
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: '#e3f2fd',
                    borderRadius: 2,
                    border: '1px solid #bbdefb',
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#1976d2' }}>
                    {currentQuestion || 'Loading next question...'}
                </Typography>
            </Paper>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    label="Your answer"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleSend();
                    }}
                    variant="outlined"
                    sx={{ bgcolor: '#fff', borderRadius: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 100, fontWeight: 600 }}
                    onClick={handleSend}
                    disabled={!input.trim()}
                >
                    Send
                </Button>
            </Box>
        </Box>
        );
    
    };
    
    export default ChatWindow;
