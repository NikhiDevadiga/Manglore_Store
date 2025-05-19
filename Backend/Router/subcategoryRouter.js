import express from "express";
import { createSubCat, getSubCat, getSubCatBy_Id, deleteSubCat, updateSubCat } from "../Controller/subcategoryController.js";
import upload from "../middleware/upload.js"

const router = express.Router();

router.post("/subcategory",upload.single('image'), createSubCat);
router.get("/subcategory", getSubCat);
router.get("/:cat_id", getSubCatBy_Id);
router.put("/subcategory/:id",upload.single('image'), updateSubCat);
router.delete("/subcategory/:id",deleteSubCat);

export default router;