import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextField
} from '@mui/material';
import axios from 'axios';

const API_BASE = "https://manglore-store-t98r.onrender.com/api";

export default function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/admin/getorders`);
        setOrders(res.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (event) => setFilter(event.target.value);
  const handleSortChange = (event) => setSort(event.target.value);

    const processedOrders = orders
    .filter(order => {
      const mode = order.paymentMode?.toLowerCase();
      if (filter === 'cod') return mode === 'cash on delivery';
      if (filter === 'razorpay') return mode?.includes('razorpay');
      return true;
    })
    .filter(order => {
      if (!startDate && !endDate) return true;
      const orderDate = new Date(order.createdAt);

      let from = startDate ? new Date(startDate) : null;
      let to = endDate ? new Date(endDate) : null;
      
      if (from) {
        from.setHours(0, 0, 0, 0);
      }
      if (to) {
        to.setHours(23, 59, 59, 999);
      }

      if (from && orderDate < from) return false;
      if (to && orderDate > to) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'high') return b.total - a.total;
      if (sort === 'low') return a.total - b.total;
      return 0;
    });

  const totalSales = processedOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Customer Orders</Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size='small'>
            <InputLabel id="payment-filter-label">Filter by Payment Mode</InputLabel>
            <Select
              labelId="payment-filter-label"
              value={filter}
              label="Filter by Payment Mode"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="cod">Cash on Delivery</MenuItem>
              <MenuItem value="razorpay">Online Payment (Razorpay)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size='small'>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sort}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="latest">Date: Latest First</MenuItem>
              <MenuItem value="oldest">Date: Oldest First</MenuItem>
              <MenuItem value="high">Total Amount: High to Low</MenuItem>
              <MenuItem value="low">Total Amount: Low to High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            size='small'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            size='small'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 4, mb: 2, color:"#02002ee0" }}>
        <Typography variant="h6">
          <b>Total Sales:</b> ₹{totalSales}
        </Typography>
        <Typography variant="h6">
          <b>Number of Sales:</b> {processedOrders.length}
        </Typography>
      </Box>


      {processedOrders.length === 0 ? (
        <Typography>No orders to display.</Typography>
      ) : (
        processedOrders.map(order => (
          <Paper key={order._id || order.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1"><b>Order ID:</b> {order._id || order.id}</Typography>
            <Typography variant="body2"><b>Customer: </b>{order.userName}</Typography>
            <Typography variant="body2"><b>Phone: </b>{order.userPhone}</Typography>
            <Typography variant="body2"><b>Payment Mode: </b>{order.paymentMode}</Typography>
            <Typography variant="body2"><b>Payment ID: </b>{order.paymentId}</Typography>
            <Typography variant="body2"><b>Total: </b>₹{order.total}</Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(order.createdAt).toLocaleString()}
            </Typography>

            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2"><b>Shipping Address:</b></Typography>
            <Typography variant="body2">
              {order.shippingAddress?.house}, {order.shippingAddress?.area},<br />
              {order.shippingAddress?.landmark}
            </Typography>

            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2"><b>Items</b></Typography>
            <List dense>
              {order.items.map(item => (
                <ListItem key={item._id}>
                  <ListItemText
                    primary={`${item.name} (x${item.quantity})`}
                    secondary={`₹${item.price * item.quantity}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))
      )}
    </Box>
  );
}
