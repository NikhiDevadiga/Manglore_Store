import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BreadcrumbsNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();

  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");

  // Fetch category name
  useEffect(() => {
    if (categoryId) {
      axios
      axios.get(`https://manglore-store-t98r.onrender.com/api/${categoryId}`)
        .then((res) => setCategoryName(res.data?.data?.name || "Category"))
        .catch(() => setCategoryName("Category"));
    }
  }, [categoryId]);

  // Fetch subcategory name
  useEffect(() => {
    if (subcategoryId) {
      axios
        .get(`https://manglore-store-t98r.onrender.com/api/product/${subcategoryId}`)
        .then((res) => setSubcategoryName(res.data?.data?.name || "Subcategory"))
        .catch(() => setSubcategoryName("Subcategory"));
    }
  }, [subcategoryId]);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link
        underline="hover"
        color="inherit"
        onClick={() => navigate("/")}
        sx={{ cursor: "pointer" }}
      >
        Home
      </Link>

      {categoryId && (
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate(`/category/${categoryId}`)}
          sx={{ cursor: "pointer" }}
        >
          {categoryName}
        </Link>
      )}

      {subcategoryId && (
        <Typography color="text.primary">
          {subcategoryName}
        </Typography>
      )}

      {!categoryId && !subcategoryId && (
        <Typography color="text.primary">Categories</Typography>
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;
