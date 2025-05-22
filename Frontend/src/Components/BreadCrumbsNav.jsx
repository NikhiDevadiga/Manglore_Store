import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BreadcrumbsNav = () => {
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();

  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");

  // Fetch category name when categoryId changes
  useEffect(() => {
    if (categoryId) {
      axios
        .get(`https://manglore-store-t98r.onrender.com/api/categories/${categoryId}`)
        .then((res) => {
          const name = res?.data?.data?.name || "Category";
          setCategoryName(name);
        })
        .catch(() => setCategoryName("Category"));
    } else {
      setCategoryName("");
    }
  }, [categoryId]);

  // Fetch subcategory name when subcategoryId changes
  useEffect(() => {
    if (subcategoryId) {
      axios
        .get(`https://manglore-store-t98r.onrender.com/api/subcategories/${subcategoryId}`)
        .then((res) => {
          const name = res?.data?.data?.name || "Subcategory";
          setSubcategoryName(name);
        })
        .catch(() => setSubcategoryName("Subcategory"));
    } else {
      setSubcategoryName("");
    }
  }, [subcategoryId]);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {/* Home always present */}
      <Link
        underline="hover"
        color="inherit"
        onClick={() => navigate("/")}
        sx={{ cursor: "pointer" }}
      >
        Home
      </Link>

      {/* Category - clickable if categoryId exists */}
      {categoryId && (
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate(`/category/${categoryId}`)}
          sx={{ cursor: "pointer" }}
        >
          {categoryName || "Category"}
        </Link>
      )}

      {/* Subcategory - current page, so no link */}
      {subcategoryId && (
        <Typography color="text.primary">
          {subcategoryName || "Subcategory"}
        </Typography>
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;
