import React from 'react';
import {
    Button,
    Typography,
    Container,
    AppBar,
    Toolbar,
    Box,
    Grid,
    Paper,
    Stack,
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animated background gradient
const AnimatedBackground = ({ children }) => (
    <Box
        sx={{
            minHeight: '100vh',
            width: '100%',
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: 0,
            background: 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)',
            overflow: 'hidden'
        }}
    >
        {/* Animated circles for dynamic effect */}
        <motion.div
            style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                filter: 'blur(10px)'
            }}
            animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        <motion.div
            style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)',
                filter: 'blur(20px)'
            }}
            animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        />
        {children}
    </Box>
);

const featureList = [
    {
        icon: '🤖',
        title: 'AI-Powered Insights',
        desc: 'Get accurate, unbiased personality analysis using advanced AI algorithms.'
    },
    {
        icon: '🚀',
        title: 'Career Guidance',
        desc: 'Personalized recommendations to help you excel in your professional journey.'
    },
    {
        icon: '🤝',
        title: 'Team Compatibility',
        desc: 'Discover how you fit into teams and improve collaboration.'
    }
];

const Landing = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <>
            {/* Animated background */}
            <AnimatedBackground />

            {/* AppBar with subtle shadow */}
            <AppBar position="static" elevation={3} sx={{ background: 'rgba(30,30,60,0.95)' }}>
                <Toolbar>
                    <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            AI Personality Assessment
                        </motion.span>
                    </Typography>
                    <Button
                        color="inherit"
                        variant="outlined"
                        sx={{
                            borderColor: '#fff',
                            color: '#fff',
                            '&:hover': { background: '#fff', color: theme.palette.primary.main }
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main content */}
            <Container maxWidth="lg" sx={{ mt: 10, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6} alignItems="center">
                    {/* Left: Text and CTA */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Typography
                                variant="h2"
                                gutterBottom
                                sx={{
                                    fontWeight: 800,
                                    color: '#fff',
                                    textShadow: '0 4px 24px rgba(0,0,0,0.2)'
                                }}
                            >
                                Unlock Your <span style={{ color: '#fc5c7d' }}>Potential</span>
                            </Typography>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ color: '#f3f3f3', mb: 4, maxWidth: 500 }}
                            >
                                Discover your strengths, improve your career, and find your perfect team fit with our AI-driven personality assessment.
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <motion.div whileHover={{ scale: 1.08 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
                                            fontWeight: 700,
                                            px: 4,
                                            py: 1.5,
                                            fontSize: 18,
                                            boxShadow: '0 4px 24px rgba(252,92,125,0.2)'
                                        }}
                                        onClick={() => navigate('/login')}
                                    >
                                        Get Started
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.08 }}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor: '#fff',
                                            color: '#fff',
                                            fontWeight: 700,
                                            px: 4,
                                            py: 1.5,
                                            fontSize: 18,
                                            '&:hover': {
                                                background: '#fff',
                                                color: theme.palette.primary.main
                                            }
                                        }}
                                        onClick={() => navigate('/about')}
                                    >
                                        Learn More
                                    </Button>
                                </motion.div>
                            </Stack>
                        </motion.div>
                    </Grid>

                    {/* Right: Animated illustration */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.2, type: 'spring' }}
                        >
                            <Paper
                                elevation={8}
                                sx={{
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    background: 'rgba(255,255,255,0.07)',
                                    backdropFilter: 'blur(6px)',
                                    p: 2
                                }}
                            >
                                <motion.img
                                    src="/ai-illustration.png"
                                    alt="AI Illustration"
                                    style={{ width: '100%', borderRadius: 24 }}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1.2, delay: 0.5 }}
                                />
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Features section */}
                <Box sx={{ mt: 10 }}>
                    <Grid container spacing={4} justifyContent="center">
                        {featureList.map((feature, idx) => (
                            <Grid item xs={12} md={4} key={feature.title}>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: idx * 0.2 }}
                                >
                                    <Paper
                                        elevation={6}
                                        sx={{
                                            p: 4,
                                            borderRadius: 5,
                                            textAlign: 'center',
                                            background: 'rgba(255,255,255,0.13)',
                                            color: '#fff',
                                            minHeight: 220,
                                            boxShadow: '0 8px 32px rgba(106,130,251,0.10)'
                                        }}
                                    >
                                        <Typography variant="h2" sx={{ mb: 1 }}>
                                            {feature.icon}
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
                                            {feature.desc}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            {/* Footer */}
            <Box sx={{ mt: 10, py: 4, textAlign: 'center', color: '#fff', opacity: 0.8 }}>
                <Typography variant="body2">
                    &copy; {new Date().getFullYear()} AI Personality Assessment. All rights reserved.
                </Typography>
            </Box>
        </>
    );
};

export default Landing;
