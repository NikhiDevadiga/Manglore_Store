import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Button, ButtonGroup, TextField, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, AppBar, Toolbar, Typography, InputBase, MenuItem, FormControl, InputLabel, Select
} from "@mui/material";
import { Add, Edit, Delete, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import OrdersPanel from "./OrderPanel";

const gstOptions = Array.from({ length: 19 }, (_, i) => i);
// const offerOptions = Array.from({ length: 100 }, (_, i) => i);
const API_BASE = "http://localhost:5000/api";

const AdminPage = () => {
  const [activeMainTab, setActiveMainTab] = useState("itemDetails"); // New
  const [activeSection, setActiveSection] = useState("category");
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [data, setData] = useState({
    category: [],
    subcategory: [],
    product: []
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    itemId: null
  });
  const [forms, setForms] = useState({
    category: { name: "", image: null },
    subcategory: { name: "", cat_id: "", image: null },
    product: { name: "", price: "", gst: "", weight: "", unit: "", description: "", cat_id: "", subcat_id: "", stockquantity: "", stockunit: "", offerpercentage: "", validTill: "", image: null },
  });

  const [searchTerm, setSearchTerm] = useState(""); // New for search

  const fetchData = async () => {
    try {
      const [catRes, subcatRes, prodRes] = await Promise.all([
        axios.get(`${API_BASE}/category`),
        axios.get(`${API_BASE}/subcategory`),
        axios.get(`${API_BASE}/product`)
      ]);
      setData({
        category: catRes.data.data,
        subcategory: subcatRes.data.data,
        product: prodRes.data.data
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //for fetching user queries
  const [userQueries, setUserQueries] = useState([]);
  useEffect(() => {
    if (activeMainTab === "userQueries") {
      axios.get(`${API_BASE}/admin/messages`)
        .then(res => setUserQueries(res.data.data))
        .catch(err => console.error("Error fetching user queries:", err));
    }
  }, [activeMainTab]);

  //for fetching users list
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (activeMainTab === "userDetails") {
      axios.get(`${API_BASE}/users/list`)
        .then(res => setUsers(res.data.data))  // or just res.data if no wrapping
        .catch(err => console.error("Error fetching users:", err));
    }
  }, [activeMainTab]);

  const handleFormChange = (e, section) => {
    const { name, value } = e.target;
    setForms(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
  };

  const handleImageChange = (e, section) => {
    setForms(prev => ({ ...prev, [section]: { ...prev[section], image: e.target.files[0] } }));
  };

  const handleSubmit = async () => {
    const form = new FormData();
    Object.entries(forms[activeSection]).forEach(([key, val]) => form.append(key, val));
    try {
      await axios.post(`${API_BASE}/${activeSection}`, form);
      alert("Saved successfully");
      fetchData();
      setForms({ ...forms, [activeSection]: {} });
      setShowDialog(false);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error saving.");
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item._id);
    setEditFields({
      name: item.name || "",
      price: item.price || "",
      weight: item.weight || "",
      unit: item.unit || "",
      gst: item.gst || "",
      description: item.description || "",
      image: null,
      cat_id: item.cat_id?._id || item.cat_id || "",
      subcat_id: item.subcat_id?._id || item.subcat_id || "",
      stockquantity: item.stockquantity || "",
      stockunit: item.stockunit || "",
      offerpercentage: item.offer?.offerpercentage || "",
      validTill: item.offer?.validTill ? item.offer.validTill.split("T")[0] : "", // format for input[type=date]
    });
  };

  const handleUpdate = async (id) => {
    const form = new FormData();
    Object.entries(editFields).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        form.append(key, val);
      }
    });

    try {
      await axios.put(`${API_BASE}/${activeSection}/${id}`, form);
      alert("Updated!");
      fetchData();
      setEditItem(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${activeSection}/${id}`);
      alert("Deleted!");
      fetchData();
    } catch (err) {
      alert("Error deleting.");
    }
  };

  const handleUserQueryDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/admin/messages/${id}`);
      alert("User query deleted!");
      setUserQueries(prev => prev.filter(q => q._id !== id));
    } catch (err) {
      alert("Error deleting user query.");
      console.error(err);
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session or token if stored
    localStorage.removeItem("Manglore-user"); // (if you're using localStorage)
    alert("Logged out successfully!");
    navigate("/adminlogin"); // Navigate to login page
  };

  const renderFormFields = () => {
    const form = forms[activeSection];
    return (
      <>
        <TextField fullWidth name="name" label="Name" value={form.name || ""} onChange={(e) => handleFormChange(e, activeSection)} sx={{ mb: 2 }} />
        {activeSection === "product" && (
          <>
            <TextField fullWidth name="price" label="Price" value={form.price || ""} onChange={(e) => handleFormChange(e, activeSection)} sx={{ mb: 2 }} />
            <TextField fullWidth name="weight" label="Quantity" value={form.weight || ""} onChange={(e) => handleFormChange(e, activeSection)} sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select
                labelId="unit-label"
                name="unit"
                value={form.unit || ""}
                label="Unit"
                onChange={(e) => handleFormChange(e, activeSection)}
              >
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="liter">liter</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="unit">unit</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth select name="gst" label="GST" value={form.gst || ""} onChange={(e) => handleFormChange(e, activeSection)} sx={{ mb: 2 }}>{gstOptions.map((value) => (<MenuItem key={value} value={value}>{value}%</MenuItem>))}</TextField>
            <TextField fullWidth name="description" label="Description" value={form.description || ""} onChange={(e) => handleFormChange(e, activeSection)} sx={{ mb: 2 }} />
            <TextField fullWidth name="stockquantity" label="Available Stock" value={form.stockquantity || ""} onChange={(e) => handleFormChange(e, activeSection)} sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="unit-label">Stock Unit</InputLabel>
              <Select
                labelId="stockunit"
                name="stockunit"
                value={form.stockunit || ""}
                label="Stock-Unit"
                onChange={(e) => handleFormChange(e, activeSection)}
              >
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="liter">liter</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="unit">unit</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth name="offerpercentage" label="Offer Percentage" value={form.offerpercentage || ""} onChange={(e) => handleFormChange(e, activeSection)} sx={{ mb: 2 }} />
            <TextField fullWidth name="validTill" label="Offer Valid Till" type="date" value={form.validTill} onChange={(e) => handleFormChange(e, activeSection)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          </>
        )}
        {["subcategory", "product"].includes(activeSection) && (
          <select name="cat_id" value={form.cat_id} onChange={(e) => handleFormChange(e, activeSection)} style={{ width: "100%", marginBottom: 16, height: "50px", fontSize: "16px", padding: "8px" }}>
            <option value="">Select Category</option>
            {data.category.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        )}
        {activeSection === "product" && (
          <select name="subcat_id" value={form.subcat_id} onChange={(e) => handleFormChange(e, activeSection)} style={{ width: "100%", marginBottom: 16, height: "50px", fontSize: "16px", padding: "8px" }}>
            <option value="">Select Subcategory</option>
            {data.subcategory.filter(sub => (sub.cat_id?._id || sub.cat_id) === form.cat_id)
              .map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
          </select>
        )}
        <input type="file" onChange={(e) => handleImageChange(e, activeSection)} />
      </>
    );
  };

  const renderTable = () => {
    let sectionData = data[activeSection];

    if (searchTerm.trim()) {
      sectionData = sectionData.filter(item =>
        item.name
          .toLowerCase()
          .split(' ')
          .some(word => word.startsWith(searchTerm.toLowerCase()))
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["Image", "Name", ...(activeSection === "subcategory" ? ["Category"] : []),
                ...(activeSection === "product" ? ["Price", "Quantity", "Unit", "Gst", "Description", "Category", "Subcategory", "Available Stock", "Stock Unit", "Offer Percentage", "Offer Valid Till"] : []), "Actions"]
                .map((h, i) => <TableCell key={i} sx={{ fontWeight: "bold", color: "#02002ee0" }}>{h}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {sectionData.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <img src={`${API_BASE.replace('/api', '')}/${item.image}`} width={40} alt="preview" />
                  {editItem === item._id && (
                    <input
                      type="file"
                      style={{ marginTop: 8 }}
                      onChange={(e) =>
                        setEditFields({ ...editFields, image: e.target.files[0] })
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  {editItem === item._id ? (
                    <TextField fullWidth name="name" value={editFields.name} onChange={(e) => setEditFields({ ...editFields, name: e.target.value })} />
                  ) : item.name}
                </TableCell>

                {activeSection === "subcategory" && (
                  <TableCell>
                    {editItem === item._id ? (
                      <select name="cat_id" value={editFields.cat_id} onChange={(e) => setEditFields({ ...editFields, cat_id: e.target.value })}
                        style={{
                          width: "100%",
                          height: "56px",
                          fontSize: "16px",
                          padding: "0 14px",
                          borderRadius: "4px",
                          border: "1px solid rgba(0,0,0,0.23)"
                        }}>
                        <option value="">Select</option>
                        {data.category.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    ) : data.category.find(cat => cat._id === (item.cat_id?._id || item.cat_id))?.name}
                  </TableCell>
                )}

                {activeSection === "product" && (
                  <>
                    <TableCell>
                      {editItem === item._id ? (
                        <TextField fullWidth name="price" value={editFields.price} onChange={(e) => setEditFields({ ...editFields, price: e.target.value })} sx={{ mb: 1 }} />
                      ) : item.price}
                    </TableCell>
                    <TableCell>
                      {editItem === item._id ? (
                        <TextField fullWidth name="weight" value={editFields.weight} onChange={(e) => setEditFields({ ...editFields, weight: e.target.value })} sx={{ mb: 1 }} />
                      ) : item.weight}
                    </TableCell>
                    <TableCell>
                      {editItem === item._id ? (
                        <FormControl fullWidth sx={{ mb: 1 }}>
                          <Select
                            name="unit"
                            value={editFields.unit}
                            onChange={(e) => setEditFields({ ...editFields, unit: e.target.value })}
                          >
                            <MenuItem value="kg">kg</MenuItem>
                            <MenuItem value="g">g</MenuItem>
                            <MenuItem value="liter">liter</MenuItem>
                            <MenuItem value="ml">ml</MenuItem>
                            <MenuItem value="unit">unit</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        item.unit
                      )}
                    </TableCell>
                    <TableCell>
                      {editItem === item._id ? (
                        <TextField
                          fullWidth
                          select
                          name="gst"
                          label="GST"
                          value={editFields.gst || ""}
                          onChange={(e) => setEditFields({ ...editFields, gst: e.target.value })}
                          sx={{ mb: 1 }}
                        >
                          {gstOptions.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}%
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        `${item.gst}%`
                      )}
                    </TableCell>

                    <TableCell>
                      {editItem === item._id ? (
                        <TextField fullWidth name="description" multiline rows={3} value={editFields.description} onChange={(e) => setEditFields({ ...editFields, description: e.target.value })} sx={{ mb: 1 }} />
                      ) : item.description}
                    </TableCell>
                    <TableCell>
                      {editItem === item._id ? (
                        <select name="cat_id" value={editFields.cat_id} onChange={(e) => setEditFields({ ...editFields, cat_id: e.target.value })}
                          SelectProps={{ native: true }} sx={{ flex: 1 }}
                          style={{
                            width: "100%",
                            height: "56px",
                            fontSize: "16px",
                            padding: "0 14px",
                            borderRadius: "4px",
                            border: "1px solid rgba(0,0,0,0.23)"
                          }}>
                          <option value="">Select</option>
                          {data.category.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      ) : data.category.find(cat => cat._id === (item.cat_id?._id || item.cat_id))?.name}
                    </TableCell>
                    <TableCell>
                      {editItem === item._id ? (
                        <select name="subcat_id" value={editFields.subcat_id} onChange={(e) => setEditFields({ ...editFields, subcat_id: e.target.value })}
                          SelectProps={{ native: true }} sx={{ flex: 1 }}
                          style={{
                            width: "100%",
                            height: "56px",
                            fontSize: "16px",
                            padding: "0 14px",
                            borderRadius: "4px",
                            border: "1px solid rgba(0,0,0,0.23)"
                          }}>
                          <option value="">Select</option>
                          {data.subcategory.filter(sub => (sub.cat_id?._id || sub.cat_id) === editFields.cat_id)
                            .map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                        </select>
                      ) : data.subcategory.find(sub => sub._id === (item.subcat_id?._id || item.subcat_id))?.name}
                    </TableCell>
                    <TableCell>
                      {editItem === item._id ? (
                        <TextField fullWidth name="stockquantity" multiline rows={3} value={editFields.stockquantity} onChange={(e) => setEditFields({ ...editFields, stockquantity: e.target.value })} sx={{ mb: 1 }} />
                      ) : item.stockquantity}
                    </TableCell>
                    <TableCell>
                      {editItem === item._id ? (
                        <FormControl fullWidth sx={{ mb: 1 }}>
                          <Select
                            name="stockunit"
                            value={editFields.stockunit}
                            onChange={(e) => setEditFields({ ...editFields, stockunit: e.target.value })}
                          >
                            <MenuItem value="kg">kg</MenuItem>
                            <MenuItem value="g">g</MenuItem>
                            <MenuItem value="liter">liter</MenuItem>
                            <MenuItem value="ml">ml</MenuItem>
                            <MenuItem value="unit">unit</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        item.stockunit
                      )}
                    </TableCell>
                    <TableCell>
                      {editItem === item._id ? (
                        <TextField fullWidth name="offerpercentage" value={editFields.offerpercentage} onChange={(e) => setEditFields({ ...editFields, offerpercentage: e.target.value })} sx={{ mb: 1 }} />
                      ) : item.offer?.offerpercentage}
                    </TableCell>
                    <TableCell>
                      {editItem === item._id ? (
                        <TextField fullWidth name="validTill" type="date" value={editFields.validTill} onChange={(e) => setEditFields({ ...editFields, validTill: e.target.value })} sx={{ mb: 1 }} InputLabelProps={{ shrink: true }} />
                      ) : (
                        item.offer?.validTill ? new Date(item.offer.validTill).toLocaleDateString() : "-"
                      )}
                    </TableCell>
                  </>
                )}

                <TableCell>
                  {editItem === item._id ? (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        style={{ backgroundColor: '#02002ee0', color: '#9c44ce' }}
                        onClick={() => handleUpdate(item._id)}
                      >
                        Update
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        style={{ color: '#9c44ce' }}
                        onClick={() => setEditItem(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEditClick(item)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => setConfirmDialog({ open: true, itemId: item._id })}>
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };


  return (
    <Box>
      {/* Topbar */}
      <AppBar position="static" sx={{ width: '100%', background: "#02002ee0" }}>
        <Toolbar disableGutters>
          <ButtonGroup variant="outlined" sx={{
            '& .MuiButton-root': {
              color: '#ddd',
              borderColor: '#9c89ce',
              '&:hover': {
                backgroundColor: '#9c44ce',
                borderColor: '#ddd',
              },
            },
          }}>
            <Button onClick={() => setActiveMainTab("itemDetails")}>Item Details</Button>
            <Button onClick={() => setActiveMainTab("userDetails")}>User Details</Button>
            <Button onClick={() => setActiveMainTab("orderDetails")}>Order Details</Button>
            <Button onClick={() => setActiveMainTab("userQueries")}>User Queries</Button>
          </ButtonGroup>
          <Box flexGrow={1} />
          <IconButton color="error" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {activeMainTab === "itemDetails" && (
        <Box p={1}>
          {/* Search and Add */}
          <Box display="flex" flexDirection="column" alignItems="stretch" gap={2} mb={2} >
            <ButtonGroup variant="outlined">
              {["category", "subcategory", "product"].map(section => (
                <Button
                  key={section}
                  onClick={() => {
                    setActiveSection(section);
                    setShowDialog(false);
                  }}
                  variant={activeSection === section ? "contained" : "outlined"}
                  sx={{
                    color: "#9c44ce",
                    borderColor: "#02002ee0",
                    '&.MuiButton-contained': {
                      backgroundColor: "#02002ee0",
                      color: "#9c44ce",
                    }
                  }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              ))}
              <IconButton
                onClick={() => setShowDialog(true)}
                sx={{ color: "#02002ee0" }}
              >
                <Add />
              </IconButton>
            </ButtonGroup>

            <InputBase
              placeholder="Search Items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ border: "1px solid darkblue", borderRadius: 1, padding: "1px 8px", width: 300 }}
            />
          </Box>

          {renderTable()}

          {/* Add/Edit Dialog */}
          <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Add {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</DialogTitle>
            <DialogContent>{renderFormFields()}</DialogContent>
            <DialogActions>
              <Button sx={{ color: "#9c44ce" }} onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button variant="contained" sx={{ color: "#9c44ce", background: "#02002ee0" }} onClick={handleSubmit}>Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {activeMainTab === "userDetails" && (
        <Box p={3} >
          <Typography variant="h5" mb={1}>User Details</Typography>
          {users.length === 0 ? (
            <Typography>No users found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Registered On</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {activeMainTab === "orderDetails" && <Box p={3}><OrdersPanel /></Box>}

      {activeMainTab === "userQueries" && (
        <Box p={3}>
          <Typography variant="h6" gutterBottom>User Queries</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userQueries.map((query) => (
                  <TableRow key={query._id}>
                    <TableCell>{query.name}</TableCell>
                    <TableCell>{query.email}</TableCell>
                    <TableCell>{query.message}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleUserQueryDelete(query._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, itemId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button variant="text"
            style={{ color: '#02002ee0' }} onClick={() => setConfirmDialog({ open: false, itemId: null })}>
            Cancel
          </Button>
          <Button
            style={{ color: '#9c44ce' }}
            onClick={() => {
              handleDelete(confirmDialog.itemId);
              setConfirmDialog({ open: false, itemId: null });
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
