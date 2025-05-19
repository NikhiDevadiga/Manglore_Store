import React, { useState } from "react";
import { Box, Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material"; // Ensure this is at the top of your file


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate(); // Initialize navigate

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
  
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
  
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" }); // Reset form fields
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <Box sx={{ py: 8, backgroundColor: "#9c88ce" }}>
      <Container maxWidth="sm">
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{color:"#02002ee0"}}>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          We’d love to hear from you! Fill out the form below, and we’ll get back to you as soon as possible.
        </Typography>

        {submitSuccess ? (
          <>
            <Typography variant="h6" color="green" mb={4}>
              Thank you for reaching out! We will get back to you soon.
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Link
                component="button"
                onClick={() => navigate("/")} // Navigate to homepage
                sx={{ fontWeight: "bold", color: "#2a5298" }}
              >
                Go to Homepage
              </Link>
            </Box>
          </>
        ) : (
          <>
            {submitError && (
              <Typography variant="body1" color="error" mb={2}>
                {submitError}
              </Typography>
            )}
    
    <form onSubmit={handleSubmit}>
      <TextField
        label="Your Name"
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
          backgroundColor: '#e2dfdf',
          }
          }}
        fullWidth
        margin="normal"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Your Email"
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
          backgroundColor: '#e2dfdf',
          }
          }}
        fullWidth
        margin="normal"
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        required
      />
      <TextField
        label="Your Message"
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
          backgroundColor: '#e2dfdf',
          }
          }}
        fullWidth
        margin="normal"
        name="message"
        value={formData.message}
        onChange={handleChange}
        multiline
        rows={4}
        required
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: "rgba(74, 12, 110, 0.88)",  // Purple color
          "&:hover": {
            backgroundColor: "rgba(151, 21, 227, 0.88)",  // Darker purple on hover
          },
        }}
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Send Message"}
      </Button>
    </form>
  </>
)}

      </Container>
    </Box>
  );
};

export default ContactUs;
