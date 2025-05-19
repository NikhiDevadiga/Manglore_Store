import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { resetPassword } from '../Api/userApi';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await resetPassword(form);
      setMessage(res.data.message || 'Password reset successfully.');

      // Navigate to the login page after successful reset
      navigate('/login'); // Adjust the path based on your routing structure
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Box
      sx={{
      minHeight: "90vh",
      background: "linear-gradient(135deg,#9c89ce,#02002ee0)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
    }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 5, borderRadius: 4 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#02002ee0' }}
          >
            Reset Password
          </Typography>

          <Typography variant="subtitle1" align="center" mb={3} color="text.secondary">
            Enter your email, reset code, and new password
          </Typography>

          {message && (
            <Alert
              severity={message.startsWith('✅') ? 'success' : 'error'}
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}

          <form onSubmit={handleReset}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Reset Code"
              value={form.resetCode}
              onChange={(e) => setForm({ ...form, resetCode: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.4,
                backgroundColor: '#02002ee0',
                fontWeight: 'bold',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#02001ee0',
                },
              }}
            >
              Reset Password
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;