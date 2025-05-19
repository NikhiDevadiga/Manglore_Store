import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const AboutUs = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "#9c88ce" }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#02002ee0" }}
          >
            About Us
          </Typography>
          <Typography variant="h6" sx={{ color: "#02003ee0" }}>
            Your One-Stop Shop for Authentic Mangalorean Essentials
          </Typography>
        </Box>

        {/* 3 Cards */}
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: "Our Journey",
              content:
                "Based in the heart of Mangalore, our store brings you a blend of authentic local products and everyday essentials from across India. Whether it’s traditional favorites or daily needs, we’re here to serve our community with quality and care.",
            },
            {
              title: "What We Offer",
              content:
                "We offer a thoughtfully curated selection of products — from authentic Mangalorean items to daily household essentials, groceries, snacks, and more. Whether you're shopping for traditional goods or modern-day needs, you'll find everything under one roof.",
            },
            {
              title: "Why Choose Us",
              content:
                "As a local Mangalore-based store, we combine cultural authenticity with everyday convenience. Our focus on quality, variety, and customer care ensures you get the best — whether it’s coastal specialties or trusted daily essentials.",
            },
          ].map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  maxWidth: 320, // small card width
                  mx: "auto", // center horizontally
                  height: 280,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  '&:hover': {
                    transform: "scale(1.05)",
                    boxShadow: 8,
                  },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  background: "#e2dfdf",
                  color: "#02003ee0",
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;
