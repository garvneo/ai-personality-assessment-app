import React, { useState } from 'react';
import { login } from '../api/api';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    Typography,
    Container,
    Paper,
    InputLabel,
    InputAdornment,
    IconButton,
    Box,
    FormControl,
    FormHelperText,
    Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import WorkIcon from '@mui/icons-material/Work';

const Login = ({ setToken, setRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setLocalRole] = useState('candidate');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle login logic
    const handleLogin = async () => {
        setError('');
        try {
            const res = await login(username, password, role);
            setToken(res.data.access_token);
            setRole(role);
            navigate(role === 'candidate' ? '/candidate' : '/recruiter');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    // Toggle password visibility
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // Animation variants for framer-motion
    const paperVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 40 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            {/* Animated Paper Card */}
            <motion.div initial="hidden" animate="visible" variants={paperVariants}>
                <Paper
                    elevation={6}
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative Animated Circles */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: -40,
                            right: -40,
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: 'rgba(33, 150, 243, 0.15)',
                            zIndex: 0,
                        }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    />
                    <motion.div
                        style={{
                            position: 'absolute',
                            bottom: -30,
                            left: -30,
                            width: 70,
                            height: 70,
                            borderRadius: '50%',
                            background: 'rgba(233, 30, 99, 0.12)',
                            zIndex: 0,
                        }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    />

                    {/* Header with Icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', zIndex: 1, position: 'relative' }}>
                        <LoginIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                        <Typography variant="h4" gutterBottom align="center" fontWeight={700}>
                            Welcome Back!
                        </Typography>
                        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 2 }}>
                            Sign in to continue to your personalized experience.
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Username Field */}
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <TextField
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            autoFocus
                        />
                    </FormControl>

                    {/* Password Field with Visibility Toggle */}
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>

                    {/* Role Selection with Icons */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Select Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={role}
                            label="Select Role"
                            onChange={e => setLocalRole(e.target.value)}
                            sx={{ background: '#fff' }}
                        >
                            <MenuItem value="candidate">
                                <EmojiPeopleIcon sx={{ mr: 1, color: '#1976d2' }} />
                                Candidate
                            </MenuItem>
                            <MenuItem value="recruiter">
                                <WorkIcon sx={{ mr: 1, color: '#e91e63' }} />
                                Recruiter
                            </MenuItem>
                        </Select>
                        <FormHelperText>
                            Choose your role to access the right dashboard.
                        </FormHelperText>
                    </FormControl>

                    {/* Error Message */}
                    {error && (
                        <Typography color="error" sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}

                    {/* Login Button with Animation */}
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.5,
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                background: 'linear-gradient(90deg, #1976d2 60%, #e91e63 100%)',
                                boxShadow: '0 4px 20px 0 rgba(33, 150, 243, 0.15)',
                            }}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </motion.div>

                    {/* Extra: Motivational Quote */}
                    <Typography
                        variant="caption"
                        display="block"
                        align="center"
                        sx={{ mt: 4, color: '#888', fontStyle: 'italic' }}
                    >
                        "Unlock your potential. Every login is a new opportunity!"
                    </Typography>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default Login;
