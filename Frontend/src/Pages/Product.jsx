import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import BreadCrumbs from "../Components/BreadCrumbsNav";
import {
  Box, Grid, Card, CardMedia, CardContent, Typography,
  Button, Stack, CircularProgress
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useWishlist } from "../context/Wishlist";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Product = () => {
  const { subcategoryId, id } = useParams();
  const location = useLocation();
  const isSingleProductPage = location.pathname.includes("/product/by-id/");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistedProducts, setWishlistedProducts] = useState([]);

  useEffect(() => {
    // Assuming `wishlist` is an array of product objects with _id
    const wishlistedIds = wishlist.map((item) => item._id);
    setWishlistedProducts(wishlistedIds);
  }, [wishlist]);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (isSingleProductPage && id) {
          const res = await axios.get(`http://localhost:5000/api/product/by-id/${id}`);
          const product = res.data?.data || res.data;
          setProducts(product && product._id ? [product] : []);
        } else if (subcategoryId) {
          const res = await axios.get(`http://localhost:5000/api/product/${subcategoryId}`);
          const data = res.data.data;
          setProducts(Array.isArray(data) ? data : [data]);
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        toast.error("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategoryId, id, isSingleProductPage]);

  const handleAddToWishlist = (product) => {
    if (wishlistedProducts.includes(product._id)) {
      removeFromWishlist(product._id); // Assuming you have this function
      setWishlistedProducts((prev) =>
        prev.filter((id) => id !== product._id)
      );
      toast.info("Product removed from Wishlist");
    } else {
      addToWishlist(product);
      setWishlistedProducts((prev) => [...prev, product._id]);
      toast.success("Product added to Wishlist");
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Product added to Cart");
  };

  const calculateDiscountedPrice = (price, offer) => {
    if (!offer || !offer.offerpercentage) return price;
    const discount = (price * offer.offerpercentage) / 100;
    return (price - discount).toFixed(2);
  };

  const formatImagePath = (path) =>
    `http://localhost:5000/${path?.replace(/\\/g, "/")}`;

  const isLowStock = (quantity, unit) => {
    if (!quantity || !unit) return false;

    switch (unit) {
      case "kg":
      case "liter":
        return quantity <= 5;
      case "g":
      case "ml":
        return quantity <= 5000;
      case "unit":
        return quantity <= 50;
      default:
        return false;
    }
  };

  return (
    <Box p={2} mb={10}>
      <BreadCrumbs />
      <Typography variant="h6" mb={2} fontWeight="bold">
        Products
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid
              item
              key={product._id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  width: 250,
                  cursor: "pointer",
                  border: isLowStock(product.stockquantity, product.stockunit) ? "2px solid red" : "none",
                  "&:hover": {
                    boxShadow: "0px 4px 20px #02002ee0",
                  },
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  position: 'relative', // needed for absolute badge
                }}
              >
                {
                  isLowStock(product.stockquantity, product.stockunit) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: 'red',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        fontSize: '0.75rem',
                        borderRadius: 1,
                        zIndex: 1,
                      }}
                    >
                      Low Stock
                    </Box>
                  )
                }
                <CardMedia
                  component="img"
                  image={formatImagePath(product.image)}
                  alt={product.name}
                  sx={{
                    height: 200,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 1.5,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" align="center">
                    {product.name}
                    <Box component="span" fontSize="0.75rem" ml={1} color="text.secondary">
                      ({product.weight}{product.unit})
                    </Box>
                  </Typography>

                  {product.offer?.offerpercentage > 0 && (
                    <Box
                      sx={{
                        backgroundColor: "#e53935",
                        color: "#fff",
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: "fit-content",
                        mx: "auto",
                        mt: 0.5,
                        mb: 1,
                      }}
                    >
                      {product.offer.offerpercentage}% OFF
                    </Box>
                  )}

                  <Typography
                    variant="subtitle1"
                    align="center"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    ₹{calculateDiscountedPrice(Number(product.price), product.offer)}
                    {product.offer?.offerpercentage > 0 && (
                      <Box
                        component="span"
                        fontSize="0.75rem"
                        ml={1}
                        sx={{ textDecoration: "line-through", color: "gray" }}
                      >
                        ₹{product.price}
                      </Box>
                    )}
                    <Box component="span" fontSize="0.75rem" ml={0.5}>
                      + {product.gst}% GST
                    </Box>
                  </Typography>

                  {product.offer?.validTill && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      align="center"
                      display="block"
                      mt={0.5}
                    >
                      Valid Till: {new Date(product.offer.validTill).toLocaleDateString()}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      maxHeight: 55,
                      overflow: "auto",
                      textAlign: "center",
                    }}
                  >
                    {product.description}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      variant="outlined"
                      startIcon={<ShoppingCartIcon />}
                      fullWidth
                      sx={{
                        textTransform: "none",
                        backgroundColor: "rgb(243, 245, 244)",
                        color: "#02002ee0",
                        borderColor: "#02002ee0",
                        "&:hover": {
                          backgroundColor: "#02002ee0",
                          color: "#fff",
                          borderColor: "transparent",
                        },
                      }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>

                    <Button
                      variant={wishlistedProducts.includes(product._id) ? "contained" : "outlined"}
                      startIcon={<FavoriteBorderIcon />}
                      fullWidth
                      sx={{
                        textTransform: "none",
                        backgroundColor: wishlistedProducts.includes(product._id)
                          ? "rgba(74, 12, 110, 0.88)"
                          : "rgb(243, 245, 244)",
                        color: wishlistedProducts.includes(product._id)
                          ? "#fff"
                          : "rgba(74, 12, 110, 0.88)",
                        borderColor: "rgba(74, 12, 110, 0.88)",
                        "&:hover": {
                          backgroundColor: "rgba(74, 12, 110, 0.88)",
                          color: "#fff",
                          borderColor: "transparent",
                        },
                      }}
                      onClick={() => handleAddToWishlist(product)}
                    >
                      {wishlistedProducts.includes(product._id) ? "Wishlisted" : "Wishlist"}
                    </Button>
                  </Stack>
                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Product;
