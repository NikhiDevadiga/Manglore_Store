import express from "express";
import { createProduct , getProducts, getProductById , getProductBy_Id, updateProduct, deleteProduct} from "../Controller/productController.js";
import upload from "../middleware/upload.js"

const router = express.Router();

router.post("/product",upload.single('image'), createProduct);
router.get("/product", getProducts);
router.get('/product/by-id/:id', getProductById);
router.get("/product/:subcat_id", getProductBy_Id);
router.put("/product/:id",upload.single('image'), updateProduct);
router.delete("/product/:id", deleteProduct);


export default router;