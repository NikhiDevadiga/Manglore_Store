import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[a-zA-Z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Optional: restrict phone input to digits only
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post("https://manglore-store-t98r.onrender.com/api/registration", form);
      localStorage.setItem("user", JSON.stringify({
        name: form.name,
        email: form.email,
        phno: form.phone
      }));
      alert("Registered successfully!");
      navigate("/login");
      } catch (error) {
        const message = error.response?.data?.message;

        if (message === "Email already exists") {
          alert("Email already exists");
        } else if (message === "Phone number already exists") {
          alert("Phone number already exists");
        } else {
          alert("Registration failed");
        }
      }
    }



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
        <Paper elevation={10} sx={{ p: 5, borderRadius: 4, backgroundColor: "#fff" }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#02002ee0" }}>
            Create Your Account
          </Typography>

          <Typography variant="subtitle1" align="center" mb={3} color="text.secondary">
            Please fill in the form to continue
          </Typography>

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.phone}
            helperText={errors.phone}
            inputProps={{ maxLength: 10 }}
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
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
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
              "&:hover": { backgroundColor: "#02001ee0" },
            }}
          >
            Register
          </Button>

          <Typography mt={3} textAlign="center" fontSize="14px">
            Already registered?{" "}
            <Link component="button" onClick={() => navigate("/login")} sx={{ fontWeight: "bold", color: "#9c44ce" }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
