import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Drawer, IconButton, Divider,
  Collapse, TextField
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import SavedAddresses from './SavedAddresses';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProfileDrawer = ({
  open, onClose, user, userDetails, setUserDetails,
  editProfileData, setEditProfileData, updatingProfile,
  handleProfileUpdate,
  setExpandedSection, expandedSection
}) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (expandedSection === 'orders' && user?._id) {
      fetchOrders();
    } else if (expandedSection === 'profile' && !userDetails && user?.email) {
      fetchUserDetails();
    }
  }, [expandedSection, user]);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get("https://manglore-store-t98r.onrender.com/api/users/list");
      const matchedUser = res.data.data.find(u => u.email === user?.email);
      setUserDetails(matchedUser);
      setEditProfileData({
        name: matchedUser.name,
        email: matchedUser.email,
        phone: matchedUser.phone
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axios.get(`https://manglore-store-t98r.onrender.com/api/user/${user._id}`);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const generateInvoice = (order) => {
    const doc = new jsPDF();

    // ======= Store Header =======
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Mangalore Store', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Mangalore, Dakshina-Kannada, Udupi Dist, Karnataka - 575001', 20, 26);
    // doc.text('GSTIN: 29ABCDE1234F1Z5', 20, 32); // Optional GSTIN

    // ======= Invoice Title =======
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE / BILL OF SUPPLY', 105, 45, { align: 'center' });

    // ======= Invoice Details =======
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${order._id || order.id}`, 20, 55);
    doc.text(`Order No: ${order._id || order.id}`, 20, 61);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 67);

    doc.text(`Place of Supply: Karnataka (29)`, 200, 55, { align: 'right' });
    doc.text(`Payment Mode: ${order.paymentMode}`, 200, 61, { align: 'right' });
    doc.text(`Payment ID: ${order.paymentId || 'N/A'}`, 200, 67, { align: 'right' });

    // ======= Billing & Shipping Details =======
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, 78);
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.userName}`, 20, 84);
    doc.text(`Phone: ${order.userPhone}`, 20, 90);

    doc.setFont('helvetica', 'bold');
    doc.text('Ship To:', 200, 78, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.shippingAddress?.house}, ${order.shippingAddress?.area}`, 200, 84, { align: 'right' });
    doc.text(`${order.shippingAddress?.landmark || ''}`, 200, 90, { align: 'right' });

    // ======= Table Body =======
    const tableBody = order.items.map((item, index) => {
      const basePrice = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      const gstRate = parseFloat(item?.gst) || 0;

      const hasOffer =
        item.offer &&
        item.offer.offerpercentage &&
        (!item.offer.validTill || new Date(item.offer.validTill) > new Date());

      const offerRate = hasOffer ? item.offer.offerpercentage : 0;
      const offerValidTill = hasOffer && item.offer.validTill
        ? new Date(item.offer.validTill).toLocaleDateString()
        : '—';

      const discountedPrice = hasOffer
        ? basePrice - (basePrice * offerRate) / 100
        : basePrice;

      const itemTotal = discountedPrice * quantity;
      const gstAmount = (itemTotal * gstRate) / 100;
      const finalTotal = itemTotal + gstAmount;

      return [
        index + 1,
        item.name,
        `${basePrice.toFixed(2)}`,
        `${gstRate}%`,
        offerRate ? `${offerRate}%` : '—',
        offerValidTill,
        quantity,
        `${item.weight} ${item.unit}`,
        `${finalTotal.toFixed(2)}`
      ];
    });

    // ======= Product Table =======
    autoTable(doc, {
      startY: 105,
      head: [[
        'S.No', 'Product Name', 'Price', 'GST', 'Offer', 'Valid Till',
        'Qty', 'Weight', 'Total'
      ]],
      body: tableBody,
      styles: {
        fontSize: 9,
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        overflow: 'linebreak',
        halign: 'center', // <-- Center align everything by default
        valign: 'middle',
      },
      headStyles: {
        fillColor: [40, 40, 40],
        textColor: 255,
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 8 },  // S.No
        1: { cellWidth: 50, halign: 'left' }, // Product Name
        2: { cellWidth: 25 },  // Price
        3: { cellWidth: 12 },  // GST
        4: { cellWidth: 12 },  // Offer
        5: { cellWidth: 22 },  // Valid Till
        6: { cellWidth: 9 },  // Qty
        7: { cellWidth: 20 },  // Weight
        8: { cellWidth: 25 },  // Total
      },
      theme: 'grid',
      tableWidth: 'auto', // Adjust to page width
    });


    // ======= Total Summary =======
    const finalY = doc.lastAutoTable.finalY + 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total: ${order.total.toFixed(2)}`, 150, finalY, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Thank you for shopping with us!', 20, finalY + 10);
    doc.text('_________________________', 190, finalY + 18, { align: 'right' });
    doc.text('Authorized Signatory', 190, finalY + 24, { align: 'right' });

    // ======= Save File =======
    doc.save(`Invoice_${order._id || order.id}.pdf`);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#02002ee0', color: '#ddd' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          <div className="drawer-content">
            <IconButton onClick={onClose} sx={{ color: '#9c44ce' }}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" color="#ddd">{user?.name || 'Guest'}</Typography>
            <Typography variant="subtitle1" color="#9c44ce">{user?.email || ''}</Typography>
            <Divider sx={{ my: 1 }} />

            {['orders', 'savedadd', 'support', 'profile'].map((section) => (
              <div key={section}>
                <Button
                  fullWidth
                  onClick={() =>
                    setExpandedSection((prev) =>
                      prev === section ? null : section
                    )
                  }
                  endIcon={
                    <ExpandMore style={{ transform: expandedSection === section ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                  }
                  sx={{ justifyContent: 'space-between', color: '#ddd' }}
                >
                  {{
                    orders: 'Your Orders',
                    savedadd: 'Saved Addresses',
                    support: 'Customer Support',
                    profile: 'Profile',
                  }[section]}
                </Button>
                <Collapse in={expandedSection === section}>
                  <Box mt={1} px={1}>
                    {section === 'orders' && (
                      <>
                        {loadingOrders ? (
                          <Typography>Loading orders...</Typography>
                        ) : orders.length === 0 ? (
                          <Typography>No orders yet.</Typography>
                        ) : (
                          orders.map((order, index) => (
                            <Box key={index} sx={{ mb: 2, border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
                              <Typography variant="body1" fontWeight="bold" sx={{ color: '#9c78ce' }}>
                                Order ID: {order._id}
                              </Typography>
                              <Typography variant="body2">Total: ₹{order.total}</Typography>
                              <Typography variant="body2">Payment Mode: {order.paymentMode}</Typography>
                              <Typography variant="body2">Payment ID: {order.paymentId}</Typography>
                              <Typography variant="body2">
                                Order Date & Time: {new Date(order.createdAt).toLocaleString()}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#9c78ce' }}>Shipping Address:</Typography>
                                <Typography variant="body2">{order.shippingAddress?.house}, {order.shippingAddress?.area}</Typography>
                                <Typography variant="body2">{order.shippingAddress?.landmark}</Typography>
                              </Box>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#9c78ce' }}>Items:</Typography>
                                {order.items?.map((item, idx) => (
                                  <Typography key={idx} variant="body2">
                                    {item.name} x{item.quantity} - ₹{item.price * item.quantity}
                                  </Typography>
                                ))}
                              </Box>
                              <Box sx={{ mt: 2 }}>
                                <Button variant="outlined" color="secondary" size="small" onClick={() => generateInvoice(order)}>
                                  Download Invoice
                                </Button>
                              </Box>
                            </Box>
                          ))
                        )}
                      </>
                    )}

                    {section === 'savedadd' && <SavedAddresses user={user} />}

                    {section === 'support' && (
                      <Box sx={{ mb: 1, p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
                        <Typography variant="body1" color="#9c78ce">We're Here to Help</Typography>
                        <br />
                        <Typography variant="body2">📞 Phone : +919876543210</Typography>
                        <Typography variant="body2">📧 Email : support@mangalorestore.com</Typography>
                      </Box>
                    )}

                    {section === 'profile' && userDetails && (
                      <>
                        <TextField
                          fullWidth
                          label="Name"
                          value={editProfileData.name}
                          onChange={(e) => setEditProfileData({ ...editProfileData, name: e.target.value })}
                          margin="dense"
                          sx={{
                            input: { color: '#ddd' },
                            '& label': { color: '#9c44ce' },
                            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c44ce' } },
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Email"
                          value={editProfileData.email}
                          onChange={(e) => setEditProfileData({ ...editProfileData, email: e.target.value })}
                          margin="dense"
                          sx={{
                            input: { color: '#ddd' },
                            '& label': { color: '#9c44ce' },
                            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c44ce' } },
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Phone"
                          value={editProfileData.phone}
                          onChange={(e) => setEditProfileData({ ...editProfileData, phone: e.target.value })}
                          margin="dense"
                          sx={{
                            input: { color: '#ddd' },
                            '& label': { color: '#9c44ce' },
                            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9c44ce' } },
                          }}
                        />
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            mt: 2, textTransform: "none",
                            backgroundColor: "rgba(74, 12, 110, 0.88)",
                            color: "rgba(244, 244, 244, 0.88)",
                            "&:hover": {
                              backgroundColor: "rgba(147, 9, 147, 0.88)",
                              color: "rgba(255, 255, 255, 0.88)"
                            },
                          }}
                          onClick={handleProfileUpdate}
                          disabled={updatingProfile}
                        >
                          {updatingProfile ? 'Updating...' : 'Update'}
                        </Button>
                      </>
                    )}
                  </Box>
                </Collapse>
              </div>
            ))}
          </div>
        </Box>

        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Button
            variant="outlined"
            sx={{
              mt: 1, color: "#ddd",
              borderColor: "#ddd",
              "&:hover": {
                backgroundColor: "#02002ee0",
                borderColor: "#02002ee0",
                color: "#ccc"
              },
            }}
            fullWidth
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('userToken');
              onClose();
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ProfileDrawer;

