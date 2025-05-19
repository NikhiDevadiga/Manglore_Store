import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BreadCrumbs from "../Components/BreadCrumbsNav";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

const ProductBrowser = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  return (
    <Box p={2} mb={10}>
      <BreadCrumbs />
      <Typography variant="h6" mb={3} fontWeight="bold">
        Categories
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {categories.map((category) => (
          <Grid
            item
            key={category._id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            display="flex"
            justifyContent="center"
          >
            <Card
              onClick={() => navigate(`/subcategory/${category._id}`)}
              sx={{
                cursor: "pointer",
                width: 250,
                "&:hover": {
                  boxShadow: "0px 4px 20px #02002ee0",
                },
              }}
            >
              <CardMedia
                component="img"
                image={`http://localhost:5000/${category.image.replace(/\\/g, "/")}`}
                alt={category.name}
                sx={{
                  objectFit: "fill",
                  width: 250,
                  height: 250,
                  mx: "auto",
                }}
              />
              <CardContent>
                <Typography fontSize={14} align="center" fontWeight="bold">
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductBrowser;
