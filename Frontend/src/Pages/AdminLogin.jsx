import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Paper, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";


const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("Manglore-user")) {
      navigate("/Admin");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://manglore-store-t98r.onrender.com/api/adminlogin", form);
      localStorage.setItem("Manglore-user", JSON.stringify(res.data));
      alert("Login successful!");
      navigate("/Admin");
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
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
            Admin Login
          </Typography>

          <Typography variant="subtitle1" align="center" mb={3} color="text.secondary">
            Please enter your admin credentials.
          </Typography>

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
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
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* <div className="info" style={{ display: "flex", justifyContent:"center", gap: "1rem" }}>
            <p>Username: <strong>admin</strong></p>
            <p>Password: <strong>admin123</strong></p>
        </div> */}

          <Typography mt={3} textAlign="center" fontSize="14px">
            Are you a user?{" "}
            <Link
              component="button"
              onClick={() => navigate("/login")}
              sx={{ fontWeight: "bold", color: "#2a5298" }}
            >
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
