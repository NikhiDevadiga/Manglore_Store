import React, { useState, useEffect } from 'react';
import {
  Drawer, Box, Typography, IconButton, Divider, List, ListItem,
  ListItemAvatar, Avatar, ListItemText, Button, TextField, RadioGroup,
  FormControlLabel, Radio, Collapse, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mongoose from 'mongoose';

// Razorpay loader function
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartDrawer({ open, onClose }) {
  const { cartItems, changeQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const finalTotal = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => {
      const price = parseFloat(item?.offerPrice ?? item?.price) || 0;
      const quantity = parseInt(item?.quantity) || 0;
      return sum + price * quantity;
    }, 0)
    : 0;

  const totalGST = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => {
      const price = parseFloat(item?.offerPrice ?? item?.price) || 0;
      const quantity = parseInt(item?.quantity) || 0;
      const gst = parseFloat(item?.gst) || 0;
      const itemTotal = price * quantity;
      const gstAmount = (itemTotal * gst) / 100;
      return sum + gstAmount;
    }, 0)
    : 0;

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('Cash on Delivery');
  const [location, setLocation] = useState({ lat: '', lon: '' });
  const [address, setAddress] = useState({ house: '', area: '', landmark: '' });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [addressesOpen, setAddressesOpen] = useState(false);
  const [fetchedAddress, setFetchedAddress] = useState("");
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?._id) return;

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`https://manglore-store-t98r.onrender.com/api/address/${user._id}`);
        setSavedAddresses(res.data); // Adjust this if your API returns a nested structure
      } catch (err) {
        console.error("Failed to fetch saved addresses:", err.response ? err.response.data : err.message);
      }
    };

    fetchAddresses();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        err => console.error('Location error:', err)
      );
    }
  }, []);

  const handleTogglePayment = () => setPaymentOpen(prev => !prev);
  const handleToggleAddresses = () => setAddressesOpen(prev => !prev);

  const handleSelectAddress = (selectedAddress) => {
    setAddress(selectedAddress);
    setAddressesOpen(false);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
          const data = await res.json();

          const area = data.address.suburb || data.address.neighbourhood || "";
          const block = data.address.block || data.address.county || "";
          const pincode = data.address.postcode || "";
          const village = data.address.village || data.address.town || data.address.city || "";

          const landmark = `${area}, ${block}, ${village} - ${pincode}`;
          setFetchedAddress(landmark);
          setLocation({ lat: coords.latitude, lon: coords.longitude });

          setAddress({
            house: "",
            area: "",
            landmark: landmark.trim(),
          });
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          alert("Failed to fetch address from location.");
        }
      },
      error => {
        console.error("Location error:", error);
        alert(error.code === 1
          ? "Location access denied. Please enable it in your browser settings."
          : "Failed to fetch your location."
        );
      }
    );
  };

  const saveAddressToBackend = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.post(
        `https://manglore-store-t98r.onrender.com/api/address/${user._id}`,
        address,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        // setDialogMessage('Address saved successfully!');
        // setDialogOpen(true);
        setSavedAddresses(response.data.savedAddresses || []);
      } else {
        setDialogMessage(response.data.message || 'Failed to save address.');
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Error saving address:", error.response?.data || error.message);
      setDialogMessage(
        error.response?.data?.message ||
        'Error saving address. Please try again later.'
      );
      setDialogOpen(true);
    }
  };

  const handleProceedPayment = async () => {
    await handleDetectLocation();

    const user = JSON.parse(localStorage.getItem('user'));

    if (cartItems.length === 0) {
      setDialogMessage("Your cart is empty!");
      setDialogOpen(true);
      return;
    }

    if (!address.house || !address.area || !address.landmark) {
      setDialogMessage("Please complete all address details including landmark.");
      setDialogOpen(true);
      return;
    }

    const saveOrderToBackend = async (extra = {}) => {
      const order = {
        items: cartItems,
        total: finalTotal,
        paymentMode,
        address,
        location,
        createdAt: new Date().toISOString(),
        userName: user?.name || "Guest",
        userPhone: user?.phone || "N/A",
        shippingAddress: address,
        paymentId: extra.paymentId || "",
        userId: user?._id || null,
      };

      try {
        console.log("Cart Items: ", cartItems);
        const response = await axios.post('https://manglore-store-t98r.onrender.com/api/admin/createOrders', order);
      } catch (err) {
        console.error("Error saving order:", err.response?.data || err.message);
        setDialogMessage("Failed to place order. Please try again.");
        setDialogOpen(true);
        return false;
      }
      return true;
    };


    if (paymentMode === 'Cash on Delivery') {
      setDialogMessage(`Order placed successfully!\nPayment Mode: ${paymentMode}\nAmount: ₹${finalTotal}`);
      setDialogOpen(true);
      await saveOrderToBackend();
      await saveAddressToBackend();
      clearCart();
      setTimeout(() => onClose(), 4000);
    } else if (paymentMode === 'Razorpay') {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const options = {
        key: "rzp_test_lrZMWApZ00NIHX", // Replace with your real Razorpay key
        amount: finalTotal * 100, // in paisa
        currency: 'INR',
        name: 'Mangalore Store',
        description: 'Order Payment',
        image: 'https://your-logo-url.com/logo.png',
        handler: function (response) {
          saveOrderToBackend({ paymentId: response.razorpay_payment_id });
          setDialogMessage(`Order placed successfully!\nPayment ID: ${response.razorpay_payment_id}\nAmount: ₹${finalTotal}`);
          setDialogOpen(true);
          saveAddressToBackend();
          clearCart();
          setTimeout(() => onClose(), 3500);
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: { color: '#1976d2' }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    }
  };

  const calculateDiscountedPrice = (price, offer) => {
    if (offer?.offerpercentage > 0) {
      return Math.round(price - (price * offer.offerpercentage) / 100);
    }
    return Math.round(price);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, p: 3, display: 'flex', flexDirection: 'column', height: '100%', color: "#ddd", backgroundColor: "#02002ee0" }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose} sx={{ color: "#9c44ce" }}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ my: 0.5 }} />

        {/* Scrollable Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, pr: 1 }}>
          {cartItems.length === 0 ? (
            <Typography sx={{ mt: 2 }}>No items in the cart.</Typography>
          ) : (
            <List>
              {cartItems.map(item => (
                <ListItem key={item._id} sx={{ mb: 2, p: 1, border: '1px solid #ddd', borderRadius: 2 }}>
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={item.image || 'https://via.placeholder.com/100'} sx={{ width: 64, height: 64, mr: 2 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: "#9c44ce" }}>
                        <IconButton size="small" sx={{ color: "#9c89ce" }} onClick={() => changeQuantity(item._id, item.quantity - 1)}>
                          <RemoveCircleOutlineIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                        <IconButton size="small" sx={{ color: "#9c89ce" }} onClick={() => changeQuantity(item._id, item.quantity + 1)}>
                          <AddCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography fontWeight="bold" fontSize="1rem" color="secondary">
                      ₹{calculateDiscountedPrice(Number(item.price), item.offer) * item.quantity}
                    </Typography>

                    {item.offer?.offerpercentage > 0 && (
                      <Typography
                        fontSize="0.75rem"
                        sx={{ textDecoration: "line-through", color: "gray" }}
                      >
                        ₹{Number(item.price) * item.quantity}
                      </Typography>
                    )}

                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeFromCart(item._id)}
                      sx={{ mt: 1 }}
                    >
                      Remove
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}

          {/* Payment Summary Toggle */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mt: 2 }}
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">To Pay</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ color: "#9c89ce" }} >(Incl. all taxes and charges)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" >₹ {(finalTotal + totalGST).toFixed(2)}</Typography>
              {showPriceBreakdown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Box>

          <Collapse in={showPriceBreakdown} timeout="auto" unmountOnExit sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ color: "#9c44ce" }} >Item Total</Typography>
              <Typography variant="body2" sx={{ color: "#9c89ce" }} >₹ {finalTotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ color: "#9c44ce" }} >GST (Incl.)</Typography>
              <Typography variant="body2" sx={{ color: "#9c89ce" }} >₹ {totalGST.toFixed(2)}</Typography>
            </Box>
          </Collapse>

          {/* Payment Options */}
          <RadioGroup
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            sx={{ mt: 2, display: 'flex', flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' }}
          >
            <FormControlLabel value="Cash on Delivery" control={<Radio size="small" color="error" />} label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Cash on Delivery</Typography>} />
            <FormControlLabel value="Razorpay" control={<Radio size="small" color="error" />} label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Razorpay</Typography>} />
          </RadioGroup>

          <Button variant="outlined" fullWidth sx={{ mt: 2, fontSize: '0.8rem', color: "#ddd", borderColor: "#ddd", fontWeight: "bold" }} onClick={handleDetectLocation}>
            Current Location
          </Button>
          {fetchedAddress && (
            <Typography variant="subtitle2" sx={{ mt: 1, color: 'text.secondary' }}>
              {fetchedAddress}
            </Typography>
          )}

          {/* Saved Addresses Section */}
          <Box sx={{ cursor: 'pointer', mt: 2 }} onClick={handleToggleAddresses}>
            <Typography variant="subtitle1" fontWeight="bold">Saved Addresses</Typography>
            {addressesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          <Collapse in={addressesOpen} timeout="auto" unmountOnExit sx={{ mt: 1 }}>
            <Box sx={{ maxHeight: 130, overflowY: 'auto', pr: 1, mb: 2 }}>
              <List>
                {savedAddresses.map((savedAddress, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleSelectAddress(savedAddress)}
                    sx={{ mb: 1, border: '1px solid #ddd', borderRadius: 2 }}
                  >
                    <ListItemText
                      primary={`${savedAddress.house}, ${savedAddress.area}`}
                      secondary={`Landmark: ${savedAddress.landmark}`}
                      secondaryTypographyProps={{ style: { color: '#ddd' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>

          {/* Address Input Fields */}
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="House No. & Block No."
              sx={{
                mt: 1,
                '& .MuiInputBase-root': {
                  color: 'white', // text color
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.3)', // label color
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', // border color
                },
              }}
              value={address.house}
              onChange={(e) => setAddress({ ...address, house: e.target.value })}
            />
            <TextField
              fullWidth
              size="small"
              label="Landmark & Area Name"
              sx={{
                mt: 1,
                '& .MuiInputBase-root': {
                  color: 'white', // text color
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.3)', // label color
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', // border color
                },
              }}
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
            />
            <TextField
              fullWidth
              size='small'
              label="Village Name & Pincode"
              sx={{
                mt: 1,
                '& .MuiInputBase-root': {
                  color: 'white', // text color
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.3)', // label color
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', // border color
                },
              }}
              value={address.landmark}
              onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
            />

            <Button variant="contained" fullWidth sx={{
              mt: 2, textTransform: "none",
              backgroundColor: "rgba(74, 12, 110, 0.88)",
              color: "rgba(244, 244, 244, 0.88)",
              "&:hover": {
                backgroundColor: "rgba(147, 9, 147, 0.88)",
                color: "rgba(255, 255, 255, 0.88)" // a slightly darker shade for hover
              },
            }} onClick={handleProceedPayment}>
              CHECK OUT
            </Button>
            <Button variant="outlined" fullWidth
              sx={{
                mt: 1, color: "#ddd",
                borderColor: "#02002ee0",
                "&:hover": {
                  backgroundColor: "#02002ee0",
                  borderColor: "#02002ee0",
                  color: "#ccc"
                },
              }} onClick={clearCart}>
              Clear Cart
            </Button>
          </Box>
        </Box>

      </Box>

      {/* Order Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Order Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
