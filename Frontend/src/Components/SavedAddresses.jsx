import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';

const SavedAddresses = ({ user }) => {
  const [addressList, setAddressList] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const res = await axios.get(`https://manglore-store-t98r.onrender.com/api/address/${user._id}`);
        setAddressList(res.data);
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user?._id]);

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`https://manglore-store-t98r.onrender.com/api/address/${user._id}/${addressId}`);
      setAddressList(prev => prev.filter(addr => addr._id !== addressId));
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  if (loadingAddresses) {
    return <Typography fontSize={14}>Loading addresses...</Typography>;
  }

  if (addressList.length === 0) {
    return <Typography fontSize={14}>No saved Addresses yet.</Typography>;
  }

  return addressList.map((addr) => (
    <Box key={addr._id} sx={{ mb: 1, p: 1, border: "1px solid #ccc", borderRadius: 1, position: "relative" }}>
      <Typography fontSize={13}>House No. & Floor: {addr.house || "N/A"}</Typography>
      <Typography fontSize={13}>Building & Block No.: {addr.area || "N/A"}</Typography>
      <Typography fontSize={13}>Landmark & Area Name: {addr.landmark || "N/A"}</Typography>
      <Button
        variant="outlined"
        color="error"
        size="small"
        sx={{ position: "absolute", top: 8, right: 8 }}
        onClick={() => handleDeleteAddress(addr._id)}
      >
        Delete
      </Button>
    </Box>
  ));
};

export default SavedAddresses;
