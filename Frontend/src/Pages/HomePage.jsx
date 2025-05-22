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
  useTheme,
  useMediaQuery,
} from "@mui/material";

const ProductBrowser = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    axios
      .get("https://manglore-store-t98r.onrender.com/api/category")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

   return (
    <Box px={{ xs: 1, sm: 2, md: 4 }} py={2} mb={10}>
      <BreadCrumbs />

      <Grid container spacing={2} mb={4} justifyContent="center"> {/* Light Purple Section – First Two Cards */} <Grid item xs={12}> <Box sx={{ backgroundColor: "#f4e6f6", padding: 2, borderRadius: 2, }} > <Grid container spacing={2} justifyContent="center"> {[{ img: "/images/Food Grains.png", alt: "Food Grains", link: "/product/6809c6a535fbcb19f6cd8156" }, { img: "/images/Clay.png", alt: "Clay", link: "/product/6809c97f35fbcb19f6cd8246" },].map((item, index) => (<Grid key={index} item xs={12} sm={6} md={4}> <Card sx={{ borderRadius: 3, overflow: "hidden", cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s", "&:hover": { transform: "scale(1.02)", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", }, }} onClick={() => navigate(item.link)} > <CardMedia component="img" image={item.img} alt={item.alt} sx={{ width: "100%", height: { xs: 140, sm: 180, md: 220 }, objectFit: "cover", }} /> </Card> </Grid>))} </Grid> </Box> </Grid>
        {/* Light Gray Section – Remaining Three Cards */}
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2} justifyContent="center">
              {[
                { img: "/images/Baby.png", alt: "Baby Care", link: "/product/6809c9e335fbcb19f6cd825e" },
                { img: "/images/Personal.png", alt: "Personal", link: "/product/6809c9fc35fbcb19f6cd8266" },
                { img: "/images/Dryfruits.png", alt: "Dryfruits", link: "/subcategory/67ff885bee574cb5df2e45c7" },
              ].map((item, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                      },
                    }}
                    onClick={() => navigate(item.link)}
                  >
                    <CardMedia
                      component="img"
                      image={item.img}
                      alt={item.alt}
                      sx={{
                        width: "100%",
                        height: { xs: 140, sm: 180, md: 220 },
                        objectFit: "cover",
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Typography
        variant={isMobile ? "h6" : "h5"}
        mb={3}
        fontWeight="bold"
      >
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
                image={`https://manglore-store-t98r.onrender.com/${category.image.replace(/\\/g, "/")}`}
                alt={category.name}
                sx={{
                  objectFit: "fill",
                  width: 250,
                  height: 250,
                  mx: "auto"
                }}
              />
              <CardContent>
                <Typography
                  fontSize={{ xs: 14, sm: 16 }}
                  align="center"
                  fontWeight="bold"
                >
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
