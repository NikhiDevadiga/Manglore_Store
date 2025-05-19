import express from "express";
import { createCat, getCat, deleteCat, updateCat } from "../Controller/categoryController.js";
import upload from "../middleware/upload.js"

const router = express.Router();

router.post("/category",upload.single('image'), createCat);
router.get("/category", getCat);
router.put("/category/:id",upload.single('image'), updateCat);
router.delete("/category/:id",deleteCat);

export default router;