import React, { useState, useEffect } from 'react';
import {
  Badge, Box, Button, Typography, Dialog, DialogTitle, DialogContent,
  useMediaQuery, Tooltip, Drawer, IconButton, InputBase
} from '@mui/material';
import { FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import CartDrawer from './CartDrawer';
import ProfileDrawer from './ProfileDrawer';
import { useWishlist } from '../context/Wishlist'

const Navbar = () => {
  const { cartItems = [] } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;
  const navigate = useNavigate();
  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:550px)');
  const user = JSON.parse(localStorage.getItem("user"));

  const [location, setLocation] = useState("Select Location");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const [userDetails, setUserDetails] = useState(null);
  const [editProfileData, setEditProfileData] = useState({ name: '', email: '', phone: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await axios.get(`/api/user/${user._id}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user?._id]);

  const handleDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
          const data = await res.json();
          setLocation(data?.display_name || "Unknown");
          setOpenDialog(false);
        } catch (error) {
          setLocation("Unknown");
          alert("Failed to detect location.");
        }
      },
      (error) => {
        console.error("Location error:", error);
        alert("Unable to fetch location. Please check permissions.");
      }
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue.trim()) {
        axios.get(`https://manglore-store-t98r.onrender.com/api/product?query=${searchValue}`)
          .then(res => setSearchResults(res.data.data))
          .catch(err => console.error("Search API error:", err));
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const handleIconClick = (target) => {
    if (!user) return navigate('/login');
    if (target === 'wishlist') navigate('/wishlist');
    if (target === 'cart') setOpenCartDrawer(true);
    if (target === 'profile') setOpenProfileDrawer(true);
    setOpenMobileDrawer(false); // auto-close on mobile
  };

  const handleProfileUpdate = async () => {
    try {
      setUpdatingProfile(true);
      await axios.put(`https://manglore-store-t98r.onrender.com/api/update/${user._id}`, editProfileData);
      localStorage.setItem('user', JSON.stringify({ ...user, ...editProfileData }));
      setUserDetails(prev => ({ ...prev, ...editProfileData }));
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const renderSearchResults = () => {
    if (!searchValue.trim()) return null;
    return (
      <Box className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <Box
              key={product._id}
              onClick={() => {
                navigate(`/product/by-id/${product._id}`);
                setSearchResults([]);
                setSearchValue('');
              }}
              className="search-result-item"
            >
              <Box>
                <Typography fontWeight="medium" noWrap>{product.name}</Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography sx={{ p: 2 }} color="text.secondary">No products found.</Typography>
        )}
      </Box>
    );
  };

  return (
    <>
      <Box className="navbar-container">
        {isMobile && (
          <IconButton className="mobile-menu-icon" sx={{ color: 'white', fontSize: '1.5rem', mr: 1 }} onClick={() => setOpenMobileDrawer(true)} aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}

        <Box className="navbar-logo">
          <Typography variant="h6" fontWeight="bold">Mangalore Stores</Typography>
        </Box>

        {!isTablet && (
          <>
            <Tooltip title={location} arrow>
              <Button startIcon={<MdMyLocation />} variant="outlined" sx={{ color: "#9d66bd", borderColor: "#9d66bd" }} onClick={() => setOpenDialog(true)} className="location-btn">
                <Box className="location-text">{location}</Box>
              </Button>
            </Tooltip>

            <Box className="search-bar">
              <InputBase
                className="search-input"
                fullWidth
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  color: '#ddd'
                }}
              />
              {renderSearchResults()}
            </Box>

            <Box className="navbar-icons">
              <div onClick={() => handleIconClick('wishlist')} aria-label="wishlist">
                <Badge
                  variant="dot"
                  color="secondary"
                  invisible={wishlistCount === 0}
                >
                  <FaHeart size={20} />
                </Badge>
              </div>
              {user && (
                <div onClick={() => handleIconClick('cart')} aria-label="cart">
                  <Badge badgeContent={totalItems > 0 ? totalItems : null} color="secondary">
                    <FaShoppingCart size={20} />
                  </Badge>
                </div>
              )}
              <div onClick={() => handleIconClick('profile')} aria-label="profile"><FaUser size={20} /></div>
            </Box>
          </>
        )}
      </Box>

      {isMobile && (
        <Box className="search-bar-mobile">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {renderSearchResults()}
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Select a location for delivery</DialogTitle>
        <DialogContent>
          <Button onClick={handleDetectLocation} fullWidth variant="contained" sx={{ backgroundColor: "#02002ee0", color: "#fff" }} startIcon={<MdMyLocation />}>
            Detect My Location
          </Button>
        </DialogContent>
      </Dialog>

      <ProfileDrawer
        open={openProfileDrawer}
        onClose={() => setOpenProfileDrawer(false)}
        user={user}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        editProfileData={editProfileData}
        setEditProfileData={setEditProfileData}
        updatingProfile={updatingProfile}
        handleProfileUpdate={handleProfileUpdate}
        orders={orders}
        loadingOrders={loadingOrders}
        expandedSection={expandedSection}
        setExpandedSection={setExpandedSection}
      />

      <CartDrawer open={openCartDrawer} onClose={() => setOpenCartDrawer(false)} />

      <Drawer anchor="left" open={openMobileDrawer} onClose={() => setOpenMobileDrawer(false)}>
        <Box role="presentation" sx={{ width: 260, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">Menu</Typography>
            <IconButton onClick={() => setOpenMobileDrawer(false)}>
              <span style={{ fontSize: 12 }}>×</span>
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
            <Button onClick={() => handleIconClick('wishlist')} variant="text" sx={{ justifyContent: 'flex-start', color: '#02002ee0', }}>
              Wishlist
            </Button>
            <Button onClick={() => handleIconClick('cart')} variant="text" sx={{ justifyContent: 'flex-start', color: '#02002ee0' }}>
              Cart
            </Button>
            <Button onClick={() => handleIconClick('profile')} variant="text" sx={{ justifyContent: 'flex-start', color: '#02002ee0' }}>
              User Profile
            </Button>
            <Button onClick={() => setOpenDialog(true)} variant="text" sx={{ justifyContent: 'flex-start', color: '#02002ee0' }}>
              your Location
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
