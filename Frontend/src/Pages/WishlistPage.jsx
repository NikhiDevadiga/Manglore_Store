import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useWishlist } from "../context/Wishlist";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
    toast.success("Product added to cart from Wishlist!");
  };

  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }} mb={12} >
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" color="#02002ee0">
          My Wishlist
        </Typography>
      </Box>

      {wishlist.length === 0 ? (
        <Typography>No items in wishlist.</Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(4, 1fr)",
            md: "repeat(6, 1fr)",
          }}
          gap={1}
        >
          {wishlist.map((product) => (
            <Card
              key={product._id}
              sx={{
                width: "90%",
                maxWidth: 300,
                mx: "auto",
                borderRadius: 2,
              }}
            >
              <CardMedia
                component="img"
                image={`http://localhost:5000/${product.image.replace(/\\/g, "/")}`}
                alt={product.name}
                sx={{
                  height: 120,
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }}
              />
              <CardContent sx={{
                p: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{product.price}
                </Typography>
              </CardContent>
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="flex"
                gap={1}
                p={1}
                pb={1}
              >
                <Button
                  onClick={() => removeFromWishlist(product._id)}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "#02002ee0",
                    borderColor: "#02002ee0",
                    "&:hover": {
                      backgroundColor: "#02002ee0",
                      borderColor: "#02002ee0",
                      color:"#ccc"
                    },
                  }}
                >
                  Remove
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(product)}
                  size="small"
                  sx={{
                     color: "rgba(74, 12, 110, 0.88)",
                    borderColor: "rgba(74, 12, 110, 0.88)",
                    "&:hover": {
                      backgroundColor: "rgba(74, 12, 110, 0.88)",
                      borderColor: "rgba(74, 12, 110, 0.88)",
                      color:"#ccc"
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WishlistPage;
