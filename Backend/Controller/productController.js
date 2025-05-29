import mongoose from "mongoose";
import Product from "../Model/productModel.js"

export const createProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
          }
        const products = new Product({
          cat_id: req.body.cat_id,   
          subcat_id: req.body.subcat_id,
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          gst:req.body.gst,
          image: req.file.path,
          weight: req.body.weight, // New field for quantity
          unit: req.body.unit, // New field for unit of measurement
          stockquantity: req.body.stockquantity,
          stockunit:req.body.stockunit,
          offer: {
               offerpercentage: req.body.offerpercentage,
               validTill: req.body.validTill ? new Date(req.body.validTill) : null
            }
          });
        await products.save();
        res.status(201).json({success:true, data:products });
        
    }catch(error){
        console.error("Error in create Product:", error.message);
        res.status(500).json({success:false, message: "Server Error"});
    }
};

// controllers/productController.js
export const getProducts = async (req, res) => {
  try {
    const { query } = req.query; // Extract query parameter from request
    let filter = {};
    if (query) {
      // Ensure we're only searching by product name, not other fields
      filter.name = { $regex: `^${query}`, $options: 'i' }; // Case-insensitive search for name
    }
    // Find products using the filter (only by name if a query is present)
    const products = await Product.find(filter)
      .populate('cat_id', 'name') // Populate category name
      .populate('subcat_id', 'name') // Populate subcategory name
      .select('name image price gst description cat_id subcat_id weight unit stockquantity stockunit offer'); // Select relevant fields
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in fetching products:", error.message);  // Log the error message for debugging
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get single product by product ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select("name image price gst description cat_id subcat_id weight unit stockquantity stockunit offer");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product by ID:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Get product by subcategory ID
export const getProductBy_Id = async (req, res) => {
  try {
    const { subcat_id } = req.params;
    const product = await Product.find({ subcat_id }).select("name image price gst description cat_id subcat_id weight unit stockquantity stockunit offer");

    if (product.length === 0) {
      return res.status(404).json({ success: false, message: "No Product found." });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching Products by Product ID", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      // Check if cat exists
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      // Update fields
      if (req.body.cat_id) existingProduct.cat_id = req.body.cat_id;
      if (req.body.subcat_id) existingProduct.subcat_id = req.body.subcat_id;
      if (req.body.name) existingProduct.name = req.body.name;
      if (req.body.price) existingProduct.price = req.body.price;
      if (req.body.gst) existingProduct.gst = req.body.gst;
      if (req.body.description) existingProduct.description = req.body.description;
      if (req.body.weight) existingProduct.weight = req.body.weight;
      if (req.body.unit) existingProduct.unit = req.body.unit;
      if (req.body.stockquantity) existingProduct.stockquantity = req.body.stockquantity;
      if(req.body.stockunit) existingProduct.stockunit = req.body.stockunit;
      if (req.file) existingProduct.image = req.file.path;
      if (req.body.offerpercentage !== undefined || req.body.validTill !== undefined) {
        existingProduct.offer = {
          offerpercentage: req.body.offerpercentage || 0,
          validTill: req.body.validTill || null
        };
      }

      await existingProduct.save();
      res.status(200).json({ success: true, data: existingProduct });
    } catch (error) {
      console.error("Error updating Product:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };


export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // Step 1: Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product ID" });
  }
  try {
    // Step 2: Find the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    // Step 3: Check stock quantity
    if (product.stockquantity <= 0) {
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Product deleted" });
  } else {
    return res.status(400).json({
      success: false,
      message: "Cannot delete product. Stock quantity is greater than 0."
    });
  }
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
