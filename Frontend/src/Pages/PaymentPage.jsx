import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('currentOrder');
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      if (parsedOrder?.total > 0) {
        setOrder(parsedOrder);
      } else {
        alert('Invalid payment amount');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!order) return;

    // Ensure the total is a valid number and multiply by 100 for paise
    const amountInPaise = Math.round(parseFloat(order.total.replace(/[^\d.-]/g, '')) * 100);
    console.log('Amount in Paise:', amountInPaise);

    // Check if the amount is valid
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      alert('Invalid payment amount');
      return;
    }

    const prefillData = {
      name: order.customer?.name || 'Guest',
      email: order.customer?.email || 'guest@example.com',
      contact: order.customer?.phone || '9999999999',
    };

    console.log('Prefill Data:', prefillData);

    const options = {
      key: 'rzp_test_HNT9V6YqTfX7tY', // Replace with your actual key
      amount: amountInPaise, // amount in paise
      currency: 'INR',
      name: 'Manglore Stores',
      description: 'Order Payment',
      handler: function (response) {
        console.log('Payment Response:', response);
        alert(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
        sessionStorage.removeItem('currentOrder');
        navigate('/');
      },
      prefill: prefillData,
      notes: {
        address: 'Customer Address', // can be dynamic
      },
      theme: {
        color: '#1abc9c',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!order) return null;

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, width: '100%', maxWidth: 500 }}>
        <Typography variant="h5" gutterBottom>
          Payment Page
        </Typography>

        <Typography variant="body1">
          <strong>Payment Mode:</strong> Razorpay
        </Typography>
        <Typography variant="body1">
          <strong>Total Amount:</strong> ₹{order.total}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Items:</strong>
        </Typography>
        <ul>
          {order.items.map((item) => (
            <li key={item._id}>
              {item.name} × {item.quantity} = ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>

        <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handlePayment}>
          Pay with Razorpay
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentPage;
