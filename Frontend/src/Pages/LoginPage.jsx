import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });

      if (res.data.Status === "Success") {
      //  Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.token); // Optional, if you return token
      
      // Redirect based on role
        navigate(res.data.role === "admin" ? "/dashboard" : "/");
      } else {
        handleBackendError(res.data.message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";

      handleBackendError(message);
    }
  };

  const handleBackendError = (message) => {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("email")) {
      setErrors({ email: message, password: "" });
    } else if (lowerMsg.includes("password")) {
      setErrors({ email: "", password: message });
    } else {
      setErrors({ email: "", password: "Login failed. Please try again." });
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
            Login
          </Typography>

          <Typography variant="subtitle1" align="center" mb={3} color="text.secondary">
            Welcome back! Please enter your credentials
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              margin="normal"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
              }}
              margin="normal"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              color: "#fff",
              "&:hover": {
                backgroundColor: "#02001ee0",
              },
            }}
            >
              Login
            </Button>
          </form>

          <Typography mt={3} textAlign="center" fontSize="14px">
            <Link to="/forgotpassword" style={{ color: "#9c44ce", fontWeight: "bold" }}>
              Forgot password?
            </Link>
          </Typography>

          <Typography mt={1.5} textAlign="center" fontSize="14px">
            Don’t have an account?{" "}
            <Link to="/registration" style={{ color: "#9c44ce", fontWeight: "bold" }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
