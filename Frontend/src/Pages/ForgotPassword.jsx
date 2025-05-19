import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();  // Initialize useNavigate hook

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    axios
      .post("https://manglore-store-t98r.onrender.com/api/forgotpassword", { email })  // Correct endpoint
      .then((res) => {
        if (res.data.Status === "Success") {
          setMessage("Check your email for the password reset code.");
          setTimeout(() => {
            navigate("/resetpassword");  // Navigate to the reset password page after 2 seconds
          }, 2000);  // Timeout of 2 seconds before redirecting
        } else {
          setMessage("Unexpected response: " + res.data.message);
        }
      })
      .catch((err) => {
        const errMsg =
          err.response?.data?.message ||
          "Could not send reset code. Please try again.";
        setMessage(errMsg);
      });
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
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 4,
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#02002ee0" }}
          >
            Forgot Password
          </Typography>

          <Typography variant="subtitle1" align="center" mb={3} color="text.secondary">
            Enter your email to receive a reset code
          </Typography>

          {message && (
            <Alert
              severity={message.startsWith("✅") ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                backgroundColor: "#02002ee0",
                fontWeight: "bold",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#02001ee0",
                },
              }}
            >
              Send Reset Code
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
